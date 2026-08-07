import {
  calculateAnnuityData,
  calgulateLoanFigures,
  calculateLinearData,
  calculateBreakEvenMonth,
} from '../Formulas';
import { AppState } from '../../App';

const state: AppState = {
  price: 310000,
  notary: 1200,
  valuation: 800,
  financialAdvisor: 2500,
  realStateAgent: 3000,
  structuralSurvey: 800,
  savings: 40000,
  interest: 1.34,
  deduction: 36.93,
  rent: 1300,
  costEnabled: {
    notary: true,
    valuation: true,
    financialAdvisor: true,
    realStateAgent: true,
    structuralSurvey: true,
  },
  overpaymentMonthly: 0,
  overpaymentLumpSumMonth: 0,
  overpaymentLumpSumAmount: 0,
};

it('calculates loan figures', () => {
  const figures = calgulateLoanFigures(state);

  expect(figures).toEqual({
    cost: 16529.175050301812,
    loan: 286529.1750503018,
    percentage: 0.9242876614525866,
  });
});

it('calculates annuity data', () => {
  const figures = calgulateLoanFigures(state);

  const annuityData = calculateAnnuityData(
    state.interest,
    state.deduction,
    state.savings,
    figures.loan,
  );

  expect(annuityData.monthly.length).toBe(360);

  // First month
  expect(annuityData.monthly[0]).toEqual({
    balance: 286529.1750503018,
    capitalPaid: 647.0637766049017,
    deduction: 118.16033385311871,
    grossPaid: 967.0213554110721,
    interest: 319.9575788061704,
    month: 1,
    netPaid: 848.8610215579534,
  });

  // 15 years
  expect(annuityData.monthly[179]).toEqual({
    balance: 158396.591597757,
    capitalPaid: 790.1451614602366,
    deduction: 65.32037842604102,
    grossPaid: 967.0213554110653,
    interest: 176.87619395082865,
    month: 180,
    netPaid: 901.7009769850243,
  });

  // 30 years
  expect(annuityData.monthly[359]).toEqual({
    balance: 965.9427193743177,
    capitalPaid: 965.942719374328,
    deduction: 0.398340288329178,
    grossPaid: 967.0213554109627,
    interest: 1.0786360366346548,
    month: 360,
    netPaid: 966.6230151226334,
  });

  expect(annuityData.totals).toEqual({
    totalInterestGross: 61598.51289767987,
    totalInterestNet: 38850.18208456715,
    totalInvestedGross: 388127.6879479817,
    totalInvestedNet: 365379.357134869,
    totalPaidGross: 348127.6879479817,
    totalPaidNet: 325379.357134869,
    payoffMonth: 360,
  });
});

it('calculates linear data', () => {
  const figures = calgulateLoanFigures(state);

  const linearData = calculateLinearData(
    state.interest,
    state.deduction,
    state.savings,
    figures.loan,
  );

  expect(linearData.monthly.length).toBe(360);

  // First month
  expect(linearData.monthly[0]).toEqual({
    balance: 286529.1750503018,
    capitalPaid: 795.9143751397273,
    deduction: 118.16033385311871,
    grossPaid: 1115.8719539458978,
    interest: 319.9575788061704,
    month: 1,
    netPaid: 997.7116200927791,
  });

  // 15 years
  expect(linearData.monthly[179]).toEqual({
    balance: 144060.50190029063,
    capitalPaid: 795.9143751397273,
    deduction: 59.408390076151356,
    grossPaid: 956.7819355950519,
    interest: 160.86756045532454,
    month: 180,
    netPaid: 897.3735455189005,
  });

  // 30 years
  expect(linearData.monthly[359]).toEqual({
    balance: 795.9143751396914,
    capitalPaid: 795.9143751397273,
    deduction: 0.3282231495919817,
    grossPaid: 796.8031461919667,
    interest: 0.8887710522393221,
    month: 360,
    netPaid: 796.4749230423747,
  });

  expect(linearData.totals).toEqual({
    totalInterestGross: 57752.342974515515,
    totalInterestNet: 36424.40271402575,
    totalInvestedGross: 384281.51802481734,
    totalInvestedNet: 362953.5777643276,
    totalPaidGross: 344281.51802481734,
    totalPaidNet: 322953.5777643276,
    payoffMonth: 360,
  });
});

it('calculates annuity data with overpayment (recurring + lump sum)', () => {
  const figures = calgulateLoanFigures(state);
  const overpayment = { monthly: 500, lumpSum: { month: 12, amount: 5000 } };

  const annuityData = calculateAnnuityData(
    state.interest,
    state.deduction,
    state.savings,
    figures.loan,
    overpayment,
  );

  expect(annuityData.totals.payoffMonth).toBe(296);
  expect(annuityData.totals).toEqual({
    totalPaidGross: 328740.5991177818,
    totalPaidNet: 313151.9202096612,
    totalInterestGross: 42211.424067479966,
    totalInterestNet: 26622.745159359358,
    totalInvestedGross: 368740.5991177818,
    totalInvestedNet: 353151.9202096612,
    payoffMonth: 296,
  });

  // Lump sum applied on month 12
  expect(annuityData.monthly[11].capitalPaid).toBeCloseTo(6142.3083856066405);

  // Balance stays at 0 (loan settled) past the payoff month
  expect(annuityData.monthly[359].balance).toBe(0);
  expect(annuityData.monthly[359].capitalPaid).toBe(0);
});

it('calculates linear data with overpayment (recurring + lump sum)', () => {
  const figures = calgulateLoanFigures(state);
  const overpayment = { monthly: 500, lumpSum: { month: 12, amount: 5000 } };

  const linearData = calculateLinearData(
    state.interest,
    state.deduction,
    state.savings,
    figures.loan,
    overpayment,
  );

  expect(linearData.totals.payoffMonth).toBe(218);
  expect(linearData.totals).toEqual({
    totalPaidGross: 320901.40053143,
    totalPaidNet: 308207.7376612497,
    totalInterestGross: 34372.225481128145,
    totalInterestNet: 21678.562610947876,
    totalInvestedGross: 360901.40053143,
    totalInvestedNet: 348207.7376612497,
    payoffMonth: 218,
  });

  expect(linearData.monthly[11].capitalPaid).toBeCloseTo(6295.914375139728);
  expect(linearData.monthly[359].balance).toBe(0);
  expect(linearData.monthly[359].capitalPaid).toBe(0);
});

it('calculates the break-even month vs. renting', () => {
  const figures = calgulateLoanFigures(state);
  const annuityData = calculateAnnuityData(
    state.interest,
    state.deduction,
    state.savings,
    figures.loan,
  );

  expect(
    calculateBreakEvenMonth(annuityData.monthly, figures.cost, state.rent),
  ).toBe(38);

  // Rent too low to ever beat the mortgage payment within the schedule.
  expect(
    calculateBreakEvenMonth(annuityData.monthly, figures.cost, 500),
  ).toBeNull();
});

it('calculates savings vs total invested curve', () => {
  for (let s = 0; s < 21; s++) {
    state.savings = 20000 + s * 1000;
    const figures = calgulateLoanFigures(state);
    calculateAnnuityData(
      state.interest,
      state.deduction,
      state.savings,
      figures.loan,
    );
  }
});
