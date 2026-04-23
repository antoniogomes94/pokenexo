const STORAGE_KEY = "pokenexo:v2";

function defaultGameState() {
  return {
    solved: false,
    attempts: 0,
    selectedWords: [],
    solvedGroups: [],
    guessHistory: [],
    solveOrder: []
  };
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { games: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { games: {} };
    if (!parsed.games) parsed.games = {};
    return parsed;
  } catch {
    return { games: {} };
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to write localStorage", e);
  }
}

function loadGameState(id) {
  const data = readAll();
  const key = String(id);
  return { ...defaultGameState(), ...(data.games[key] || {}) };
}

function saveGameState(id, patch) {
  const data = readAll();
  const key = String(id);
  const current = { ...defaultGameState(), ...(data.games[key] || {}) };
  data.games[key] = { ...current, ...patch };
  writeAll(data);
  return data.games[key];
}

function getAllProgress() {
  const data = readAll();
  return data.games || {};
}

function resetGame(id) {
  const data = readAll();
  delete data.games[String(id)];
  writeAll(data);
}
