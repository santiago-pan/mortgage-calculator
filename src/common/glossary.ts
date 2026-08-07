export const glossary = {
  nhg: 'Nationale Hypotheek Garantie (NHG): a government-backed mortgage guarantee for loans up to a set price cap. It lowers your interest rate but costs a one-off fee, financed into the loan.',
  loanToPrice: 'Loan / Price rate: your mortgage as a percentage of the house price. Above 100% means you are also borrowing to cover purchase costs.',
  interestDeduction: 'Interest (tax) deduction: in the Netherlands, mortgage interest on your primary residence is deductible from taxable income at this percentage, lowering your net monthly cost.',
  annuity: 'Annuity mortgage: the total monthly payment (capital + interest) stays the same throughout the term; early on you pay mostly interest, later mostly capital.',
  linear: 'Linear mortgage: you repay the same amount of capital every month, so interest (and the total payment) decreases steadily over time.',
  transferTax: 'Transfer tax (overdrachtsbelasting): a one-off Dutch tax on the purchase price, paid at the notary, currently modeled here at 2%.',
  bankGuarantee: 'Bank guarantee: a deposit guarantee (often ~1% of the price) some sellers require before the deal closes, refunded once you complete the purchase.',
} as const;

export type GlossaryTerm = keyof typeof glossary;
