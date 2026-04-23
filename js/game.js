function renderGame(appEl, gameIdOrObj) {
  const game = (typeof gameIdOrObj === "object" && gameIdOrObj !== null)
    ? gameIdOrObj
    : getGameById(gameIdOrObj);
  if (!game) {
    appEl.innerHTML = `<div class="error-view">Jogo não encontrado. <a href="#/">Voltar</a></div>`;
    return;
  }

  const gameLabel = game.daily ? "Jogo Diário" : `Jogo ${game.id}`;

  const devBtns = game.daily ? `
    <button class="icon-btn dev-btn" id="reset-game-btn" aria-label="Resetar jogo" title="Resetar jogo">↺</button>
    <button class="icon-btn dev-btn" id="new-game-btn" aria-label="Novo jogo aleatório" title="Novo jogo aleatório">🎲</button>
  ` : "";

  appEl.innerHTML = `
    <header class="app-header">
      <button class="icon-btn" id="back-btn" aria-label="Voltar">←</button>
      <h1 class="app-title">POKENEXO</h1>
      <div class="header-actions">
        ${devBtns}
        <button class="icon-btn" id="help-btn" aria-label="Como jogar">?</button>
      </div>
    </header>
    <main class="game-main">
      <div class="game-meta">
        <div class="meta-left">
          <span class="game-num">${gameLabel}</span>
          <span class="meta-stat">TENTATIVAS: <strong id="attempts">0</strong></span>
        </div>
      </div>
      <div class="game-title-row">
        <span class="game-subtitle">${game.title}</span>
      </div>
      <div class="victory-container" id="victory-container"></div>
      <div class="solved-bars" id="solved-bars"></div>
      <div class="grid" id="grid"></div>
    </main>
  `;

  const layoutSeed = typeof game.id === "number"
    ? game.id * 1000 + 7
    : parseInt(String(game.id).replace(/[^0-9]/g, ""), 10) || 42;

  const ctx = {
    game,
    state: loadGameState(game.id),
    layout: seededShuffle(getAllWords(game), layoutSeed),
    busy: false,
    el: {
      grid: appEl.querySelector("#grid"),
      solvedBars: appEl.querySelector("#solved-bars"),
      victoryContainer: appEl.querySelector("#victory-container"),
      attempts: appEl.querySelector("#attempts")
    }
  };

  appEl.querySelector("#back-btn").addEventListener("click", () => {
    location.hash = "#/";
  });
  appEl.querySelector("#help-btn").addEventListener("click", openHowToPlay);

  if (game.daily) {
    appEl.querySelector("#reset-game-btn").addEventListener("click", () => {
      resetGame(ctx.game.id);
      ctx.state = loadGameState(ctx.game.id);
      renderState(ctx);
    });

    appEl.querySelector("#new-game-btn").addEventListener("click", async () => {
      const randomSeed = Math.floor(Math.random() * 4294967296);
      try {
        const newGame = await generateDailyGame(null, randomSeed);
        newGame.id = `daily-random-${randomSeed}`;
        renderGame(appEl, newGame);
      } catch (err) {
        console.error(err);
      }
    });
  }

  renderState(ctx);
}

function renderState(ctx) {
  const { state, layout, el, game } = ctx;

  el.attempts.textContent = state.attempts;

  el.solvedBars.innerHTML = "";
  state.solveOrder.forEach(color => {
    const group = getGroupByColor(game, color);
    const bar = document.createElement("div");
    bar.className = `solved-bar color-${color}`;
    bar.innerHTML = `
      <div class="bar-theme">${group.theme}</div>
      <div class="bar-words">${group.words.join(", ")}</div>
    `;
    el.solvedBars.appendChild(bar);
  });

  el.grid.innerHTML = "";
  const remainingWords = layout.filter(w => {
    const group = getGroupForWord(game, w);
    return !state.solvedGroups.includes(group.color);
  });

  remainingWords.forEach(word => {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.dataset.word = word;
    cell.textContent = word;

    if (state.selectedWords.includes(word)) cell.classList.add("selected");

    cell.addEventListener("click", () => handleCellClick(ctx, word));
    el.grid.appendChild(cell);
  });

  renderVictory(ctx);
}

function handleCellClick(ctx, word) {
  if (ctx.busy || ctx.state.solved) return;
  const selected = ctx.state.selectedWords;
  const idx = selected.indexOf(word);

  let next;
  if (idx >= 0) {
    next = selected.filter(w => w !== word);
  } else {
    if (selected.length >= 3) return;
    next = [...selected, word];
  }

  ctx.state = saveGameState(ctx.game.id, { selectedWords: next });
  renderState(ctx);

  if (next.length === 3) {
    ctx.busy = true;
    setTimeout(() => evaluateGuess(ctx), 350);
  }
}

function evaluateGuess(ctx) {
  const guess = ctx.state.selectedWords;
  const firstGroup = getGroupForWord(ctx.game, guess[0]);
  const allSame = guess.every(w => getGroupForWord(ctx.game, w).color === firstGroup.color);
  const history = ctx.state.guessHistory.concat([guess.slice()]);
  const newAttempts = ctx.state.attempts + 1;

  if (allSame) {
    const newSolved = [...ctx.state.solvedGroups, firstGroup.color];
    const newOrder = [...ctx.state.solveOrder, firstGroup.color];

    const solvedAll = newSolved.length === ctx.game.groups.length;

    ctx.state = saveGameState(ctx.game.id, {
      attempts: newAttempts,
      selectedWords: [],
      solvedGroups: newSolved,
      solveOrder: newOrder,
      guessHistory: history,
      solved: solvedAll
    });
    ctx.busy = false;
    renderState(ctx);
  } else {
    const cells = ctx.el.grid.querySelectorAll(".cell.selected");
    cells.forEach(c => c.classList.add("shake"));
    setTimeout(() => {
      ctx.state = saveGameState(ctx.game.id, {
        attempts: newAttempts,
        selectedWords: [],
        guessHistory: history
      });
      ctx.busy = false;
      renderState(ctx);
    }, 500);
  }
}

function renderVictory(ctx) {
  const { game, state, el } = ctx;
  const container = el.victoryContainer;

  if (!state.solved) {
    container.innerHTML = "";
    return;
  }

  const emojis = state.solveOrder.map(c => COLOR_EMOJI[c] || "").join("");

  container.innerHTML = `
    <div class="victory-card" role="region" aria-labelledby="v-title">
      <h2 id="v-title">Você conectou todos os grupos!</h2>
      <div class="victory-emoji">${emojis}</div>
      <div class="victory-stats">
        <div><strong>${state.attempts}</strong> tentativa${state.attempts === 1 ? "" : "s"}</div>
      </div>
      <div class="victory-actions">
        <button class="btn-primary" id="share-btn">Compartilhar resultado</button>
      </div>
      <div class="toast" id="toast">Copiado!</div>
    </div>
  `;

  container.querySelector("#share-btn").addEventListener("click", async () => {
    const text = buildShareText(game, state);
    const ok = await copyToClipboard(text);
    const toast = container.querySelector("#toast");
    toast.textContent = ok ? "Copiado!" : "Não foi possível copiar";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  });
}

async function renderDailyGame(appEl) {
  appEl.innerHTML = `<div class="error-view" style="padding-top:80px">Carregando…</div>`;
  try {
    const dateStr = new Date().toISOString().slice(0, 10);
    const game = await generateDailyGame(dateStr);
    renderGame(appEl, game);
  } catch (err) {
    appEl.innerHTML = `<div class="error-view">Erro ao carregar. <a href="#/">Voltar</a></div>`;
    console.error(err);
  }
}
