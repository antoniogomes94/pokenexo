function buildShareText(game, state) {
  const emojis = state.solveOrder.map(color => COLOR_EMOJI[color] || "").join("");
  const tentativas = `${state.attempts} tentativa${state.attempts === 1 ? "" : "s"}`;
  const gameLabel = game.daily
    ? `Jogo Diário ${new Date().toLocaleDateString("pt-BR")}`
    : `#${game.id}`;
  return `Pokenexo ${gameLabel} — ${game.title}\n${emojis}\n${tentativas}`;
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallthrough
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
