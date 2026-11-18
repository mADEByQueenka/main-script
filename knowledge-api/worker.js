const PROJECTS = [
  { id: "inforest", name: "INFOREST", description: "Official website and environmental initiative focused on nature protection, awareness and practical cooperation.", url: "https://inforest.site/", keywords: ["главный сайт", "экология", "природа", "основной", "inforest"] },
  { id: "europe", name: "INFOREST Europe", description: "European initiative for cooperation, awareness and a shared future.", url: "https://europe.inforest.site/", keywords: ["европа", "europe", "save europe"] },
  { id: "music", name: "INFOREST Music", description: "Independent music platform for listeners, artists and releases.", url: "https://music.inforest.site/", keywords: ["музыка", "music", "слушать", "релизы"] },
  { id: "artists", name: "INFOREST for Artists", description: "Artist-facing space for profiles, releases and music presence.", url: "https://artist.music.inforest.site/", keywords: ["артист", "исполнитель", "галочка", "верификация", "artists"] },
  { id: "lineya", name: "ЛИНИЯ (LINEYA)", description: "School platform for schedules, homework, grades and communication.", url: "https://dnevnik.inforest.site/", keywords: ["дневник", "школа", "оценки", "расписание", "линия", "lineya"] },
  { id: "secretary", name: "INFOREST AI Secretary", description: "AI assistant available through the official INFOREST Telegram bot.", url: "https://t.me/inforestaibot", keywords: ["секретарь", "телеграм бот", "бот", "ai secretary"] }
];
const CORS = { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,OPTIONS", "access-control-allow-headers": "content-type", "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300" };
function json(data, status = 200) { return new Response(JSON.stringify(data, null, 2), { status, headers: CORS }); }
export default { async fetch(request) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (request.method !== "GET") return json({ ok: false, error: "GET only" }, 405);
  if (url.pathname === "/" || url.pathname === "/health") return json({ ok: true, service: "INFOREST Knowledge API", version: "1.0.0", endpoints: ["/v1/projects", "/v1/search?q=...", "/v1/context?q=..."] });
  if (url.pathname === "/v1/projects") return json({ ok: true, organization: "INFOREST", projects: PROJECTS });
  if (url.pathname === "/v1/search" || url.pathname === "/v1/context") {
    const q = (url.searchParams.get("q") || "").toLowerCase().trim();
    if (!q) return json({ ok: false, error: "Provide q" }, 400);
    const terms = q.split(/[^a-zа-яё0-9]+/i).filter(x => x.length > 1);
    const ranked = PROJECTS.map(p => ({ ...p, score: terms.reduce((n, t) => n + (p.name.toLowerCase().includes(t) ? 4 : 0) + (p.description.toLowerCase().includes(t) ? 1 : 0) + (p.keywords.some(k => k.includes(t) || t.includes(k)) ? 3 : 0), 0) })).filter(p => p.score > 0).sort((a, b) => b.score - a.score);
    const found = ranked.length ? ranked : PROJECTS;
    if (url.pathname === "/v1/search") return json({ ok: true, query: q, results: found.map(({ id, name, description, url }) => ({ id, name, description, url })) });
    return json({ ok: true, query: q, system_context: "INFOREST — экосистема официальных проектов. Используй только следующие подтверждённые сведения и ссылки. Если вопрос касается конкретного проекта, называй его и давай прямую ссылку. Не выдумывай функции, тарифы, статусы или URL. Если подходящего проекта нет в списке, честно скажи, что в базе его пока нет.", relevant_projects: found.map(({ name, description, url }) => ({ name, description, url })), all_projects: PROJECTS.map(({ name, url }) => ({ name, url })) });
  }
  return json({ ok: false, error: "Not found" }, 404);
} };