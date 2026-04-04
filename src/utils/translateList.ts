import { translateText } from "@/lib/translate"

export async function translateList(categories?: string[]) {
  if (!categories?.length) return []

  const joined = categories.join(" | ")

  const translated = await translateText(joined)

  return translated?.split("|").map(c => c.trim()) ?? []
}