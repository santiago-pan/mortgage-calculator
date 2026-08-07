import React, { useEffect, useState, useMemo } from 'react';
import {
  calculateAnnuityData,
  calculateLinearData,
  calgulateLoanFigures,
  calculateBreakEvenMonth,
} from './common/Formulas';
import { Overpayment as OverpaymentType } from './common/Types';
import { Costs } from './components/Costs';
import { DataTable } from './components/DataTable';
import { Graph } from './components/Graph';
import { Interest } from './components/Interest';
import { Mortgage } from './components/Mortgage';
import { Overpayment } from './components/Overpayment';
import { Tabs, TabPanel } from './components/Tabs';
import './index.css';

export type ToggleableCost =
  | 'notary'
  | 'valuation'
  | 'financialAdvisor'
  | 'realStateAgent'
  | 'structuralSurvey';

export type AppState = {
  // mortgage
  price: number;
  interest: number;
  deduction: number;
  savings: number;
  rent: number;

  // costs
  notary: number;
  valuation: number;
  financialAdvisor: number;
  realStateAgent: number;
  structuralSurvey: number;
  costEnabled: Record<ToggleableCost, boolean>;

  // overpayment simulator
  overpaymentMonthly: number;
  overpaymentLumpSumMonth: number;
  overpaymentLumpSumAmount: number;
};

type InfoTabs = 'mortgage' | 'cost' | 'interest' | 'overpayment';
type TableTabs = 'annuity' | 'linear' | 'graph';

const URL_SYNCED_FIELDS = [
  'price',
  'interest',
  'deduction',
  'savings',
  'rent',
  'overpaymentMonthly',
] as const;

