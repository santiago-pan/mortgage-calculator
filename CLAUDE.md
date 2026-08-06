# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A React + TypeScript single-page app that calculates and compares Annuity vs. Linear mortgage repayment plans for home purchases in the Netherlands, including Dutch-specific purchase costs (transfer tax, NHG guarantee, notary, etc.) and a rent-vs-buy comparison. Bootstrapped with Create React App. Live at https://whathemortgage.com/.

## Commands

Despite the README mentioning `yarn`, this repo has a `package-lock.json` and no `yarn.lock` — use `npm`.

- `npm start` — run the dev server
- `npm run build` — production build to `build/`
- `npm test` — run tests in watch mode (Jest via react-scripts + React Testing Library)
  - Single test file: `npm test -- Formulas-test` (matches `src/common/__tests__/Formulas-test.tsx`)
  - `npm test -- --watchAll=false` for a single non-interactive run
- `npm run deploy` — build, then sync `build/` to the `whathemortgage.com` S3 bucket and invalidate CloudFront (requires the `santiago` AWS CLI profile — do not run without explicit confirmation, it publishes to production)

## Architecture

**State lives in one place.** `src/App.tsx` owns a single `AppState` object (price, interest, deduction, savings, rent, and the individual purchase-cost fields) via `useState`, and passes values/`handleChange` down as props. There is no Redux/Context — all derived data (`loan`, `cost`, `percentage`, and the two `MortgageData` results) is recomputed in `App` with `useMemo`/plain calls and threaded down. When adding a new input, it goes into `AppState` in `App.tsx` and is passed through explicitly.

**URL is the persistence layer.** `App.tsx` syncs `price`, `interest`, `deduction`, `savings`, `rent` to the router's query string on every state change (via `query-string` + `react-router-dom`'s `withRouter`), and reads them back out on load. This is how inputs get shared/bookmarked — there is no other storage. Note only those 5 fields round-trip through the URL; the cost fields (notary, valuation, etc.) reset to defaults on reload.

**Calculation engine is pure and decoupled from React**: `src/common/Formulas.tsx` implements the financial math from scratch:
- `PMT`/`IPMT`/`PPMT` — standard amortization primitives.
- `calculateAnnuityData` / `calculateLinearData` — each generates a 360-month (`MonthMortgageData[]`) schedule plus aggregate `totals`, applying the Dutch mortgage-interest tax deduction (`taxDeduction` %) to get gross vs. net figures.
- `calgulateLoanFigures` — derives the required loan, total purchase cost, and loan-to-value `percentage` from `AppState`, including the NHG mortgage-guarantee fee (`MAX_NHG`/`NHG_FEE`, defined in `components/Costs.tsx` and imported back into `Formulas.tsx`).

These functions are covered by `src/common/__tests__/Formulas-test.tsx` with exact expected numeric outputs — treat that file as the spec when changing the math.

**Component split** (`src/components/`): `Mortgage.tsx` (main inputs/results + rent comparison), `Costs.tsx` (editable/derived purchase costs, owns the `MAX_NHG`/`NHG_FEE` constants), `Interest.tsx` (static rate reference table + external links), `DataTable.tsx` (renders a `MonthMortgageData[]` schedule), `Graph.tsx` (Recharts line chart of both schedules), `InputField.tsx` (shared numeric input using `react-number-format`). `App.tsx` switches between these via two independent tab groups (`InfoTabs`: mortgage/cost/interest; `TableTabs`: annuity/linear/graph).

Styling is Bulma (`bulma` package) + a single `App.sass`; no CSS-in-JS or component-scoped styles.
