export const player1 = {
  name: "Kevin De Bruyne",
  position: "CM",
  rating: 91,
  id: 1,
  club: "Manchester City",
  nationality: "Belgium",
  stats: {
    pace: 74,
    attack: 86,
    passing: 93,
    dribbling: 87,
    defence: 64,
    physical: 77,
  },
};

export const player2 = {
  name: "Lionel Messi",
  position: "RW",
  rating: 93,
  id: 2,

  club: "Paris Saint-Germain",
  nationality: "Argentina",
  stats: {
    pace: 80,
    attack: 92,
    passing: 91,
    dribbling: 95,
    defence: 34,
    physical: 65,
  },
};

export const player3 = {
  name: "Virgil van Dijk",
  position: "CB",
  rating: 89,
  club: "Liverpool",
  id: 3,

  nationality: "Netherlands",
  stats: {
    pace: 71,
    attack: 60,
    passing: 71,
    dribbling: 72,
    defence: 91,
    physical: 86,
  },
};

export const player4 = {
  name: "Kylian Mbappé",
  position: "ST",
  rating: 91,
  id: 4,
  club: "Paris Saint-Germain",
  nationality: "France",
  stats: {
    pace: 97,
    attack: 88,
    passing: 80,
    dribbling: 92,
    defence: 36,
    physical: 76,
  },
};

export const player5 = {
  name: "Neymar Jr",
  position: "LW",
  rating: 89,
  id: 5,

  club: "Paris Saint-Germain",
  nationality: "Brazil",
  stats: {
    pace: 87,
    attack: 83,
    passing: 86,
    dribbling: 93,
    defence: 37,
    physical: 61,
  },
};

export const player6 = {
  name: "Robert Lewandowski",
  position: "ST",
  rating: 91,
  id: 6,

  club: "FC Barcelona",
  nationality: "poland",
  stats: {
    pace: 75,
    attack: 92,
    passing: 79,
    dribbling: 86,
    defence: 44,
    physical: 82,
  },
};

