export function generateKey(prefix: string, id: string, idx: string) {
  return `${prefix}_${id}_${idx}`;
}
