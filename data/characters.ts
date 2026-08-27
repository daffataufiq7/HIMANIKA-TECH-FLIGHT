export interface Character {
  id: string;
  name: string;
  codeName: string;
  prodi: string;
  tagline: string;
  description: string;
  color: string;
  secondaryColor: string;
  glowColor: string;
  accentIcon: string;
  stats: {
    agility: number;
    sensor: number;
    power: number;
  };
  visualStyle: {
    bodyShape: 'drone' | 'scout' | 'heavy';
    wingType: 'plasma' | 'circuit' | 'energy';
    trailColor: string;
  };
}

export const CHARACTERS: Character[] = [
  {
    id: "tech-pilot",
    name: "TECH PILOT",
    codeName: "TI-01 CODEWING",
    prodi: "Teknologi Informasi",
    tagline: "Code. Create. Innovate.",
    description: "Drone pengintai siber presisi tinggi dengan sistem AI terintegrasi untuk pengolahan data instan.",
    color: "#00f0ff",
    secondaryColor: "#3b82f6",
    glowColor: "rgba(0, 240, 255, 0.6)",
    accentIcon: "Code",
    stats: {
      agility: 90,
      sensor: 95,
      power: 75,
    },
    visualStyle: {
      bodyShape: 'drone',
      wingType: 'plasma',
      trailColor: '#00f0ff',
    }
  },
  {
    id: "circuit-pilot",
    name: "CIRCUIT PILOT",
    codeName: "PTI-02 MICROCORE",
    prodi: "Pendidikan Teknik Informatika",
    tagline: "Teach. Tech. Transform.",
    description: "Robot aerobatik ultra-responsif yang memadukan teknologi komputasi, algoritma, dan sistem edukasi siber.",
    color: "#00ff9d",
    secondaryColor: "#10b981",
    glowColor: "rgba(0, 255, 157, 0.6)",
    accentIcon: "Cpu",
    stats: {
      agility: 95,
      sensor: 85,
      power: 80,
    },
    visualStyle: {
      bodyShape: 'scout',
      wingType: 'circuit',
      trailColor: '#00ff9d',
    }
  },
  {
    id: "power-pilot",
    name: "POWER PILOT",
    codeName: "PTE-03 VOLTTHRUST",
    prodi: "Pendidikan Teknik Elektronika",
    tagline: "Circuit. Power. Innovate.",
    description: "Unit udara bertenaga tinggi dengan generator plasma ion dan pengontrol sirkuit elektronika presisi.",
    color: "#ffb700",
    secondaryColor: "#f59e0b",
    glowColor: "rgba(255, 183, 0, 0.6)",
    accentIcon: "Zap",
    stats: {
      agility: 80,
      sensor: 80,
      power: 100,
    },
    visualStyle: {
      bodyShape: 'heavy',
      wingType: 'energy',
      trailColor: '#ffb700',
    }
  }
];
