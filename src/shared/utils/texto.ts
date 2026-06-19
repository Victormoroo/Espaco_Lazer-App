/**
 * Deixa a primeira letra de cada palavra em maiúscula (após cada espaço),
 * sem alterar o restante do texto. Ex.: "joão da silva" -> "João Da Silva".
 */
export function capitalizarPalavras(texto: string): string {
  return texto.replace(
    /(^|\s)(\S)/g,
    (_match: string, separador: string, letra: string) => separador + letra.toUpperCase(),
  );
}
