

export function formatCategories(category: string, index: number){

    if (index > 0 ) {
        
        return `, ${category.split('')[0].concat(category.substring(1))}`
    }

    return category
}