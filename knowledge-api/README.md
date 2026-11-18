# INFOREST Knowledge API

Единый источник актуальных сведений о проектах INFOREST для всех ИИ-помощников экосистемы.

**Production URL:** https://inforest-knowledge-api.bogdan24112000.workers.dev

## Endpoints

- `GET /health` — состояние API и список методов.
- `GET /v1/projects` — полный каталог официальных проектов.
- `GET /v1/search?q=музыка` — поиск проектов по названию и ключевым словам.
- `GET /v1/context?q=как подать заявку артисту` — контекст для системного сообщения ИИ: подтверждённые сведения и прямые ссылки.

Все методы публичные, только для чтения. CORS включён. Не передавайте сюда пароли, токены, персональные или приватные данные.

## Подключение к любому INFOREST AI (JavaScript)

```js
export async function getInforestContext(userMessage) {
  const endpoint = new URL("/v1/context", "https://inforest-knowledge-api.bogdan24112000.workers.dev");
  endpoint.searchParams.set("q", String(userMessage || "").slice(0, 500));
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("INFOREST Knowledge API unavailable");
  const data = await response.json();
  if (!data.ok) throw new Error("Invalid INFOREST Knowledge API response");
  return data;
}

// Добавляйте data.system_context и ссылки из data.relevant_projects
// в контекст ИИ перед генерацией ответа.
```

## Правила

1. Считайте API единственным источником официальных названий и ссылок INFOREST.
2. При вопросе о конкретном проекте включайте прямую ссылку в ответ.
3. Не придумывайте несуществующие проекты, функции, цены и статусы.
4. Обновляйте каталог в `worker.js`, когда проект меняет адрес или описание.
5. Не помещайте секреты и пользовательские данные в каталог.

## Подключения

- INFOREST AI Secretary — подключён к `/v1/context` в личном и Business-режиме.
- Sonora и ЛИНИЯ — в текущих версиях репозиториев отдельного ИИ-модуля не обнаружено; подключение возможно при добавлении ИИ-функций.
