import { MonthMortgageData, MortgageData, Overpayment } from './Types';
import { NHG_FEE, isNhgEligible, nhgFee } from './constants';
import { AppState } from '../App';

export function PMT(rate: number, nperiod: number, pv: number) {
  if (rate === 0) return -pv / nperiod;

  const pvif = Math.pow(1 + rate, nperiod);
  const pmt = (rate / (pvif - 1)) * -(pv * pvif);

  return pmt;
}

export function IPMT(pv: number, pmt: number, rate: number, per: number) {
  const tmp = Math.pow(1 + rate, per - 1);
  return 0 - (pv * tmp * rate + pmt * (tmp - 1));
}

export function PPMT(rate: number, per: number, nper: number, pv: number) {
  const pmt = PMT(rate, nper, pv);
  const ipmt = IPMT(pv, pmt, rate, per);
  return pmt - ipmt;
}

export function calculateAnnuityData(
  loanInterest: number,
  taxDeduction: number,
  savings: number,
  loan: number,
  overpayment?: Overpayment,
): MortgageData {
  const rate = loanInterest / (12 * 100);
  const numberOfPeriods = 360;

  let totalPaidGross = 0;
  let totalPaidNet = 0;
  let accPaid = 0;
  let payoffMonth = numberOfPeriods;
  let paidOff = false;

  const monthly = Array(360)
    .fill(0)
    .map((v, i) => {
      let balance = loan - accPaid;
      balance = Math.max(balance, 0);
      const pmt = PMT(rate, numberOfPeriods - i, balance);
      const ppmt = -PPMT(rate, 1, numberOfPeriods - i, balance);
      const ipmt = -IPMT(balance, pmt, rate, 1);
      let capitalPaid = ppmt;
      let interest = ipmt;

      // Gated behind `overpayment` so the default (no-overpayment) arithmetic
      // path stays exactly as it was — Formulas-test.tsx asserts exact floats.
      if (overpayment) {
        if (balance <= 0) {
          capitalPaid = 0;
          interest = 0;
        } else {
          let extra = Math.max(overpayment.monthly, 0);
          if (overpayment.lumpSum && overpayment.lumpSum.month === i + 1) {
            extra += Math.max(overpayment.lumpSum.amount, 0);
          }
          capitalPaid = Math.min(capitalPaid + extra, balance);
        }
      }

      const grossPaid = capitalPaid + interest;
      totalPaidGross += grossPaid;
      const deduction = (interest * taxDeduction) / 100;
      const netPaid = grossPaid - deduction;
      totalPaidNet += netPaid;
      accPaid += capitalPaid;

      if (overpayment && !paidOff && accPaid >= loan) {
        payoffMonth = i + 1;
        paidOff = true;
      }

      return {
        month: i + 1,
        balance,
        grossPaid,
        capitalPaid,
        interest,
        deduction,
        netPaid,
      };
    });

  return {
    monthly,
    totals: {
      totalPaidGross,
      totalPaidNet,
      totalInterestGross: totalPaidGross - loan,
      totalInterestNet: totalPaidNet - loan,
      totalInvestedGross: totalPaidGross + savings,
      totalInvestedNet: totalPaidNet + savings,
      payoffMonth,
    },
  };
}

export function calculateLinearData(
  loanInterest: number,
  taxDeduction: number,
  savings: number,
  loan: number,
  overpayment?: Overpayment,
): MortgageData {
  const capitalPaidBase = loan / 360;
  let totalPaidGross = 0;
  let totalPaidNet = 0;
  let accPaid = 0;
  let payoffMonth = 360;
  let paidOff = false;

  const monthly = Array(360)
    .fill(0)
    .map((v, i) => {
      // Gated behind `overpayment` so the default (no-overpayment) arithmetic
      // path stays exactly as it was — Formulas-test.tsx asserts exact floats.
      const balance = overpayment
        ? Math.max(loan - accPaid, 0)
        : loan - capitalPaidBase * i;
      let capitalPaid = capitalPaidBase;
      let interest = balance * (loanInterest / (12 * 100));

      if (overpayment) {
        if (balance <= 0) {
          capitalPaid = 0;
          interest = 0;
        } else {
          let extra = Math.max(overpayment.monthly, 0);
          if (overpayment.lumpSum && overpayment.lumpSum.month === i + 1) {
            extra += Math.max(overpayment.lumpSum.amount, 0);
          }
          capitalPaid = Math.min(capitalPaidBase + extra, balance);
        }
      }

      const grossPaid = capitalPaid + interest;
      const deduction = (interest * taxDeduction) / 100;
      const netPaid = grossPaid - deduction;
      totalPaidNet += netPaid;
      totalPaidGross += grossPaid;
      accPaid += capitalPaid;

      if (overpayment && !paidOff && accPaid >= loan) {
        payoffMonth = i + 1;
        paidOff = true;
      }

      return {
        month: i + 1,
        balance,
        grossPaid,
        capitalPaid,
        interest,
        deduction,
        netPaid,
      };
    });

  return {
    monthly,
    totals: {
      totalPaidGross,
      totalPaidNet,
      totalInterestGross: totalPaidGross - loan,
      totalInterestNet: totalPaidNet - loan,
      totalInvestedGross: totalPaidGross + savings,
      totalInvestedNet: totalPaidNet + savings,
      payoffMonth,
    },
  };
}

export function calgulateLoanFigures({
  price,
  notary,
  valuation,
  financialAdvisor,
  realStateAgent,
  structuralSurvey,
  savings,
}: AppState): {
  loan: number;
  cost: number;
  percentage: number;
} {
  const bankGuarantee = 0.001 * price;
  const transferTax = 0.02 * price;
  const nhgAvailable = isNhgEligible(price);

  let cost =
    bankGuarantee +
    transferTax +
    notary +
    valuation +
    financialAdvisor +
    realStateAgent +
    structuralSurvey;

  const loan = Math.max(
    (price - savings + cost) / (nhgAvailable ? 1 - NHG_FEE : 1),
    0,
  );

  cost = cost + nhgFee(price, loan);

  const percentage = price > 0 ? loan / price : 0;

  return { loan, cost, percentage };
}

// First month where cumulative buying cost (upfront purchase cost + net
// mortgage payments so far) drops at or below cumulative rent paid so far,
// or null if that never happens within the schedule.
export function calculateBreakEvenMonth(
  monthly: Array<MonthMortgageData>,
  purchaseCost: number,
  rent: number,
): number | null {
  let cumulativeBuy = purchaseCost;
  let cumulativeRent = 0;

  for (const month of monthly) {
    cumulativeBuy += month.netPaid;
    cumulativeRent += rent;
    if (cumulativeBuy <= cumulativeRent) {
      return month.month;
    }
  }

  return null;
}
