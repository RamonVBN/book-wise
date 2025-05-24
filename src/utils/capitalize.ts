

export function capitalize(string: string){

    return string.split('')[0].toUpperCase().concat(string.substring(1))
}