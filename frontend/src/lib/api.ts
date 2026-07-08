export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchTools() {
  const res = await fetch(`${API_BASE_URL}/tools`);
  if (!res.ok) {
    throw new Error("Failed to fetch tools");
  }
  return res.json();
}

export async function getToolBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/tools/${slug}`);
  if (!res.ok) {
    throw new Error("Failed to fetch tool");
  }
  return res.json();
}

export async function searchTools(query: string) {
  const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error("Failed to search tools");
  }
  return res.json();
}
