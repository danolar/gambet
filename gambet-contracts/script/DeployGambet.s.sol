// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Gambet} from "../src/core/Gambet.sol";
import {PredictionNFT} from "../src/core/PredictionNFT.sol";
import {SportsBetting} from "../src/core/SportsBetting.sol";

/**
 * @title DeployGambet
 * @dev Un script de Foundry para desplegar los contratos Gambet, PredictionNFT y SportsBetting
 * en la red Chiliz Spicy Testnet.
 */
contract DeployGambet is Script {
    function run()
        external
        returns (Gambet, PredictionNFT, SportsBetting)
    {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // 1. Desplegar PredictionNFT
        console.log("Desplegando PredictionNFT...");
        PredictionNFT predictionNFT = new PredictionNFT();
        console.log("PredictionNFT desplegado en:", address(predictionNFT));

        // 2. Desplegar Gambet, pasando la dirección de PredictionNFT
        console.log("Desplegando Gambet...");
        Gambet gambet = new Gambet(address(predictionNFT));
        console.log("Gambet desplegado en:", address(gambet));

        // Asignar el rol de MINTER al contrato de Gambet para que pueda acuñar NFTs
        predictionNFT.grantRole(predictionNFT.MINTER_ROLE(), address(gambet));
        console.log("Rol de MINTER asignado a Gambet.");

        // 3. Desplegar SportsBetting con los parámetros de Chainlink para Chiliz Spicy Testnet
        console.log("Desplegando SportsBetting...");
        address linkToken = 0x7322D1a4430F557571343354452077436B15A361;
        address oracle = 0xB521639fD392f25091a131b0452652A180e0523A;
        bytes32 jobId = "ca98366177714d44b80b343b1350073e"; // Job ID para uint256
        uint256 fee = 0.1 * 1e18; // 0.1 LINK

        SportsBetting sportsBetting = new SportsBetting(
            linkToken,
            oracle,
            jobId,
            fee
        );
        console.log("SportsBetting desplegado en:", address(sportsBetting));

        vm.stopBroadcast();
        
        return (gambet, predictionNFT, sportsBetting);
    }
}
