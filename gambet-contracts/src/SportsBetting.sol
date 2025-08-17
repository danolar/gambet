// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Chainlink, ChainlinkClient} from "@chainlink/contracts/src/v0.8/operatorforwarder/ChainlinkClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * @title SportsBetting
 * @dev Contrato inteligente para apuestas deportivas que utiliza Chainlink para obtener resultados de partidos.
 * Los usuarios pueden apostar por el Equipo A, el Equipo B o un Empate. Los resultados se obtienen
 * a través de un oráculo de Chainlink y los ganadores reciben un pago proporcional del pozo total.
 */
contract SportsBetting is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    // Estructuras y Enums
    enum MatchStatus { Open, AwaitingResult, Closed }
    enum Outcome { TeamA, TeamB, Draw }

    struct Bet {
        address payable better;
        Outcome prediction;
        uint256 amount;
    }

    struct Match {
        string description;
        MatchStatus status;
        Outcome result;
        mapping(Outcome => uint256) totalAmount;
        uint256 totalPool;
        Bet[] bets;
    }

    // Variables de estado
    LinkTokenInterface private s_linkToken;
    address private s_oracle;
    bytes32 private s_jobId;
    uint256 private s_fee;

    mapping(bytes32 => Match) public s_matches;
    mapping(bytes32 => bytes32) private s_pendingRequests;

    // Eventos
    event BetPlaced(bytes32 indexed matchId, address indexed better, Outcome prediction, uint256 amount);
    event MatchCreated(bytes32 indexed matchId, string description);
    event MatchResultRequested(bytes32 indexed matchId, bytes32 indexed requestId);
    event MatchResultFulfilled(bytes32 indexed matchId, Outcome result);
    event Payout(address indexed better, uint256 amount);

    /**
     * @notice El constructor inicializa el contrato con las direcciones necesarias de Chainlink.
     * @param _link La dirección del token LINK en la red correspondiente (ej. Chiliz Spicy Testnet).
     * @param _oracle La dirección del contrato del oráculo de Chainlink.
     * @param _jobId El ID del trabajo de Chainlink para obtener los datos.
     * @param _fee La tarifa en LINK para la solicitud al oráculo.
     */
    constructor(address _link, address _oracle, bytes32 _jobId, uint256 _fee) ConfirmedOwner(msg.sender) {
        s_linkToken = LinkTokenInterface(_link);
        s_oracle = _oracle;
        s_jobId = _jobId;
        s_fee = _fee;
    }

    /**
     * @notice Crea un nuevo partido en el que se pueden realizar apuestas.
     * @dev Solo el propietario del contrato puede llamar a esta función.
     * @param _matchId Un ID único para el partido (ej. keccak256("TEAM_A_VS_TEAM_B_2024-09-21")).
     * @param _description Una breve descripción del partido.
     */
    function createMatch(bytes32 _matchId, string calldata _description) external onlyOwner {
        require(s_matches[_matchId].totalPool == 0, "Match already exists");
        s_matches[_matchId] = Match({
            description: _description,
            status: MatchStatus.Open,
            result: Outcome.Draw, // Valor por defecto
            totalPool: 0,
            bets: new Bet[](0)
        });
        emit MatchCreated(_matchId, _description);
    }

    /**
     * @notice Permite a un usuario realizar una apuesta en un partido abierto.
     * @param _matchId El ID del partido.
     * @param _prediction El resultado pronosticado (0 para Equipo A, 1 para Equipo B, 2 para Empate).
     */
    function placeBet(bytes32 _matchId, Outcome _prediction) external payable {
        Match storage currentMatch = s_matches[_matchId];
        require(currentMatch.status == MatchStatus.Open, "Betting is closed for this match");
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(_prediction <= Outcome.Draw, "Invalid prediction");

        currentMatch.bets.push(Bet({
            better: payable(msg.sender),
            prediction: _prediction,
            amount: msg.value
        }));

        currentMatch.totalAmount[_prediction] += msg.value;
        currentMatch.totalPool += msg.value;

        emit BetPlaced(_matchId, msg.sender, _prediction, msg.value);
    }

    /**
     * @notice Solicita el resultado de un partido al oráculo de Chainlink.
     * @dev Solo el propietario del contrato puede llamar a esta función.
     * @param _matchId El ID del partido.
     * @param _apiUrl La URL de la API de la que se obtendrá el resultado.
     * @param _path La ruta dentro de la respuesta JSON para encontrar el resultado (ej. "result.winner").
     */
    function requestResult(bytes32 _matchId, string memory _apiUrl, string memory _path) public onlyOwner {
        Match storage currentMatch = s_matches[_matchId];
        require(currentMatch.status == MatchStatus.Open, "Match not open or already resolved");
        
        currentMatch.status = MatchStatus.AwaitingResult;

        Chainlink.Request memory req = buildChainlinkRequest(s_jobId, address(this), this.fulfillResult.selector);
        req.add("get", _apiUrl);
        req.add("path", _path); // La API debe devolver 0, 1 o 2

        bytes32 requestId = sendChainlinkRequestTo(s_oracle, req, s_fee);
        s_pendingRequests[requestId] = _matchId;

        emit MatchResultRequested(_matchId, requestId);
    }

    /**
     * @notice La función de callback que el oráculo de Chainlink llama con el resultado.
     * @param _requestId El ID de la solicitud de Chainlink.
     * @param _result El resultado devuelto por el oráculo (0, 1 o 2).
     */
    function fulfillResult(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        bytes32 matchId = s_pendingRequests[_requestId];
        Match storage currentMatch = s_matches[matchId];
        
        require(currentMatch.status == MatchStatus.AwaitingResult, "Match not awaiting result");
        require(_result <= uint256(Outcome.Draw), "Invalid result from oracle");
        
        Outcome finalResult = Outcome(_result);
        currentMatch.result = finalResult;
        currentMatch.status = MatchStatus.Closed;
        
        delete s_pendingRequests[_requestId];

        emit MatchResultFulfilled(matchId, finalResult);

        _payoutWinners(matchId);
    }

    /**
     * @notice Paga a los ganadores de un partido resuelto.
     * @dev Se llama internamente después de que se recibe un resultado.
     * @param _matchId El ID del partido.
     */
    function _payoutWinners(bytes32 _matchId) private {
        Match storage currentMatch = s_matches[_matchId];
        Outcome winner = currentMatch.result;
        uint256 winningPool = currentMatch.totalAmount[winner];
        uint256 totalPool = currentMatch.totalPool;

        if (winningPool == 0) {
            // Nadie acertó, se devuelve el dinero a todos los apostadores.
            for (uint i = 0; i < currentMatch.bets.length; i++) {
                currentMatch.bets[i].better.transfer(currentMatch.bets[i].amount);
                emit Payout(currentMatch.bets[i].better, currentMatch.bets[i].amount);
            }
            return;
        }

        // Paga a los ganadores de forma proporcional a su apuesta.
        for (uint i = 0; i < currentMatch.bets.length; i++) {
            if (currentMatch.bets[i].prediction == winner) {
                uint256 payoutAmount = (currentMatch.bets[i].amount * totalPool) / winningPool;
                currentMatch.bets[i].better.transfer(payoutAmount);
                emit Payout(currentMatch.bets[i].better, payoutAmount);
            }
        }
    }

    /**
     * @notice Permite al propietario retirar los tokens LINK del contrato.
     * @dev Útil si el contrato se financia en exceso o se deja de usar.
     */
    function withdrawLink() public onlyOwner {
        require(
            s_linkToken.transfer(msg.sender, s_linkToken.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
