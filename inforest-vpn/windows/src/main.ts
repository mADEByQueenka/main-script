import "./style.css";

type Entry = { scheme: string; label: string; host: string };

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div class="shell">
    <aside class="rail">
      <div class="brand-mark">i</div>
      <div class="rail-line"></div>
      <div class="rail-dot active"></div>
      <div class="rail-dot"></div>
      <div class="rail-dot"></div>
      <div class="rail-bottom">0.1</div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div><div class="eyebrow">INFOREST NETWORK</div><div class="wordmark">inforest<span>vpn</span></div></div>
        <div class="top-actions"><span class="status-pill"><i></i> PREVIEW BUILD</span><button class="icon-button" aria-label="Settings">⚙</button></div>
      </header>
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow">PRIVATE CONNECTION, OPEN SOURCE</div>
          <h1>Your connection.<br><em>Your control.</em></h1>
          <p>Импортируй подписку, чтобы посмотреть доступные конфигурации. Подключение появится после интеграции VPN-движка.</p>
        </div>
        <div class="orb"><div class="orb-core">I</div><div class="orb-ring ring-a"></div><div class="orb-ring ring-b"></div><div class="orb-spark"></div></div>
      </section>
      <section class="connect-card">
        <div class="card-heading"><div><div class="eyebrow">CONNECTION</div><h2>Не подключено</h2></div><span class="lock">◈</span></div>
        <div class="connection-line"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <button class="connect-button" disabled><span>Подключиться</span><b>↗</b></button>
        <div class="disabled-note">Подключение пока недоступно — серверный модуль ещё не подключён.</div>
      </section>
      <section class="lower-grid">
        <div class="panel import-panel">
          <div class="panel-title"><div><div class="eyebrow">CONFIGURATION</div><h3>Моя подписка</h3></div><span class="panel-icon">↳</span></div>
          <p class="muted">Вставь ссылку подписки или текст конфигураций. Обработка выполняется локально в этом окне.</p>
          <textarea id="subscription" spellcheck="false" placeholder="https://example.com/your-subscription&#10;или vless://…"></textarea>
          <div class="import-row"><span id="import-status">Подписка не добавлена</span><button id="import-btn">Импортировать <b>→</b></button></div>
          <div id="entries" class="entries"></div>
        </div>
        <div class="panel info-panel">
          <div class="eyebrow">PROJECT STATUS</div><h3>Открытая разработка</h3>
          <div class="status-row"><span>Windows client</span><b class="tag current">UI preview</b></div>
          <div class="status-row"><span>Subscription parser</span><b class="tag current">Local preview</b></div>
          <div class="status-row"><span>Tunnel engine</span><b class="tag pending">Not integrated</b></div>
          <div class="status-row"><span>Server network</span><b class="tag pending">Not launched</b></div>
          <a class="source-link" href="https://github.com/mADEByQueenka/main-script/tree/inforest-vpn" target="_blank" rel="noreferrer">Исходный код на GitHub <span>↗</span></a>
        </div>
      </section>
      <footer><span>© 2026 INFOREST</span><span>OPEN SOURCE · BUILT IN PUBLIC</span></footer>
    </main>
  </div>
`;

function decodeSubscription(raw: string): string {
  const cleaned = raw.trim();
  if (!cleaned) return "";
  if (/^(vless|vmess|trojan|ss|socks):\/\//im.test(cleaned)) return cleaned;
  const candidate = cleaned.replace(/\s+/g, "");
  try {
    const normalized = candidate.replace(/-/g, "+").replace(/_/g, "/");
    return atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  } catch {
    return cleaned;
  }
}

function parseEntries(raw: string): Entry[] {
  const decoded = decodeSubscription(raw);
  const lines = decoded.split(/[\r\n]+/).map((line) => line.trim()).filter(Boolean);
  const entries: Entry[] = [];
  for (const line of lines) {
    const match = line.match(/^(vless|vmess|trojan|ss|socks):\/\/([^\s#?]+)/i);
    if (!match) continue;
    const scheme = match[1].toLowerCase();
    let host = "Скрыт";
    try {
      const withoutAuth = match[2].includes("@") ? match[2].slice(match[2].lastIndexOf("@") + 1) : match[2];
      host = withoutAuth.split(/[/:?]/)[0] || "Скрыт";
    } catch { /* Keep host masked when parsing fails. */ }
    entries.push({ scheme, label: scheme.toUpperCase(), host });
  }
  return entries;
}

document.querySelector<HTMLButtonElement>("#import-btn")!.addEventListener("click", () => {
  const raw = document.querySelector<HTMLTextAreaElement>("#subscription")!.value;
  const status = document.querySelector<HTMLSpanElement>("#import-status")!;
  const list = document.querySelector<HTMLDivElement>("#entries")!;
  const entries = parseEntries(raw);
  list.replaceChildren();
  if (!raw.trim()) {
    status.textContent = "Сначала вставь ссылку или конфигурацию";
    return;
  }
  if (!entries.length) {
    status.textContent = "Формат пока не распознан";
    return;
  }
  status.textContent = `Найдено конфигураций: ${entries.length}`;
  for (const entry of entries) {
    const row = document.createElement("div");
    row.className = "entry";
    const protocol = document.createElement("b");
    protocol.textContent = entry.label;
    const host = document.createElement("span");
    host.textContent = entry.host;
    const state = document.createElement("small");
    state.textContent = "НЕ ПОДКЛЮЧЕНО";
    row.append(protocol, host, state);
    list.append(row);
  }
});
