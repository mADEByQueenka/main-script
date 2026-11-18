const PROJECTS = [
  {
    id: "inforest",
    name: "INFOREST",
    description: "Главный сайт и экологический проект INFOREST, посвящённый сохранению природы и экологической осведомлённости.",
    status: "official",
    confirmed: ["Главный сайт проекта", "Экологическая направленность"],
    unconfirmed: ["Конкретные текущие кампании и формы участия — проверяй на сайте"],
    url: "https://inforest.site/",
    keywords: ["главный сайт", "экология", "природа", "основной", "inforest"]
  },
  {
    id: "europe",
    name: "INFOREST Europe",
    description: "Европейское направление INFOREST с обозначением SAVE EUROPE.",
    status: "official",
    confirmed: ["Название INFOREST Europe", "Направление SAVE EUROPE"],
    unconfirmed: ["Функции платформы, партнёрства, программы и формы участия не подтверждены этой базой"],
    url: "https://europe.inforest.site/",
    keywords: ["европа", "europe", "save europe"]
  },
  {
    id: "music",
    name: "INFOREST Music",
    description: "Музыкальный проект INFOREST с собственным каталогом.",
    status: "project",
    confirmed: ["Собственный музыкальный каталог — выбранная концепция проекта"],
    unconfirmed: ["Полный список доступных функций, релизов и поддерживаемых приложений нужно проверять на сайте"],
    url: "https://music.inforest.site/",
    keywords: ["музыка", "music", "каталог", "слушать", "релизы"]
  },
  {
    id: "artists",
    name: "INFOREST for Artists",
    description: "Отдельное направление INFOREST Music для артистов.",
    status: "project",
    confirmed: ["Сервис/направление для артистов"],
    unconfirmed: ["Подача релизов, верификация, продвижение, профили и другие функции не подтверждены этой базой"],
    url: "https://artist.music.inforest.site/",
    keywords: ["артист", "исполнитель", "галочка", "верификация", "artists"]
  },
  {
    id: "lineya",
    name: "ЛИНИЯ (LINEYA)",
    description: "Проект электронного школьного дневника. Это школьный сервис, а не экологический трекер.",
    status: "project",
    confirmed: ["Назначение — электронный школьный дневник"],
    unconfirmed: ["Наличие и работоспособность отдельных функций зависят от текущей версии сайта"],
    url: "https://dnevnik.inforest.site/",
    keywords: ["дневник", "школа", "оценки", "расписание", "линия", "lineya"]
  },
  {
    id: "ai-site",
    name: "INFOREST AI",
    description: "ИИ-чат на сайте INFOREST.",
    status: "official",
    confirmed: ["Веб-чат с ИИ"],
    unconfirmed: ["Доступные модели и инструменты могут меняться; не обещай конкретную модель без проверки"],
    url: "https://ai.inforest.site/",
    keywords: ["ии", "нейросеть", "ai", "чат", "искусственный интеллект"]
  },
  {
    id: "secretary",
    name: "INFOREST AI Secretary",
    description: "ИИ-секретарь в Telegram.",
    status: "official",
    confirmed: ["Telegram-бот ИИ-секретарь"],
    unconfirmed: ["Доступность отдельных команд и провайдеров зависит от состояния интеграций"],
    url: "https://t.me/inforestaibot",
    keywords: ["секретарь", "телеграм бот", "бот", "ai secretary"]
  }
];

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,OPTIONS",
  "access-control-allow-headers": "content-type",
  "content-type": "application/json; charset=utf-8",
  "cache-control": "public, max-age=60"
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: CORS });
}
function scoreProject(project, terms) {
  return terms.reduce((score, term) => {
    const name = project.name.toLowerCase();
    const description = project.description.toLowerCase();
    const keywords = project.keywords || [];
    return score +
      (name.includes(term) ? 5 : 0) +
      (description.includes(term) ? 1 : 0) +
      (keywords.some(keyword => keyword.includes(term) || term.includes(keyword)) ? 4 : 0);
  }, 0);
}
function projectContext(project) {
  return {
    name: project.name,
    description: project.description,
    status: project.status,
    confirmed: project.confirmed,
    unconfirmed: project.unconfirmed,
    url: project.url
  };
}
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (request.method !== "GET") return json({ ok: false, error: "GET only" }, 405);
    if (url.pathname === "/" || url.pathname === "/health") {
      return json({
        ok: true,
        service: "INFOREST Knowledge API",
        version: "2.0.0",
        policy: "verified-facts-only",
        endpoints: ["/v1/projects", "/v1/search?q=...", "/v1/context?q=..."]
      });
    }
    if (url.pathname === "/v1/projects") {
      return json({ ok: true, organization: "INFOREST", policy: "verified-facts-only", projects: PROJECTS.map(projectContext) });
    }
    if (url.pathname === "/v1/search" || url.pathname === "/v1/context") {
      const q = (url.searchParams.get("q") || "").toLowerCase().trim().slice(0, 500);
      if (!q) return json({ ok: false, error: "Provide q" }, 400);
      const terms = q.split(/[^a-zа-яё0-9]+/i).filter(term => term.length > 1);
      const ranked = PROJECTS
        .map(project => ({ project, score: scoreProject(project, terms) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);
      const found = ranked.length ? ranked.slice(0, 5).map(item => item.project) : PROJECTS;
      if (url.pathname === "/v1/search") {
        return json({ ok: true, query: q, results: found.map(projectContext) });
      }
      const system_context = [
        "Ты отвечаешь на вопросы об экосистеме INFOREST. Используй каталог ниже как единственный источник подтверждённых фактов о проектах.",
        "ВАЖНО: INFOREST — набор разных проектов. Нельзя утверждать, что каждый проект имеет экологическую миссию или общие функции.",
        "Не додумывай функции, тарифы, статусы разработки, доступность приложений, партнёрства, географию или способы участия.",
        "Поле confirmed содержит только подтверждённые сведения. Поле unconfirmed перечисляет сведения, которые нельзя выдавать за факты.",
        "ЛИНИЯ (LINEYA) — электронный школьный дневник. Никогда не описывай её как экологический трекер или систему учёта экологических проектов.",
        "INFOREST Europe обозначен как SAVE EUROPE; не называй его платформой сотрудничества без отдельного подтверждения.",
        "INFOREST for Artists — направление для артистов; не обещай профили, релизы, продвижение или верификацию без подтверждения.",
        "Если вопрос касается неподтверждённой функции, скажи прямо, что база её не подтверждает, и предложи проверить официальный сайт.",
        "Не утверждай, что сайт, бот или интеграция работают прямо сейчас, если нет результата актуальной проверки.",
        "Давай прямую ссылку на соответствующий проект. Не придумывай URL."
      ].join(" "),
      return json({
        ok: true,
        query: q,
        policy: "verified-facts-only",
        system_context,
        relevant_projects: found.map(projectContext),
        all_projects: PROJECTS.map(({ name, url, status }) => ({ name, url, status }))
      });
    }
    return json({ ok: false, error: "Not found" }, 404);
  }
};