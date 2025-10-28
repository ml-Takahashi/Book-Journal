export function toSectionLabel(order: number): string {
  const safeOrder = Number.isFinite(order) && order > 0 ? Math.floor(order) : 1;
  return `${safeOrder}節`;
}
