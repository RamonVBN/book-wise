

export function formatCategories(category: string, index: number){

    if (index > 0 ) {
        
        return `, ${category.split('')[0].toLowerCase().concat(category.substring(1))}`
    }

    return category
}