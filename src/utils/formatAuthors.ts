export function formatAuthors(authorsList: string[]) {

  let formatedAuthorsString : string = ''

  authorsList.length > 1
    ? authorsList.map((name, i) => {
        if (i === authorsList.length - 2) {
          formatedAuthorsString += name + " e ";
          return 
        } else if (i < authorsList.length - 1) {
          formatedAuthorsString += name + ", ";
          return
        }
        formatedAuthorsString += name;
        return
      })
    : formatedAuthorsString = authorsList.toString()

    return formatedAuthorsString
}
