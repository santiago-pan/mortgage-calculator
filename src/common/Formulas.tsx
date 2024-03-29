import { MortgageData } from './Types';
import { MAX_NHG, NHG_FEE } from '../components/Costs';
import { AppState } from '../App';

export function PMT(rate: number, nperiod: number, pv: number) {
  if (rate === 0) return -pv / nperiod;

  var pvif = Math.pow(1 + rate, nperiod);
  var pmt = (rate / (pvif - 1)) * -(pv * pvif);

  return pmt;
}

export function IPMT(pv: number, pmt: number, rate: number, per: number) {
  var tmp = Math.pow(1 + rate, per - 1);
  return 0 - (pv * tmp * rate + pmt * (tmp - 1));
}

export function PPMT(rate: number, per: number, nper: number, pv: number) {
  var pmt = PMT(rate, nper, pv);
  var ipmt = IPMT(pv, pmt, rate, per);
  return pmt - ipmt;
}

export function calculateAnnuityData(
  loanInterest: number,
  taxDeduction: number,
  savings: number,
  loan: number,
): MortgageData {
  const rate = loanInterest / (12 * 100);
  const numberOfPeriods = 360;

  let totalPaidGross = 0;
  let totalPaidNet = 0;
  let accPaid = 0;

  const payOff = 0;
  const payOffPeriod = 0;
  const monthly = Array(360)
    .fill(0)
    .map((v, i) => {
      //const period = i + 1;
      let balance = loan - accPaid;
      balance = Math.max(balance, 0);
      const pmt = PMT(rate, numberOfPeriods - i, balance);
      const ppmt = -PPMT(rate, 1, numberOfPeriods - i, balance);
      const ipmt = -IPMT(balance, pmt, rate, 1);
      let capitalPaid =
        ppmt + (i < payOffPeriod ? (balance > 0 ? payOff : 0) : 0);
      const interest = ipmt;
      const grossPaid = capitalPaid + interest;
      totalPaidGross += grossPaid;
      const deduction = (interest * taxDeduction) / 100;
      const netPaid = grossPaid - deduction;
      totalPaidNet += netPaid;
      accPaid += capitalPaid;

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
    },
  };
}

export function calculateLinearData(
  loanInterest: number,
  taxDeduction: number,
  savings: number,
  loan: number,
): MortgageData {
  const capitalPaid = loan / 360;
  let totalPaidGross = 0;
  let totalPaidNet = 0;
  const monthly = Array(360)
    .fill(0)
    .map((v, i) => {
      const balance = loan - capitalPaid * i;
      const interest = balance * (loanInterest / (12 * 100));
      const grossPaid = capitalPaid + interest;
      const deduction = (interest * taxDeduction) / 100;
      const netPaid = grossPaid - deduction;
      totalPaidNet += netPaid;
      totalPaidGross += grossPaid;
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
  const nhgAvailable = price > MAX_NHG ? false : true;

  let cost =
    bankGuarantee +
    transferTax +
    notary +
    valuation +
    financialAdvisor +
    realStateAgent +
    structuralSurvey;

  const loan = (price - savings + cost) / (nhgAvailable ? 1 - NHG_FEE : 1);

  cost = cost + (nhgAvailable ? NHG_FEE * loan : 0);

  const percentage = loan / price;

  return { loan, cost, percentage };
}
