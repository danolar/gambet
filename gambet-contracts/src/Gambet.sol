// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {PredictionNFT} from "./PredictionNFT.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Gambet is Ownable {
    // NFT Contract
    PredictionNFT public predictionNFT;

    // Enum for Bet Status
    enum BetStatus {
        Open,
        Closed,
        Resolved
    }

    // Struct for Bet
    struct Bet {
        uint256 id;
        string description;
        string[] outcomes;
        uint256 endTime;
        uint256 resolutionTime;
        address creator;
        BetStatus status;
        uint256 totalPool;
        uint256 winningOutcomeIndex;
        mapping(uint256 => uint256) outcomePools;
        uint256 totalWinners;
    }

    // Struct for Prediction
    struct Prediction {
        address predictor;
        uint256 betId;
        uint256 outcomeIndex;
        uint256 amount;
        bool claimed;
    }

    // State variables
    mapping(uint256 => Bet) public bets;
    mapping(uint256 => mapping(address => Prediction)) public predictions;
    uint256 public nextBetId;

    // Events
    event BetCreated(
        uint256 indexed betId,
        string description,
        address indexed creator
    );

    event BetPlaced(
        uint256 indexed betId,
        address indexed predictor,
        uint256 outcomeIndex,
        uint256 amount
    );

    event BetResolved(uint256 indexed betId, uint256 winningOutcomeIndex);
    event WinningsClaimed(
        uint256 indexed betId,
        address indexed predictor,
        uint256 amount
    );

    constructor(address _predictionNFTAddress) Ownable(msg.sender) {
        predictionNFT = PredictionNFT(_predictionNFTAddress);
    }

    function createBet(
        string memory _description,
        string[] memory _outcomes,
        uint256 _endTime,
        uint256 _resolutionTime
    ) public {
        require(_endTime > block.timestamp, "End time must be in the future");
        require(
            _resolutionTime > _endTime,
            "Resolution time must be after end time"
        );
        require(_outcomes.length >= 2, "Must have at least two outcomes");

        uint256 betId = nextBetId;
        bets[betId].id = betId;
        bets[betId].description = _description;
        bets[betId].outcomes = _outcomes;
        bets[betId].endTime = _endTime;
        bets[betId].resolutionTime = _resolutionTime;
        bets[betId].creator = msg.sender;
        bets[betId].status = BetStatus.Open;

        nextBetId++;
        emit BetCreated(betId, _description, msg.sender);
    }

    function placeBet(uint256 _betId, uint256 _outcomeIndex) public payable {
        Bet storage bet = bets[_betId];
        require(bet.id == _betId, "Bet does not exist");
        require(bet.status == BetStatus.Open, "Bet is not open");
        require(block.timestamp < bet.endTime, "Bet has ended");
        require(
            _outcomeIndex < bet.outcomes.length,
            "Invalid outcome index"
        );
        require(msg.value > 0, "Must bet a positive amount");
        require(
            predictions[_betId][msg.sender].predictor == address(0),
            "Already placed a bet"
        );

        predictions[_betId][msg.sender] = Prediction({
            predictor: msg.sender,
            betId: _betId,
            outcomeIndex: _outcomeIndex,
            amount: msg.value,
            claimed: false
        });

        bet.totalPool += msg.value;
        bet.outcomePools[_outcomeIndex] += msg.value;

        predictionNFT.safeMint(msg.sender, _betId, _outcomeIndex, msg.value);

        emit BetPlaced(_betId, msg.sender, _outcomeIndex, msg.value);
    }

    function resolveBet(
        uint256 _betId,
        uint256 _winningOutcomeIndex
    ) public onlyOwner {
        Bet storage bet = bets[_betId];
        require(bet.id == _betId, "Bet does not exist");
        require(bet.status == BetStatus.Open, "Bet is not open");
        require(
            block.timestamp > bet.resolutionTime,
            "Resolution time not yet passed"
        );
        require(
            _winningOutcomeIndex < bet.outcomes.length,
            "Invalid winning outcome"
        );

        bet.status = BetStatus.Resolved;
        bet.winningOutcomeIndex = _winningOutcomeIndex;

        emit BetResolved(_betId, _winningOutcomeIndex);
    }

    function claimWinnings(uint256 _betId) public {
        Prediction storage prediction = predictions[_betId][msg.sender];
        Bet storage bet = bets[_betId];

        require(bet.status == BetStatus.Resolved, "Bet is not resolved");
        require(prediction.predictor != address(0), "You have not placed a bet");
        require(!prediction.claimed, "Winnings already claimed");
        require(
            prediction.outcomeIndex == bet.winningOutcomeIndex,
            "Prediction was not correct"
        );

        uint256 winnings = (prediction.amount * bet.totalPool) /
            bet.outcomePools[bet.winningOutcomeIndex];
        prediction.claimed = true;

        (bool sent, ) = msg.sender.call{value: winnings}("");
        require(sent, "Failed to send winnings");

        emit WinningsClaimed(_betId, msg.sender, winnings);
    }
}