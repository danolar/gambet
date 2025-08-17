// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SportsBetting
 * @dev Contrato inteligente para apuestas deportivas simplificado.
 * Los usuarios pueden apostar por el Equipo A, el Equipo B o un Empate.
 */
contract SportsBetting is Ownable {

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
        uint256 totalAmountTeamA;
        uint256 totalAmountTeamB;
        uint256 totalAmountDraw;
        uint256 totalPool;
        uint256 betCount;
    }

    // Variables de estado
    mapping(bytes32 => Match) public s_matches;
    mapping(bytes32 => mapping(uint256 => Bet)) public s_bets;

    // Eventos
    event BetPlaced(bytes32 indexed matchId, address indexed better, Outcome prediction, uint256 amount);
    event MatchCreated(bytes32 indexed matchId, string description);
    event MatchResultRequested(bytes32 indexed matchId, bytes32 indexed requestId);
    event MatchResultFulfilled(bytes32 indexed matchId, Outcome result);
    event Payout(address indexed better, uint256 amount);

    /**
     * @notice El constructor inicializa el contrato.
     */
    constructor() Ownable(msg.sender) {}

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
            totalAmountTeamA: 0,
            totalAmountTeamB: 0,
            totalAmountDraw: 0,
            totalPool: 0,
            betCount: 0
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

        uint256 betIndex = currentMatch.betCount;
        s_bets[_matchId][betIndex] = Bet({
            better: payable(msg.sender),
            prediction: _prediction,
            amount: msg.value
        });
        currentMatch.betCount++;

        if (_prediction == Outcome.TeamA) {
            currentMatch.totalAmountTeamA += msg.value;
        } else if (_prediction == Outcome.TeamB) {
            currentMatch.totalAmountTeamB += msg.value;
        } else {
            currentMatch.totalAmountDraw += msg.value;
        }
        currentMatch.totalPool += msg.value;

        emit BetPlaced(_matchId, msg.sender, _prediction, msg.value);
    }

    /**
     * @notice Permite al propietario establecer el resultado de un partido manualmente.
     * @dev Solo el propietario del contrato puede llamar a esta función.
     * @param _matchId El ID del partido.
     * @param _result El resultado del partido (0 para Equipo A, 1 para Equipo B, 2 para Empate).
     */
    function setResult(bytes32 _matchId, Outcome _result) public onlyOwner {
        Match storage currentMatch = s_matches[_matchId];
        require(currentMatch.status == MatchStatus.Open, "Match not open or already resolved");
        require(_result <= Outcome.Draw, "Invalid result");
        
        currentMatch.result = _result;
        currentMatch.status = MatchStatus.Closed;

        emit MatchResultFulfilled(_matchId, _result);

        _payoutWinners(_matchId);
    }

    /**
     * @notice Paga a los ganadores de un partido resuelto.
     * @dev Se llama internamente después de que se recibe un resultado.
     * @param _matchId El ID del partido.
     */
    function _payoutWinners(bytes32 _matchId) private {
        Match storage currentMatch = s_matches[_matchId];
        Outcome winner = currentMatch.result;
        uint256 winningPool;
        
        if (winner == Outcome.TeamA) {
            winningPool = currentMatch.totalAmountTeamA;
        } else if (winner == Outcome.TeamB) {
            winningPool = currentMatch.totalAmountTeamB;
        } else {
            winningPool = currentMatch.totalAmountDraw;
        }
        
        uint256 totalPool = currentMatch.totalPool;

        if (winningPool == 0) {
            // Nadie acertó, se devuelve el dinero a todos los apostadores.
            for (uint i = 0; i < currentMatch.betCount; i++) {
                Bet storage bet = s_bets[_matchId][i];
                bet.better.transfer(bet.amount);
                emit Payout(bet.better, bet.amount);
            }
            return;
        }

        // Paga a los ganadores de forma proporcional a su apuesta.
        for (uint i = 0; i < currentMatch.betCount; i++) {
            Bet storage bet = s_bets[_matchId][i];
            if (bet.prediction == winner) {
                uint256 payoutAmount = (bet.amount * totalPool) / winningPool;
                bet.better.transfer(payoutAmount);
                emit Payout(bet.better, payoutAmount);
            }
        }
    }


}
