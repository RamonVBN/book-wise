

export function slugifyUserName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // remove símbolos
    .trim()
    .replace(/\s+/g, "-");
}
