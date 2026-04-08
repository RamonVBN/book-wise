import translate from "translate"
import { franc } from "franc"

translate.engine = "google"

function isPortuguese(text: string) {
  return franc(text) === "por"
}

export async function translateText(text?: string | null) {
  if (!text) return null

  if (isPortuguese(text)) {
    return text
  }

  try {
    return await translate(text, { to: "pt" })
  } catch (error) {
    console.error("Erro ao traduzir:", error)
    return text
  }
}