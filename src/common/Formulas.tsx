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
  int: number,
  tax: number,
  loan: number,
): Array<MortgageData> {
  const rate = int / (12 * 100);
  const numberOfPeriods = 360;
  const pmt = PMT(rate, numberOfPeriods, loan);

  let totalPaid = 0;

  return Array(360)
    .fill(0)
    .map((v, i) => {
      const period = i + 1;
      const ppmt = -PPMT(rate, period, numberOfPeriods, loan);
      const ipmt = -IPMT(loan, pmt, rate, period);

      let capitalPaid = ppmt;
      const interest = ipmt;
      const grossPaid = capitalPaid + interest;
      const balance = loan - totalPaid;
      totalPaid += capitalPaid;
      const taxReturn = (interest * tax) / 100;
      const netPaid = grossPaid - taxReturn;
      const remaining = Math.round((balance - capitalPaid) * 100) / 100;

      return {
        month: i + 1,
        balance,
        grossPaid,
        capitalPaid,
        interest,
        remaining,
        taxReturn,
        netPaid,
      };
    });
}

export function calculateLinearData(
  int: number,
  tax: number,
  loan: number,
): Array<MortgageData> {
  const capitalPaid = loan / 360;
  return Array(360)
    .fill(0)
    .map((v, i) => {
      const balance = loan - capitalPaid * i;
      const interest = balance * (int / (12 * 100));
      const grossPaid = capitalPaid + interest;
      const remaining = balance - capitalPaid;
      const taxReturn = (interest * tax) / 100;
      const netPaid = grossPaid - taxReturn;
      return {
        month: i + 1,
        balance,
        grossPaid,
        capitalPaid,
        interest,
        remaining,
        taxReturn,
        netPaid,
      };
    });
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

  const cost =
    bankGuarantee +
    transferTax +
    notary +
    valuation +
    financialAdvisor +
    realStateAgent +
    structuralSurvey;

  const loan = (price - savings + cost) / (nhgAvailable ? 1 - NHG_FEE : 1);

  const percentage = loan / price;

  return { loan, cost, percentage };
}
