/**
 * Converte um caminho relativo à pasta `public` em URL absoluta do documento atual.
 * Retorna `null` para caminhos vazios ou externos: o app só reproduz vídeos hospedados junto com ele.
 */
export function resolveAsset(path: string | undefined): string | null {
  if (!path) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('//')) return null;
  try {
    return new URL(path.replace(/^\/+/, ''), document.baseURI).toString();
  } catch {
    return null;
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
