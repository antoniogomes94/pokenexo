const CALENDAR_PLAYED_DAYS = new Set([8, 12, 14, 16, 17, 19]);
const CALENDAR_MOCK_MONTH = { year: 2026, month: 3 };

const MONTH_NAMES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];
const WEEK_HEADERS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function renderCalendar(appEl) {
  appEl.innerHTML = `
    <header class="app-header">
      <button class="icon-btn" id="back-btn" aria-label="Voltar">←</button>
      <h1 class="app-title">POKENEXO</h1>
      <div class="header-spacer"></div>
    </header>
    <main class="calendar-main">
      <div class="calendar-nav">
        <button class="icon-btn" id="prev-month" aria-label="Mês anterior">‹</button>
        <span class="calendar-month-label" id="month-label"></span>
        <button class="icon-btn" id="next-month" aria-label="Próximo mês">›</button>
      </div>
      <div class="calendar-grid-wrap" id="cal-grid"></div>
    </main>
  `;

  let currentYear  = CALENDAR_MOCK_MONTH.year;
  let currentMonth = CALENDAR_MOCK_MONTH.month;

  function renderGrid() {
    const label = document.getElementById("month-label");
    label.textContent = `${MONTH_NAMES[currentMonth]} de ${currentYear}`;

    const today = new Date();
    const todayY = today.getFullYear();
    const todayM = today.getMonth();
    const todayD = today.getDate();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const grid = document.getElementById("cal-grid");
    let html = `<div class="calendar-header-row">`;
    WEEK_HEADERS.forEach(h => {
      html += `<div class="calendar-header-cell">${h}</div>`;
    });
    html += `</div>`;

    let day = 1;
    for (let row = 0; row < 6; row++) {
      if (day > daysInMonth) break;
      html += `<div class="calendar-row">`;
      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < firstDay || day > daysInMonth) {
          html += `<div class="calendar-cell empty"></div>`;
        } else {
          const isSameMonth = currentYear === todayY && currentMonth === todayM;
          const isToday    = isSameMonth && day === todayD;
          const isFuture   = currentYear > todayY
            || (currentYear === todayY && currentMonth > todayM)
            || (isSameMonth && day > todayD);
          const isPlayed   = !isFuture && CALENDAR_PLAYED_DAYS.has(day)
            && currentYear === CALENDAR_MOCK_MONTH.year
            && currentMonth === CALENDAR_MOCK_MONTH.month;

          let cls = "calendar-cell";
          if (isToday)   cls += " today";
          if (isFuture)  cls += " future";
          if (isPlayed)  cls += " played";

          html += `<div class="${cls}" data-day="${day}">${day}</div>`;
          day++;
        }
      }
      html += `</div>`;
    }

    grid.innerHTML = html;

    grid.querySelectorAll(".calendar-cell.played").forEach(cell => {
      cell.addEventListener("click", () => {
        console.log("Played day clicked:", cell.dataset.day);
      });
    });
  }

  renderGrid();

  appEl.querySelector("#back-btn").addEventListener("click", () => {
    location.hash = "#/";
  });

  appEl.querySelector("#prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderGrid();
  });
  appEl.querySelector("#next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderGrid();
  });
}
