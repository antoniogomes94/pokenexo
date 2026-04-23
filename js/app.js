function route() {
  const appEl = document.getElementById("app");
  const hash  = location.hash || "#/";

  if (hash === "#/game/daily") {
    renderDailyGame(appEl);
    return;
  }

  const m = hash.match(/^#\/game\/(\d+)$/);
  if (m) {
    renderGame(appEl, m[1]);
    return;
  }

  if (hash === "#/jogos-anteriores") {
    renderCalendar(appEl);
    return;
  }

  renderHome(appEl);
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);
