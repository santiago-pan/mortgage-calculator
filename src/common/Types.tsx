export type MonthMortgageData = {
  month: number;
  balance: number;
  grossPaid: number;
  capitalPaid: number;
  interest: number;
  deduction: number;
  netPaid: number;
}

export type MortgageData = {
  totals: {
    totalPaidGross: number;
    totalPaidNet: number;
    totalInterestGross: number;
    totalInterestNet: number;
    totalInvestedGross: number;
    totalInvestedNet: number;
    payoffMonth: number;
  };
  monthly: Array<MonthMortgageData>;
};

export type Overpayment = {
  monthly: number;
  lumpSum?: { month: number; amount: number };
};