export const countryToCode: { [key: string]: string } = {
  england: "gb-eng",
  france: "fr",
  spain: "es",
  germany: "de",
  italy: "it",
  portugal: "pt",
  netherlands: "nl",
  belgium: "be",
  brazil: "br",
  argentina: "ar",
  "united states": "us",
  mexico: "mx",
  canada: "ca",
  japan: "jp",
  "south korea": "kr",
  australia: "au",
  nigeria: "ng",
  senegal: "sn",
  egypt: "eg",
  morocco: "ma",
  croatia: "hr",
  serbia: "rs",
  switzerland: "ch",
  poland: "pl",
  wales: "gb-wls",
  scotland: "gb-sct",
  ireland: "ie",
  sweden: "se",
  denmark: "dk",
  norway: "no",
  finland: "fi",
  iceland: "is",
  greece: "gr",
  turkey: "tr",
  russia: "ru",
  ukraine: "ua",
  cameroon: "cm",
  ghana: "gh",
  "ivory coast": "ci",
  algeria: "dz",
  tunisia: "tn",
  "saudi arabia": "sa",
  iran: "ir",
  iraq: "iq",
  qatar: "qa",
  "united arab emirates": "ae",
  china: "cn",
  austria: "at",
  romania: "ro",
  hungary: "hu",
  "czech republic": "cz",
  slovakia: "sk",
  slovenia: "si",
  bulgaria: "bg",
};
export const playersData = [
  {
    name: "Rafael Leão",
    position: "LW",
    rating: 86,
    id: 1,
    club: "AC Milan",
    nationality: "Portugal",
    clubToken: "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9",
    stats: {
      pace: 85,
      attack: 88,
      passing: 82,
      dribbling: 86,
      defence: 78,
      physical: 82,
    },
  },
  {
    name: "Theo Hernández",
    position: "LB",
    rating: 85,
    id: 2,
    club: "AC Milan",
    nationality: "France",
    clubToken: "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9",
    stats: {
      pace: 78,
      attack: 82,
      passing: 80,
      dribbling: 82,
      defence: 75,
      physical: 84,
    },
  },
  {
    name: "Sandro Tonali",
    position: "CDM",
    rating: 84,
    id: 3,
    club: "AC Milan",
    nationality: "Italy",
    clubToken: "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9",
    stats: {
      pace: 75,
      attack: 80,
      passing: 85,
      dribbling: 83,
      defence: 82,
      physical: 84,
    },
  },
  {
    name: "Olivier Giroud",
    position: "ST",
    rating: 84,
    id: 4,
    club: "AC Milan",
    nationality: "France",
    clubToken: "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9",
    stats: {
      pace: 82,
      attack: 84,
      passing: 77,
      dribbling: 80,
      defence: 76,
      physical: 85,
    },
  },
  {
    name: "Fikayo Tomori",
    position: "CB",
    rating: 84,
    id: 5,
    club: "AC Milan",
    nationality: "England",
    clubToken: "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9",
    stats: {
      pace: 84,
      attack: 76,
      passing: 74,
      dribbling: 75,
      defence: 79,
      physical: 83,
    },
  },
  {
    name: "Robert Lewandowski",
    position: "ST",
    rating: 91,
    id: 6,
    club: "FC Barcelona",
    nationality: "Poland",
    clubToken: "0x45E50677f8DECa7CC582Ad573b525409d1233592",
    stats: {
      pace: 90,
      attack: 92,
      passing: 85,
      dribbling: 88,
      defence: 80,
      physical: 86,
    },
  },
  {
    name: "Pedri",
    position: "CAM",
    rating: 85,
    id: 7,
    club: "FC Barcelona",
    nationality: "Spain",
    clubToken: "0x45E50677f8DECa7CC582Ad573b525409d1233592",
    stats: {
      pace: 76,
      attack: 78,
      passing: 83,
      dribbling: 86,
      defence: 72,
      physical: 75,
    },
  },
  {
    name: "Gavi",
    position: "CM",
    rating: 83,
    id: 8,
    club: "FC Barcelona",
    nationality: "Spain",
    clubToken: "0x45E50677f8DECa7CC582Ad573b525409d1233592",
    stats: {
      pace: 85,
      attack: 80,
      passing: 84,
      dribbling: 85,
      defence: 74,
      physical: 78,
    },
  },
  {
    name: "Ousmane Dembélé",
    position: "RW",
    rating: 85,
    id: 9,
    club: "FC Barcelona",
    nationality: "France",
    clubToken: "0x45E50677f8DECa7CC582Ad573b525409d1233592",
    stats: {
      pace: 88,
      attack: 89,
      passing: 81,
      dribbling: 87,
      defence: 77,
      physical: 76,
    },
  },
  {
    name: "Sergio Busquets",
    position: "CDM",
    rating: 85,
    id: 10,
    club: "FC Barcelona",
    nationality: "Spain",
    clubToken: "0x45E50677f8DECa7CC582Ad573b525409d1233592",
    stats: {
      pace: 70,
      attack: 60,
      passing: 90,
      dribbling: 82,
      defence: 75,
      physical: 77,
    },
  },
  {
    name: "Lautaro Martínez",
    position: "ST",
    rating: 86,
    id: 11,
    club: "Inter Milan",
    nationality: "Argentina",
    clubToken: "0x34c00007cf1Ca7a3D9DccE8cF1D3f75B4db4d37e",
    stats: {
      pace: 80,
      attack: 85,
      passing: 78,
      dribbling: 84,
      defence: 82,
      physical: 85,
    },
  },
  {
    name: "Milan Škriniar",
    position: "CB",
    rating: 86,
    id: 12,
    club: "Inter Milan",
    nationality: "Slovakia",
    clubToken: "0x34c00007cf1Ca7a3D9DccE8cF1D3f75B4db4d37e",
    stats: {
      pace: 74,
      attack: 65,
      passing: 75,
      dribbling: 72,
      defence: 88,
      physical: 86,
    },
  },
  {
    name: "Marcelo Brozović",
    position: "CDM",
    rating: 86,
    id: 13,
    club: "Inter Milan",
    nationality: "Croatia",
    clubToken: "0x34c00007cf1Ca7a3D9DccE8cF1D3f75B4db4d37e",
    stats: {
      pace: 81,
      attack: 70,
      passing: 80,
      dribbling: 83,
      defence: 84,
      physical: 82,
    },
  },
  {
    name: "Romelu Lukaku",
    position: "ST",
    rating: 86,
    id: 14,
    club: "Inter Milan",
    nationality: "Belgium",
    clubToken: "0x34c00007cf1Ca7a3D9DccE8cF1D3f75B4db4d37e",
    stats: {
      pace: 88,
      attack: 90,
      passing: 79,
      dribbling: 81,
      defence: 76,
      physical: 88,
    },
  },
  {
    name: "Nicolò Barella",
    position: "CM",
    rating: 86,
    id: 15,
    club: "Inter Milan",
    nationality: "Italy",
    clubToken: "0x34c00007cf1Ca7a3D9DccE8cF1D3f75B4db4d37e",
    stats: {
      pace: 77,
      attack: 78,
      passing: 83,
      dribbling: 85,
      defence: 82,
      physical: 80,
    },
  },
  {
    name: "Federico Chiesa",
    position: "RW",
    rating: 84,
    id: 16,
    club: "Juventus",
    nationality: "Italy",
    clubToken: "0x634c9b919A484913C46362e2E0E700576920c994",
    stats: {
      pace: 86,
      attack: 85,
      passing: 77,
      dribbling: 86,
      defence: 79,
      physical: 78,
    },
  },
  {
    name: "Leonardo Bonucci",
    position: "CB",
    rating: 85,
    id: 17,
    club: "Juventus",
    nationality: "Italy",
    clubToken: "0x634c9b919A484913C46362e2E0E700576920c994",
    stats: {
      pace: 75,
      attack: 70,
      passing: 85,
      dribbling: 74,
      defence: 88,
      physical: 85,
    },
  },
  {
    name: "Dusan Vlahovic",
    position: "ST",
    rating: 84,
    id: 18,
    club: "Juventus",
    nationality: "Serbia",
    clubToken: "0x634c9b919A484913C46362e2E0E700576920c994",
    stats: {
      pace: 78,
      attack: 82,
      passing: 80,
      dribbling: 82,
      defence: 80,
      physical: 84,
    },
  },
  {
    name: "Manuel Locatelli",
    position: "CDM",
    rating: 83,
    id: 19,
    club: "Juventus",
    nationality: "Italy",
    clubToken: "0x634c9b919A484913C46362e2E0E700576920c994",
    stats: {
      pace: 74,
      attack: 66,
      passing: 78,
      dribbling: 77,
      defence: 82,
      physical: 80,
    },
  },
  {
    name: "Adrien Rabiot",
    position: "CM",
    rating: 83,
    id: 20,
    club: "Juventus",
    nationality: "France",
    clubToken: "0x634c9b919A484913C46362e2E0E700576920c994",
    stats: {
      pace: 81,
      attack: 79,
      passing: 84,
      dribbling: 82,
      defence: 75,
      physical: 83,
    },
  },
  {
    name: "Erling Haaland",
    position: "ST",
    rating: 91,
    id: 21,
    club: "Manchester City",
    nationality: "Norway",
    clubToken: "0x660e2D9f26542957C7E819f91944d72Cfca32058",
    stats: {
      pace: 87,
      attack: 93,
      passing: 91,
      dribbling: 85,
      defence: 65,
      physical: 88,
    },
  },
  {
    name: "Kevin De Bruyne",
    position: "CAM",
    rating: 91,
    id: 22,
    club: "Manchester City",
    nationality: "Belgium",
    clubToken: "0x660e2D9f26542957C7E819f91944d72Cfca32058",
    stats: {
      pace: 88,
      attack: 77,
      passing: 91,
      dribbling: 88,
      defence: 75,
      physical: 77,
    },
  },
  {
    name: "Rodri",
    position: "CDM",
    rating: 89,
    id: 23,
    club: "Manchester City",
    nationality: "Spain",
    clubToken: "0x660e2D9f26542957C7E819f91944d72Cfca32058",
    stats: {
      pace: 86,
      attack: 70,
      passing: 90,
      dribbling: 85,
      defence: 82,
      physical: 84,
    },
  },
  {
    name: "Bernardo Silva",
    position: "CAM",
    rating: 88,
    id: 24,
    club: "Manchester City",
    nationality: "Portugal",
    clubToken: "0x660e2D9f26542957C7E819f91944d72Cfca32058",
    stats: {
      pace: 78,
      attack: 80,
      passing: 75,
      dribbling: 89,
      defence: 80,
      physical: 75,
    },
  },
  {
    name: "Phil Foden",
    position: "LW",
    rating: 85,
    id: 25,
    club: "Manchester City",
    nationality: "England",
    clubToken: "0x660e2D9f26542957C7E819f91944d72Cfca32058",
    stats: {
      pace: 82,
      attack: 85,
      passing: 82,
      dribbling: 87,
      defence: 77,
      physical: 75,
    },
  },
  {
    name: "Victor Osimhen",
    position: "ST",
    rating: 87,
    id: 26,
    club: "Napoli",
    nationality: "Nigeria",
    clubToken: "0x2452a4eEC9359Ff93C084ed5eD3E21eaC197586D",
    stats: {
      pace: 84,
      attack: 86,
      passing: 79,
      dribbling: 83,
      defence: 76,
      physical: 85,
    },
  },
  {
    name: "Piotr Zielinski",
    position: "CAM",
    rating: 84,
    id: 27,
    club: "Napoli",
    nationality: "Poland",
    clubToken: "0x2452a4eEC9359Ff93C084ed5eD3E21eaC197586D",
    stats: {
      pace: 78,
      attack: 74,
      passing: 85,
      dribbling: 86,
      defence: 80,
      physical: 77,
    },
  },
  {
    name: "Giovanni Di Lorenzo",
    position: "RB",
    rating: 84,
    id: 28,
    club: "Napoli",
    nationality: "Italy",
    clubToken: "0x2452a4eEC9359Ff93C084ed5eD3E21eaC197586D",
    stats: {
      pace: 79,
      attack: 83,
      passing: 78,
      dribbling: 80,
      defence: 77,
      physical: 82,
    },
  },
  {
    name: "Khvicha Kvaratskhelia",
    position: "LW",
    rating: 86,
    id: 29,
    club: "Napoli",
    nationality: "Georgia",
    clubToken: "0x2452a4eEC9359Ff93C084ed5eD3E21eaC197586D",
    stats: {
      pace: 83,
      attack: 76,
      passing: 84,
      dribbling: 88,
      defence: 75,
      physical: 77,
    },
  },
  {
    name: "Amir Rrahmani",
    position: "CB",
    rating: 83,
    id: 30,
    club: "Napoli",
    nationality: "Kosovo",
    clubToken: "0x2452a4eec9359ff93c084ed5ed3e21eac197586d",
    stats: {
      pace: 74,
      attack: 72,
      passing: 80,
      dribbling: 75,
      defence: 83,
      physical: 82,
    },
  },
  {
    name: "Kylian Mbappé",
    position: "ST",
    rating: 91,
    id: 31,
    club: "Paris Saint-Germain",
    nationality: "France",
    clubToken: "0xd82ee61aa30d018239350f9843cb8a4967b8b3da",
    stats: {
      pace: 92,
      attack: 95,
      passing: 87,
      dribbling: 91,
      defence: 72,
      physical: 85,
    },
  },
  {
    name: "Marco Verratti",
    position: "CM",
    rating: 87,
    id: 32,
    club: "Paris Saint-Germain",
    nationality: "Italy",
    clubToken: "0xd82ee61aa30d018239350f9843cb8a4967b8b3da",
    stats: {
      pace: 68,
      attack: 63,
      passing: 92,
      dribbling: 88,
      defence: 82,
      physical: 75,
    },
  },
  {
    name: "Neymar Jr",
    position: "LW",
    rating: 89,
    id: 33,
    club: "Paris Saint-Germain",
    nationality: "Brazil",
    clubToken: "0xd82ee61aa30d018239350f9843cb8a4967b8b3da",
    stats: {
      pace: 89,
      attack: 90,
      passing: 85,
      dribbling: 93,
      defence: 70,
      physical: 78,
    },
  },
  {
    name: "Lionel Messi",
    position: "RW",
    rating: 90,
    id: 34,
    club: "Paris Saint-Germain",
    nationality: "Argentina",
    clubToken: "0xd82ee61aa30d018239350f9843cb8a4967b8b3da",
    stats: {
      pace: 85,
      attack: 79,
      passing: 88,
      dribbling: 94,
      defence: 75,
      physical: 72,
    },
  },
  {
    name: "Sergio Ramos",
    position: "CB",
    rating: 84,
    id: 35,
    club: "Paris Saint-Germain",
    nationality: "Spain",
    clubToken: "0xd82ee61aa30d018239350f9843cb8a4967b8b3da",
    stats: {
      pace: 77,
      attack: 72,
      passing: 80,
      dribbling: 74,
      defence: 85,
      physical: 84,
    },
  },
  {
    name: "Harry Kane",
    position: "ST",
    rating: 89,
    id: 36,
    club: "Tottenham Hotspur",
    nationality: "England",
    clubToken: "0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5",
    stats: {
      pace: 83,
      attack: 87,
      passing: 80,
      dribbling: 83,
      defence: 76,
      physical: 85,
    },
  },
  {
    name: "Heung-Min Son",
    position: "LW",
    rating: 87,
    id: 37,
    club: "Tottenham Hotspur",
    nationality: "South Korea",
    clubToken: "0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5",
    stats: {
      pace: 88,
      attack: 82,
      passing: 76,
      dribbling: 86,
      defence: 72,
      physical: 78,
    },
  },
  {
    name: "Rodrigo Bentancur",
    position: "CM",
    rating: 83,
    id: 38,
    club: "Tottenham Hotspur",
    nationality: "Uruguay",
    clubToken: "0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5",
    stats: {
      pace: 80,
      attack: 76,
      passing: 78,
      dribbling: 82,
      defence: 80,
      physical: 81,
    },
  },
  {
    name: "Eric Dier",
    position: "CB",
    rating: 81,
    id: 39,
    club: "Tottenham Hotspur",
    nationality: "England",
    clubToken: "0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5",
    stats: {
      pace: 74,
      attack: 72,
      passing: 81,
      dribbling: 73,
      defence: 85,
      physical: 83,
    },
  },
  {
    name: "Richarlison",
    position: "ST",
    rating: 85,
    id: 40,
    club: "Tottenham Hotspur",
    nationality: "Brazil",
    clubToken: "0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5",
    stats: {
      pace: 86,
      attack: 79,
      passing: 82,
      dribbling: 84,
      defence: 73,
      physical: 81,
    },
  },
];
export const teams = [
  [0x87dd08be032a03d937f2a8003dfa9c52821cbab9, "AC Milan", 489],
  [0x45e50677f8deca7cc582ad573b525409d1233592, "FC Barcelona", 529],
  [0x34c00007cf1ca7a3d9dcce8cf1d3f75b4db4d37e, "Inter Milan", 505],
  [0x634c9b919a484913c46362e2e0e700576920c994, "Juventus", 496],
  [0x660e2d9f26542957c7e819f91944d72cfca32058, "Manchester City", 50],
  [0x2452a4eec9359ff93c084ed5ed3e21eac197586d, "Napoli", 212],
  [0xd82ee61aa30d018239350f9843cb8a4967b8b3da, "Paris Saint-Germain", 85],
  [0xd0b9383c34297bd7a9d01c2fa8da22124dfe1ec5, "Tottenham Hotspur", 47],
];
