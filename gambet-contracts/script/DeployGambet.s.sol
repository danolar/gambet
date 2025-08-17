// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Gambet} from "../src/Gambet.sol";
import {PredictionNFT} from "../src/PredictionNFT.sol";
import {SportsBetting} from "../src/SportsBetting.sol";

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

        // Asignar el rol de propietario al contrato de Gambet para que pueda acuñar NFTs
        predictionNFT.transferOwnership(address(gambet));
        console.log("Propiedad de PredictionNFT transferida a Gambet.");

        // 3. Desplegar SportsBetting simplificado
        console.log("Desplegando SportsBetting...");
        SportsBetting sportsBetting = new SportsBetting();
        console.log("SportsBetting desplegado en:", address(sportsBetting));

        vm.stopBroadcast();
        
        return (gambet, predictionNFT, sportsBetting);
    }
}
