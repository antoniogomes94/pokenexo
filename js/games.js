function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(arr, seed) {
  const rng = mulberry32(seed);
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const GAMES = [
  {
    id: 1,
    title: "Clássicos de Kanto",
    difficulty: "Fácil",
    groups: [
      {
        theme: "Iniciais de Kanto",
        color: "yellow",
        words: ["BULBASAUR", "CHARMANDER", "SQUIRTLE"]
      },
      {
        theme: "Aves Lendárias de Kanto",
        color: "green",
        words: ["ARTICUNO", "ZAPDOS", "MOLTRES"]
      },
      {
        theme: "Evoluções do Eevee (Gen 1)",
        color: "blue",
        words: ["VAPOREON", "JOLTEON", "FLAREON"]
      },
      {
        theme: "Pokémon do Brock no anime",
        color: "purple",
        words: ["ONIX", "GEODUDE", "VULPIX"]
      }
    ]
  },
  {
    id: 2,
    title: "Iniciais e Evoluções",
    difficulty: "Fácil/Médio",
    groups: [
      {
        theme: "Iniciais de Água",
        color: "yellow",
        words: ["SQUIRTLE", "TOTODILE", "MUDKIP"]
      },
      {
        theme: "Iniciais de Planta",
        color: "green",
        words: ["BULBASAUR", "CHIKORITA", "TREECKO"]
      },
      {
        theme: "Iniciais de Fogo",
        color: "blue",
        words: ["CHARMANDER", "CYNDAQUIL", "TORCHIC"]
      },
      {
        theme: "Evoluções finais de iniciais de Fogo",
        color: "purple",
        words: ["CHARIZARD", "TYPHLOSION", "BLAZIKEN"]
      }
    ]
  },
  {
    id: 3,
    title: "Lendários pelas Regiões",
    difficulty: "Médio",
    groups: [
      {
        theme: "Aves Lendárias de Kanto",
        color: "yellow",
        words: ["ARTICUNO", "ZAPDOS", "MOLTRES"]
      },
      {
        theme: "Bestas Lendárias de Johto",
        color: "green",
        words: ["RAIKOU", "ENTEI", "SUICUNE"]
      },
      {
        theme: "Trio de Capa de Hoenn",
        color: "blue",
        words: ["KYOGRE", "GROUDON", "RAYQUAZA"]
      },
      {
        theme: "Trio da Criação de Sinnoh",
        color: "purple",
        words: ["DIALGA", "PALKIA", "GIRATINA"]
      }
    ]
  },
  {
    id: 4,
    title: "Mecânicas de Evolução",
    difficulty: "Médio/Difícil",
    groups: [
      {
        theme: "Evoluem por Troca",
        color: "yellow",
        words: ["KADABRA", "MACHOKE", "GRAVELER"]
      },
      {
        theme: "Evoluem com Pedra d'Água",
        color: "green",
        words: ["POLIWHIRL", "SHELLDER", "STARYU"]
      },
      {
        theme: "Evoluem por Felicidade",
        color: "blue",
        words: ["PICHU", "CLEFFA", "RIOLU"]
      },
      {
        theme: "Pseudo-lendários (1ª forma)",
        color: "purple",
        words: ["DRATINI", "LARVITAR", "BAGON"]
      }
    ]
  },
  {
    id: 5,
    title: "Trivia Hardcore",
    difficulty: "Difícil",
    groups: [
      {
        theme: "Ace dos Líderes de Ginásio de Kanto",
        color: "yellow",
        words: ["ONIX", "STARMIE", "RAICHU"]
      },
      {
        theme: "Equipe Rocket no anime",
        color: "green",
        words: ["EKANS", "KOFFING", "MEOWTH"]
      },
      {
        theme: "Pseudo-lendários (evolução final)",
        color: "blue",
        words: ["DRAGONITE", "TYRANITAR", "SALAMENCE"]
      },
      {
        theme: "Mascotes de capa de jogos principais",
        color: "purple",
        words: ["LUGIA", "KYOGRE", "DIALGA"]
      }
    ]
  }
];

function getGameById(id) {
  return GAMES.find(g => g.id === Number(id));
}

function getAllWords(game) {
  return game.groups.flatMap(g => g.words);
}

function getGroupForWord(game, word) {
  return game.groups.find(g => g.words.includes(word));
}

function getGroupByColor(game, color) {
  return game.groups.find(g => g.color === color);
}

const COLOR_EMOJI = {
  yellow: "🟨",
  green: "🟩",
  blue: "🟦",
  purple: "🟪"
};

async function generateDailyGame(dateStr, seedOverride) {
  const allThemes = THEMES_DATA;

  const validThemes = allThemes.filter(t =>
    new Set(t.words.map(w => w.toUpperCase())).size === t.words.length
  );

  const seed = seedOverride !== undefined
    ? seedOverride
    : parseInt(dateStr.replace(/-/g, ""), 10);
  const rng  = mulberry32(seed);

  const byDiff = { easy: [], medium: [], hard: [] };
  validThemes.forEach((t, i) => byDiff[t.difficulty]?.push(i));

  const counts = rng() < 0.5
    ? { easy: 1, medium: 2, hard: 1 }
    : { easy: 1, medium: 1, hard: 2 };

  const shuffled = {
    easy:   seededShuffle(byDiff.easy,   seed + 1),
    medium: seededShuffle(byDiff.medium, seed + 2),
    hard:   seededShuffle(byDiff.hard,   seed + 3)
  };

  const COLOR_ORDER = ["yellow", "green", "blue", "purple"];
  const groups = [];
  const usedPokemon = new Set();

  for (const [diff, n] of [["easy", counts.easy], ["medium", counts.medium], ["hard", counts.hard]]) {
    let picked = 0;
    for (const idx of shuffled[diff]) {
      const theme = validThemes[idx];
      const names = theme.words.map(w => w.toUpperCase());
      if (names.some(p => usedPokemon.has(p))) continue;
      groups.push({ theme: theme.theme, color: COLOR_ORDER[groups.length], words: names });
      names.forEach(p => usedPokemon.add(p));
      if (++picked === n) break;
    }
  }

  return {
    id: `daily-${dateStr}`,
    title: "Jogo Diário",
    daily: true,
    groups
  };
}
