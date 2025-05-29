

export function formatBookName(bookName: string){

    if (bookName.split(' ').length > 4) {
        
        return bookName.split(' ').slice(0, 4).join(' ').concat('...')
    }

    return bookName

}