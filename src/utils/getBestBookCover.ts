type IndustryIdentifier = {
  type: string
  identifier: string
}

type BookCoverInput = {
  googleCover?: string
  industryIdentifiers?: IndustryIdentifier[]
}

export async function getBestBookCover({
  googleCover,
  industryIdentifiers
}: BookCoverInput) {
  const isbn =
    industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier ??
    industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier

  if (isbn) {
    const openLibraryUrl =
      `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`

    try {
      const response = await fetch(openLibraryUrl, {
        method: "HEAD",
      })

      if (response.ok) {
        return openLibraryUrl
      }
    } catch {
      // falha silenciosa → continua fallback
    }
  }

  if (googleCover) {
    return googleCover
      .replace("&edge=curl", "")
  }

}