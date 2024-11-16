import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // const deployed = await deploy("ConfidentialERC20", {
  //   from: deployer,
  //   log: true,
  // });

  // console.log(`ConfidentialToken contract deployed at: ${deployed.address}`);

  const deployed = await deploy("ZoroCore", {
    from: deployer,
    log: true,
    args: [
      "0x09F1aF4e16728fcF340051055159F0f9D5e00b54",
      "0x0429A2Da7884CA14E53142988D5845952fE4DF6a",
      [
        [1, 85, 88, 82, 78, "0x87dd08be032a03d937f2a8003dfa9c52821cbab9", "Rafael Leão"],
        [2, 78, 82, 80, 75, "0x87dd08be032a03d937f2a8003dfa9c52821cbab9", "Theo Hernández"],
        [3, 75, 80, 85, 82, "0x87dd08be032a03d937f2a8003dfa9c52821cbab9", "Sandro Tonali"],
        [4, 82, 84, 77, 76, "0x87dd08be032a03d937f2a8003dfa9c52821cbab9", "Olivier Giroud"],
        [5, 84, 76, 74, 79, "0x87dd08be032a03d937f2a8003dfa9c52821cbab9", "Fikayo Tomori"],
        [6, 90, 92, 85, 80, "0x45e50677f8deca7cc582ad573b525409d1233592", "Robert Lewandowski"],
        [7, 76, 78, 83, 72, "0x45e50677f8deca7cc582ad573b525409d1233592", "Pedri"],
        [8, 85, 80, 84, 74, "0x45e50677f8deca7cc582ad573b525409d1233592", "Gavi"],
        [9, 88, 89, 81, 77, "0x45e50677f8deca7cc582ad573b525409d1233592", "Ousmane Dembélé"],
        [10, 70, 60, 90, 75, "0x45e50677f8deca7cc582ad573b525409d1233592", "Sergio Busquets"],
        [11, 80, 85, 78, 82, "0x34c00007cf1ca7a3d9dcce8cf1d3f75b4db4d37e", "Lautaro Martínez"],
        [12, 74, 65, 75, 88, "0x34c00007cf1ca7a3d9dcce8cf1d3f75b4db4d37e", "Milan Škriniar"],
        [13, 81, 70, 80, 84, "0x34c00007cf1ca7a3d9dcce8cf1d3f75b4db4d37e", "Marcelo Brozović"],
        [14, 88, 90, 79, 76, "0x34c00007cf1ca7a3d9dcce8cf1d3f75b4db4d37e", "Romelu Lukaku"],
        [15, 77, 78, 83, 82, "0x34c00007cf1ca7a3d9dcce8cf1d3f75b4db4d37e", "Nicolò Barella"],
        [16, 86, 85, 77, 79, "0x634c9b919a484913c46362e2e0e700576920c994", "Federico Chiesa"],
        [17, 75, 70, 85, 88, "0x634c9b919a484913c46362e2e0e700576920c994", "Leonardo Bonucci"],
        [18, 78, 82, 80, 80, "0x634c9b919a484913c46362e2e0e700576920c994", "Dusan Vlahovic"],
        [19, 74, 66, 78, 82, "0x634c9b919a484913c46362e2e0e700576920c994", "Manuel Locatelli"],
        [20, 81, 79, 84, 75, "0x634c9b919a484913c46362e2e0e700576920c994", "Adrien Rabiot"],
        [21, 87, 93, 91, 65, "0x660e2d9f26542957c7e819f91944d72cfca32058", "Erling Haaland"],
        [22, 88, 77, 91, 75, "0x660e2d9f26542957c7e819f91944d72cfca32058", "Kevin De Bruyne"],
        [23, 86, 70, 90, 82, "0x660e2d9f26542957c7e819f91944d72cfca32058", "Rodri"],
        [24, 78, 80, 75, 80, "0x660e2d9f26542957c7e819f91944d72cfca32058", "Bernardo Silva"],
        [25, 82, 85, 82, 77, "0x660e2d9f26542957c7e819f91944d72cfca32058", "Phil Foden"],
        [26, 84, 86, 79, 76, "0x2452a4eec9359ff93c084ed5ed3e21eac197586d", "Victor Osimhen"],
        [27, 78, 74, 85, 80, "0x2452a4eec9359ff93c084ed5ed3e21eac197586d", "Piotr Zielinski"],
        [28, 79, 83, 78, 77, "0x2452a4eec9359ff93c084ed5ed3e21eac197586d", "Giovanni Di Lorenzo"],
        [29, 83, 76, 84, 75, "0x2452a4eec9359ff93c084ed5ed3e21eac197586d", "Khvicha Kvaratskhelia"],
        [30, 74, 72, 80, 83, "0x2452a4eec9359ff93c084ed5ed3e21eac197586d", "Amir Rrahmani"],
        [31, 92, 95, 87, 72, "0xd82ee61aa30d018239350f9843cb8a4967b8b3da", "Kylian Mbappé"],
        [32, 68, 63, 92, 82, "0xd82ee61aa30d018239350f9843cb8a4967b8b3da", "Marco Verratti"],
        [33, 89, 90, 85, 70, "0xd82ee61aa30d018239350f9843cb8a4967b8b3da", "Neymar Jr"],
        [34, 85, 79, 88, 75, "0xd82ee61aa30d018239350f9843cb8a4967b8b3da", "Lionel Messi"],
        [35, 77, 72, 80, 85, "0xd82ee61aa30d018239350f9843cb8a4967b8b3da", "Sergio Ramos"],
        [36, 83, 87, 80, 76, "0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5", "Harry Kane"],
        [37, 88, 82, 76, 72, "0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5", "Heung-Min Son"],
        [38, 80, 76, 78, 80, "0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5", "Rodrigo Bentancur"],
        [39, 74, 72, 81, 85, "0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5", "Eric Dier"],
        [40, 86, 79, 82, 73, "0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5", "Richarlison"],
      ],
      [
        ["0x87dd08be032a03d937f2a8003dfa9c52821cbab9", "AC Milan"],
        ["0x45e50677f8deca7cc582ad573b525409d1233592", "FC Barcelona"],
        ["0x34c00007cf1ca7a3d9dcce8cf1d3f75b4db4d37e", "Inter Milan"],
        ["0x634c9b919a484913c46362e2e0e700576920c994", "Juventus"],
        ["0x660e2d9f26542957c7e819f91944d72cfca32058", "Manchester City"],
        ["0x2452a4eec9359ff93c084ed5ed3e21eac197586d", "Napoli"],
        ["0xd82ee61aa30d018239350f9843cb8a4967b8b3da", "Paris Saint-Germain"],
        ["0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5", "Tottenham Hotspur"],
      ],
    ],
  });

  console.log(`ZoroCore contract deployed at: ${deployed.address}`);
};

export default func;
func.id = "deploy_confidentialERC20";
func.tags = ["ConfidentialToken"];
