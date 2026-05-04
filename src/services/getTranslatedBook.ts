import { translateText } from "@/lib/translate"
import { translateList } from "@/utils/translateList"

interface GetTranslatedBookProps {
  description: string
  categories: string[]
}

export async function getTranslatedBook({
  categories,
  description,
}: GetTranslatedBookProps) {

  const translatedCategories = await translateList(categories)
  const translatedDescription = await translateText(description)

  return {
    translatedCategories: translatedCategories,
    translatedDescription: translatedDescription
  }
}
