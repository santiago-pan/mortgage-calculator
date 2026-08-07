export const MAX_NHG = 405000;
export const NHG_FEE = 0.006;

export function isNhgEligible(price: number): boolean {
  return price <= MAX_NHG;
}

export function nhgFee(price: number, loan: number): number {
  return isNhgEligible(price) ? NHG_FEE * loan : 0;
}