function readNumberParam(
  params: URLSearchParams,
  key: string,
  fallback: number,
): number {
  const raw = params.get(key);
  if (raw === null) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

// Bounds for user-entered fields: without these, a negative price/savings/rate
// silently drives the loan and amortization schedule negative with no error.
const FIELD_BOUNDS: Partial<
  Record<keyof AppState, { min: number; max?: number }>
> = {
  price: { min: 0 },
  savings: { min: 0 },
  rent: { min: 0 },
  interest: { min: 0, max: 20 },
  deduction: { min: 0, max: 100 },
  notary: { min: 0 },
  valuation: { min: 0 },
  financialAdvisor: { min: 0 },
  realStateAgent: { min: 0 },
  structuralSurvey: { min: 0 },
  overpaymentMonthly: { min: 0 },
  overpaymentLumpSumMonth: { min: 0, max: 360 },
  overpaymentLumpSumAmount: { min: 0 },
};

function clampField(field: string, value: number): number {
  if (Number.isNaN(value)) return 0;
  const bounds = FIELD_BOUNDS[field as keyof AppState];
  if (!bounds) return value;
  let clamped = Math.max(value, bounds.min);
  if (bounds.max !== undefined) clamped = Math.min(clamped, bounds.max);
  return clamped;
}

const App = () => {
  const [state, setState] = useState<AppState>(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      price: readNumberParam(params, 'price', 310000),
      interest: readNumberParam(params, 'interest', 4.62),
      deduction: readNumberParam(params, 'deduction', 36.93),
      savings: readNumberParam(params, 'savings', 40000),
      rent: readNumberParam(params, 'rent', 1600),
      overpaymentMonthly: readNumberParam(params, 'overpaymentMonthly', 0),
      overpaymentLumpSumMonth: 0,
      overpaymentLumpSumAmount: 0,

      notary: 1200,
      valuation: 800,
      financialAdvisor: 2500,
      realStateAgent: 2750 * 1.21,
      structuralSurvey: 800,
      costEnabled: {
        notary: true,
        valuation: true,
        financialAdvisor: true,
        realStateAgent: true,
        structuralSurvey: true,
      },
    };
  });

  const [tab, setTab] = useState<TableTabs>('annuity');
  const [infoTab, setInfoTab] = useState<InfoTabs>('mortgage');
  const [linkCopied, setLinkCopied] = useState(false);

  // Costs a buyer opted out of shouldn't count toward the loan/total —
  // zero them out before the calculation instead of teaching Formulas.tsx
  // about toggles, keeping the calculation engine pure and its tests untouched.
  const effectiveState = useMemo(
    () => ({
      ...state,
      notary: state.costEnabled.notary ? state.notary : 0,
      valuation: state.costEnabled.valuation ? state.valuation : 0,
      financialAdvisor: state.costEnabled.financialAdvisor
        ? state.financialAdvisor
        : 0,
      realStateAgent: state.costEnabled.realStateAgent
        ? state.realStateAgent
        : 0,
      structuralSurvey: state.costEnabled.structuralSurvey
        ? state.structuralSurvey
        : 0,
    }),
    [state],
  );

  const { loan, cost, percentage } = useMemo(
    () => calgulateLoanFigures(effectiveState),
    [effectiveState],
  );

  // undefined (not a zeroed object) when there's nothing to apply, so the
  // main schedule keeps using the plain, pre-overpayment calculation path.
  const overpayment: OverpaymentType | undefined = useMemo(() => {
    const hasMonthly = state.overpaymentMonthly > 0;
    const hasLumpSum =
      state.overpaymentLumpSumAmount > 0 && state.overpaymentLumpSumMonth > 0;
    if (!hasMonthly && !hasLumpSum) return undefined;
    return {
      monthly: state.overpaymentMonthly,
      lumpSum: hasLumpSum
        ? {
            month: state.overpaymentLumpSumMonth,
            amount: state.overpaymentLumpSumAmount,
          }
        : undefined,
    };
  }, [
    state.overpaymentMonthly,
    state.overpaymentLumpSumMonth,
    state.overpaymentLumpSumAmount,
  ]);

  const linear = useMemo(
    () =>
      calculateLinearData(
        state.interest,
        state.deduction,
        state.savings,
        loan,
        overpayment,
      ),
    [state.interest, state.deduction, state.savings, loan, overpayment],
  );

  const annuity = useMemo(
    () =>
      calculateAnnuityData(
        state.interest,
        state.deduction,
        state.savings,
        loan,
        overpayment,
      ),
    [state.interest, state.deduction, state.savings, loan, overpayment],
  );

  // Baseline (no overpayment) schedules, kept only to power the "interest
  // saved" comparison on the Overpayment tab.
  const linearBaseline = useMemo(
    () =>
      calculateLinearData(state.interest, state.deduction, state.savings, loan),
    [state.interest, state.deduction, state.savings, loan],
  );

  const annuityBaseline = useMemo(
    () =>
      calculateAnnuityData(
        state.interest,
        state.deduction,
        state.savings,
        loan,
      ),
    [state.interest, state.deduction, state.savings, loan],
  );

  const annuityBreakEvenMonth = useMemo(
    () => calculateBreakEvenMonth(annuity.monthly, cost, state.rent),
    [annuity.monthly, cost, state.rent],
  );

  const linearBreakEvenMonth = useMemo(
    () => calculateBreakEvenMonth(linear.monthly, cost, state.rent),
    [linear.monthly, cost, state.rent],
  );

  function handleChange(field: string, value: number) {
    setState((prev) => ({ ...prev, [field]: clampField(field, value) }));
  }

  function handleToggleCost(field: ToggleableCost, enabled: boolean) {
    setState((prev) => ({
      ...prev,
      costEnabled: { ...prev.costEnabled, [field]: enabled },
    }));
  }

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  useEffect(() => {
    const params = new URLSearchParams();
    URL_SYNCED_FIELDS.forEach((field) =>
      params.set(field, String(state[field])),
    );
    const search = '?' + params.toString();
    // replaceState (not pushState) so editing fields doesn't spam browser history.
    if (window.location.search !== search) {
      window.history.replaceState(null, '', search);
    }
  }, [state]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <header className="mb-6 flex flex-col gap-4 rounded-lg bg-brand-400 px-6 py-8 text-white shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Mortgage Calculator</h1>
          <p className="mt-1 text-brand-100">
            Annuity and Linear mortgage calculator for the Netherlands
          </p>
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-md border border-white/30 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
        >
          {linkCopied ? 'Copied!' : 'Share this scenario'}
        </button>
      </header>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold text-brand-500">Mortgage</h2>
        <Tabs
          label="Mortgage sections"
          active={infoTab}
          onChange={setInfoTab}
          tabs={[
            { value: 'mortgage', label: 'Mortgage' },
            { value: 'cost', label: 'Purchase Costs' },
            { value: 'interest', label: 'Interest' },
            { value: 'overpayment', label: 'Overpayment' },
          ]}
        />
        <div className="mt-4">
          <TabPanel value="mortgage" active={infoTab}>
            <Mortgage
              price={state.price}
              savings={state.savings}
              loan={loan}
              cost={cost}
              interest={state.interest}
              percentage={percentage}
              deduction={state.deduction}
              rent={state.rent}
              annuity={annuity.totals}
              linear={linear.totals}
              annuityBreakEvenMonth={annuityBreakEvenMonth}
              linearBreakEvenMonth={linearBreakEvenMonth}
              onChange={handleChange}
            />
          </TabPanel>
          <TabPanel value="cost" active={infoTab}>
            <Costs
              {...state}
              loan={loan}
              onChange={handleChange}
              onToggle={handleToggleCost}
            />
          </TabPanel>
          <TabPanel value="interest" active={infoTab}>
            <Interest
              onSelectRate={(rate) => {
                handleChange('interest', rate);
                setInfoTab('mortgage');
              }}
            />
          </TabPanel>
          <TabPanel value="overpayment" active={infoTab}>
            <Overpayment
              monthly={state.overpaymentMonthly}
              lumpSumMonth={state.overpaymentLumpSumMonth}
              lumpSumAmount={state.overpaymentLumpSumAmount}
              onChange={handleChange}
              annuity={annuity.totals}
              annuityBaseline={annuityBaseline.totals}
              linear={linear.totals}
              linearBaseline={linearBaseline.totals}
            />
          </TabPanel>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold text-brand-500">
          Mortgage Structure
        </h2>
        <Tabs
          label="Mortgage structure views"
          active={tab}
          onChange={setTab}
          tabs={[
            { value: 'annuity', label: 'Annuity' },
            { value: 'linear', label: 'Linear' },
            { value: 'graph', label: 'Graph' },
          ]}
        />
        <div className="mt-4">
          <TabPanel value="annuity" active={tab}>
            <DataTable data={annuity.monthly} />
          </TabPanel>
          <TabPanel value="linear" active={tab}>
            <DataTable data={linear.monthly} />
          </TabPanel>
          <TabPanel value="graph" active={tab}>
            <Graph annuity={annuity.monthly} linear={linear.monthly} />
          </TabPanel>
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-brand-100 bg-white p-4 text-sm text-brand-400 shadow-sm">
        <h3 className="mb-1 font-semibold text-brand-500">Disclaimer</h3>
        <p>This calculator is for illustrative purposes only.</p>
        <p>No guarantee is made for the accuracy of the data provided.</p>
        <p>Consult a qualified professional before making any decision.</p>
      </section>

      <footer>
        <a
          href="https://github.com/santiago-pan/mortgage-calculator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-brand-200 px-3 py-1.5 text-sm text-brand-500 transition-colors hover:border-brand-300 hover:text-brand-600"
        >
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOS45OTkgMGMtNS41MjEgMC05Ljk5OSA0LjU5LTkuOTk5IDEwLjI1MyAwIDQuNTMgMi44NjUgOC4zNzMgNi44MzkgOS43MjguNS4wOTQuNjgzLS4yMjIuNjgzLS40OTRsLS4wMTQtMS43NDRjLTIuNzgyLjYxOS0zLjM2OC0xLjM3NS0zLjM2OC0xLjM3NS0uNDU1LTEuMTg1LTEuMTExLTEuNS0xLjExMS0xLjUtLjkwOC0uNjM2LjA2OS0uNjIzLjA2OS0uNjIzIDEuMDA0LjA3MiAxLjUzMiAxLjA1NyAxLjUzMiAxLjA1Ny44OTIgMS41NjcgMi4zNDEgMS4xMTQgMi45MS44NTIuMDkxLS42NjIuMzQ5LTEuMTE0LjYzNS0xLjM3LTIuMjItLjI1OS00LjU1NS0xLjEzOS00LjU1NS01LjA2OCAwLTEuMTE5LjM5LTIuMDM1IDEuMDI5LTIuNzUxLS4xMDMtLjI1OS0uNDQ2LTEuMzAyLjA5OC0yLjcxMyAwIDAgLjgzOS0uMjc2IDIuNzUgMS4wNTEuNzk3LS4yMjggMS42NTMtLjM0MSAyLjUwMy0uMzQ2Ljg1LjAwNCAxLjcwNS4xMTggMi41MDMuMzQ2IDEuOTA5LTEuMzI3IDIuNzQ3LTEuMDUxIDIuNzQ3LTEuMDUxLjU0NiAxLjQxMS4yMDMgMi40NTQuMSAyLjcxMy42NDEuNzE2IDEuMDI4IDEuNjMyIDEuMDI4IDIuNzUxIDAgMy45MzktMi4zMzggNC44MDYtNC41NjYgNS4wNTkuMzU5LjMxNy42NzguOTQyLjY3OCAxLjg5OCAwIDEuMzcxLS4wMTIgMi40NzctLjAxMiAyLjgxMyAwIC4yNzQuMTguNTk0LjY4OC40OTMgMy45NzEtMS4zNTkgNi44MzMtNS4xOTkgNi44MzMtOS43MjggMC01LjY2My00LjQ3OC0xMC4yNTMtMTAuMDAxLTEwLjI1MyIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K"
            alt=""
            className="h-4 w-4 opacity-60"
          />
          Github
        </a>
      </footer>
    </div>
  );
};

export default App;
