# INFOREST Knowledge API

Единый источник подтверждённых сведений о проектах INFOREST для ИИ-сервисов экосистемы.

**Production URL:** https://inforest-knowledge-api.bogdan24112000.workers.dev  
**API version:** 2.0.0  
**Policy:** verified facts only

## Endpoints

- `GET /health` — состояние API и версия.
- `GET /v1/projects` — полный каталог с описаниями, статусами, подтверждёнными фактами и неподтверждёнными функциями.
- `GET /v1/search?q=музыка` — поиск по названию и ключевым словам.
- `GET /v1/context?q=что такое ЛИНИЯ` — системные правила и сведения для ИИ.

## Accuracy rules

1. Не придумывайте функции, цены, статусы разработки, доступность приложений, партнёрства, географию и способы участия.
2. Не утверждайте, что все проекты INFOREST имеют одну экологическую миссию или общий набор функций.
3. ЛИНИЯ (LINEYA) — проект электронного школьного дневника, а не экологический трекер.
4. INFOREST Europe обозначен как SAVE EUROPE; не описывайте его как платформу сотрудничества без подтверждения.
5. INFOREST for Artists — направление для артистов. Не обещайте профили, релизы, продвижение или верификацию без подтверждения.
6. Если сведения отсутствуют или помечены как неподтверждённые, прямо сообщайте об этом и давайте официальный URL.
7. Не утверждайте, что сайт, бот или интеграция работают прямо сейчас, если нет результата актуальной проверки.

## Подключение к INFOREST AI

- INFOREST AI — `https://ai.inforest.site/`
- INFOREST AI Secretary — `https://t.me/inforestaibot`

Оба сервиса запрашивают `/v1/context` и включают в контекст ИИ описания, подтверждённые сведения, ограничения и прямые ссылки. При недоступности API основной чат продолжает работу без каталога.

## JavaScript client

```js
export async function getInforestContext(userMessage) {
  const endpoint = new URL(
    "/v1/context",
    "https://inforest-knowledge-api.bogdan24112000.workers.dev"
  );
  endpoint.searchParams.set("q", String(userMessage || "").slice(0, 500));
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("INFOREST Knowledge API unavailable");
  const data = await response.json();
  if (!data.ok) throw new Error("Invalid INFOREST Knowledge API response");
  return data;
}
```

## Security

API is public and read-only. Do not send passwords, tokens, personal or private data. Never place secrets or user data in the project catalogue.
