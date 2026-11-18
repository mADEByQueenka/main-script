export async function getInforestContext(userMessage) {
  const endpoint = new URL("/v1/context", "https://inforest-knowledge-api.bogdan24112000.workers.dev");
  endpoint.searchParams.set("q", String(userMessage || "").slice(0, 500));
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("INFOREST Knowledge API unavailable");
  const data = await response.json();
  if (!data.ok) throw new Error("Invalid INFOREST Knowledge API response");
  return data;
}
