export type MonthMortgageData = {
  month: number;
  balance: number;
  grossPaid: number;
  capitalPaid: number;
  interest: number;
  remaining: number;
  deduction: number;
  netPaid: number;
}

export type MortgageData = {
  totals: {
    totalPaidGross: number;
    totalPaidNet: number;
  };
  monthly: Array<MonthMortgageData>;
};
