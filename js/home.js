const POKEBALL_SVG = `<svg width="72" height="72" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M 8 32 A 24 24 0 0 1 56 32 Z" fill="#EE1515"/>
  <path d="M 8 32 A 24 24 0 0 0 56 32 Z" fill="#F0F0F0"/>
  <circle cx="32" cy="32" r="24" fill="none" stroke="#1a1a1a" stroke-width="3"/>
  <line x1="8" y1="32" x2="56" y2="32" stroke="#1a1a1a" stroke-width="3"/>
  <circle cx="32" cy="32" r="7" fill="#F0F0F0" stroke="#1a1a1a" stroke-width="3"/>
  <circle cx="32" cy="32" r="3" fill="#F0F0F0" stroke="#1a1a1a" stroke-width="1.5"/>
</svg>`;

function buildWeekStrip(today) {
  const DAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const dow = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dow);

  return DAYS.map((name, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const isToday = d.toDateString() === today.toDateString();
    return `<div class="week-day${isToday ? " today" : ""}">
      <span class="week-day-name">${name}</span>
      <span class="week-day-num">${d.getDate()}</span>
    </div>`;
  }).join("");
}

function renderHome(appEl) {
  const today = new Date();
  const day   = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year  = today.getFullYear();
  const dateDisplay = `${day}/${month}/${year}`;

  appEl.innerHTML = `
    <header class="app-header">
      <button class="icon-btn theme-toggle" id="theme-toggle-btn" aria-label="Alternar tema">
        <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
                fill="currentColor"/>
        </svg>
        <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="currentColor"/>
          <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="2.5" x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="21.5"/>
            <line x1="2.5" y1="12" x2="5" y2="12"/>
            <line x1="19" y1="12" x2="21.5" y2="12"/>
            <line x1="5.3" y1="5.3" x2="7" y2="7"/>
            <line x1="17" y1="17" x2="18.7" y2="18.7"/>
            <line x1="5.3" y1="18.7" x2="7" y2="17"/>
            <line x1="17" y1="7" x2="18.7" y2="5.3"/>
          </g>
        </svg>
      </button>
      <h1 class="app-title">POKENEXO</h1>
      <button class="icon-btn" id="help-btn" aria-label="Como jogar">?</button>
    </header>
    <main class="home-main">
      <div class="home-logo">
        ${POKEBALL_SVG}
      </div>
      <p class="home-desc">Forme 4 grupos de Pokémon conectados por um tema.</p>

      <div class="daily-card">
        <span class="daily-card-label">Jogo diário</span>
        <span class="daily-card-date">${dateDisplay}</span>
        <button class="btn-primary" id="jogar-btn">Jogar</button>
      </div>

      <div class="week-strip">
        ${buildWeekStrip(today)}
      </div>

      <button class="btn-jogos-anteriores" id="jogos-anteriores-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="2" y="3" width="12" height="11" rx="1.5"
                stroke="currentColor" stroke-width="1.5"/>
          <line x1="2" y1="6.5" x2="14" y2="6.5"
                stroke="currentColor" stroke-width="1.5"/>
          <line x1="5.5" y1="1.5" x2="5.5" y2="4.5"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="10.5" y1="1.5" x2="10.5" y2="4.5"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Jogos anteriores
      </button>
    </main>
  `;

  appEl.querySelector("#jogar-btn").addEventListener("click", () => {
    location.hash = "#/game/daily";
  });
  appEl.querySelector("#jogos-anteriores-btn").addEventListener("click", showComingSoonModal);
  appEl.querySelector("#help-btn").addEventListener("click", openHowToPlay);
  appEl.querySelector("#theme-toggle-btn").addEventListener("click", toggleTheme);
}

const THEME_KEY = "pokenexo:theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f5f7fa" : "#0f1827");
}

function initTheme() {
  let theme = "dark";
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") theme = saved;
  } catch {}
  applyTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch {}
}

initTheme();

function openHowToPlay() {
  const existing = document.querySelector(".modal-backdrop");
  if (existing) return;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-labelledby="how-title">
      <button class="modal-close" aria-label="Fechar">×</button>
      <h2 id="how-title">Como jogar</h2>
      <ul class="how-list">
        <li>Forme grupos de 3 Pokémon que tenham algo em comum.</li>
        <li>Clique em um Pokémon para selecioná-lo. Clique novamente para desselecionar.</li>
        <li>Assim que selecionar 3, o jogo confere automaticamente se o grupo está correto.</li>
        <li>Se estiver correto, a categoria é revelada. Senão, tente novamente.</li>
        <li>Descubra os 4 grupos!</li>
      </ul>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector(".modal-close").addEventListener("click", close);
  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", onKey);
    }
  });

  document.body.appendChild(backdrop);
}

function showComingSoonModal() {
  const existing = document.querySelector(".modal-backdrop");
  if (existing) return;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal" role="dialog">
      <button class="modal-close" aria-label="Fechar">×</button>
      <h2 style="text-align:center; margin-bottom:12px">🚧 Em construção</h2>
      <p style="text-align:center; color: var(--muted); font-size:14px; margin:0; line-height:1.5">
        Esta funcionalidade estará disponível em breve!
      </p>
    </div>
  `;

  const close = () => backdrop.remove();
  backdrop.addEventListener("click", e => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector(".modal-close").addEventListener("click", close);
  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", onKey);
    }
  });

  document.body.appendChild(backdrop);
}
