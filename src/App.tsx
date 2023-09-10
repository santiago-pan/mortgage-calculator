import queryString from 'query-string';
import React, { useEffect, useState, useMemo } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './App.sass';
import {
  calculateAnnuityData,
  calculateLinearData,
  calgulateLoanFigures,
} from './common/Formulas';
import { MonthMortgageData } from './common/Types';
import { Costs } from './components/Costs';
import { DataTable } from './components/DataTable';
import { Graph } from './components/Graph';
import { Interest } from './components/Interest';
import { Mortgage } from './components/Mortgage';
import './index.css';

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
};

type InfoTabs = 'mortgage' | 'cost' | 'interest';
type TableTabs = 'annuity' | 'linear' | 'graph';

const App = (props: RouteComponentProps) => {
  const search = queryString.parse(props.location.search, {
    parseNumbers: true,
  });

  const [state, setState] = useState<AppState>({
    price: (search.price as number) || 310000,
    interest: (search.interest as number) || 4.62,
    deduction: (search.deduction as number) || 36.93,
    savings: (search.savings as number) || 40000,
    rent: (search.rent as number) || 1600,

    notary: 1200,
    valuation: 800,
    financialAdvisor: 2500,
    realStateAgent: 2750*1.21,
    structuralSurvey: 800,
  });

  const [tab, setTab] = useState<TableTabs>('annuity');
  const [infoTab, setInfoTab] = useState<InfoTabs>('mortgage');

  const { loan, cost, percentage } = calgulateLoanFigures(state);

  const linear = useMemo(
    () =>
      calculateLinearData(state.interest, state.deduction, state.savings, loan),
    [state.interest, state.deduction, state.savings, loan],
  );

  const annuity = useMemo(
    () =>
      calculateAnnuityData(
        state.interest,
        state.deduction,
        state.savings,
        loan,
      ),
    [state.interest, state.deduction, state.savings, loan],
  );

  function handleChange(field: string, value: number) {
    setState({ ...state, [field]: value });
  }

  useEffect(() => {
    const stateQueryString = queryString.stringify({
      price: state.price,
      interest: state.interest,
      deduction: state.deduction,
      savings: state.savings,
      rent: state.rent
    });

    if (props.location.search !== '?' + stateQueryString) {
      props.history.push({ search: '?' + stateQueryString });
    }
  }, [state, props.history, props.location.search]);

  return (
    <div className="container">
      <section className="section">
        <section className="hero is-primary">
          <div className="hero-body">
            <h1 className="title">Mortgage Calculator</h1>
            <h2 className="subtitle">
              Annuity and Linear mortgage calculator for the Netherlands
            </h2>
          </div>
        </section>
      </section>
      <section className="section">
        <h1 className="subtitle">Mortgage</h1>
        <div className="tabs is-primary">
          <ul>
            <li className={infoTab === 'mortgage' ? 'is-active' : ''}>
              {/* eslint-disable-next-line */}
              <a onClick={() => setInfoTab('mortgage')} role="button">
                Mortgage
              </a>
            </li>
            <li className={infoTab === 'cost' ? 'is-active' : ''}>
              {/* eslint-disable-next-line */}
              <a onClick={() => setInfoTab('cost')} role="button">
                Purchase Costs
              </a>
            </li>
            <li className={infoTab === 'interest' ? 'is-active' : ''}>
              {/* eslint-disable-next-line */}
              <a onClick={() => setInfoTab('interest')} role="button">
                Interest
              </a>
            </li>
          </ul>
        </div>
        {renderInfoTabs(
          infoTab,
          state,
          loan,
          cost,
          percentage,
          annuity.totals,
          linear.totals,
          handleChange,
        )}
      </section>
      <section className="section">
        <h1 className="subtitle">Mortgage Structure</h1>
        <div className="tabs is-primary">
          <ul>
            <li
              className={tab === 'annuity' ? 'is-active' : ''}
              onClick={() => setTab('annuity')}
            >
              {/* eslint-disable-next-line */}
              <a>Annuity</a>
            </li>
            <li
              className={tab === 'linear' ? 'is-active' : ''}
              onClick={() => setTab('linear')}
            >
              {/* eslint-disable-next-line */}
              <a>Linear</a>
            </li>
            <li
              className={tab === 'graph' ? 'is-active' : ''}
              onClick={() => setTab('graph')}
            >
              {/* eslint-disable-next-line */}
              <a>Graph</a>
            </li>
          </ul>
        </div>
        {renderMortgageTabs(tab, annuity.monthly, linear.monthly)}
      </section>
      <section className="section disclaimer">
        <h3>Disclaimer:</h3>
        <p>This calculator is for illustrative purposes only.</p>
        <p>No guarantee is made for the accuracy of the data provided.</p>
        <p>Consult a qualified professional before making any decision.</p>
      </section>
      <section className="section">
        {/* eslint-disable-next-line */}
        <a
          href="https://github.com/santiago-pan/mortgage-calculator"
          className="github-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOS45OTkgMGMtNS41MjEgMC05Ljk5OSA0LjU5LTkuOTk5IDEwLjI1MyAwIDQuNTMgMi44NjUgOC4zNzMgNi44MzkgOS43MjguNS4wOTQuNjgzLS4yMjIuNjgzLS40OTRsLS4wMTQtMS43NDRjLTIuNzgyLjYxOS0zLjM2OC0xLjM3NS0zLjM2OC0xLjM3NS0uNDU1LTEuMTg1LTEuMTExLTEuNS0xLjExMS0xLjUtLjkwOC0uNjM2LjA2OS0uNjIzLjA2OS0uNjIzIDEuMDA0LjA3MiAxLjUzMiAxLjA1NyAxLjUzMiAxLjA1Ny44OTIgMS41NjcgMi4zNDEgMS4xMTQgMi45MS44NTIuMDkxLS42NjIuMzQ5LTEuMTE0LjYzNS0xLjM3LTIuMjItLjI1OS00LjU1NS0xLjEzOS00LjU1NS01LjA2OCAwLTEuMTE5LjM5LTIuMDM1IDEuMDI5LTIuNzUxLS4xMDMtLjI1OS0uNDQ2LTEuMzAyLjA5OC0yLjcxMyAwIDAgLjgzOS0uMjc2IDIuNzUgMS4wNTEuNzk3LS4yMjggMS42NTMtLjM0MSAyLjUwMy0uMzQ2Ljg1LjAwNCAxLjcwNS4xMTggMi41MDMuMzQ2IDEuOTA5LTEuMzI3IDIuNzQ3LTEuMDUxIDIuNzQ3LTEuMDUxLjU0NiAxLjQxMS4yMDMgMi40NTQuMSAyLjcxMy42NDEuNzE2IDEuMDI4IDEuNjMyIDEuMDI4IDIuNzUxIDAgMy45MzktMi4zMzggNC44MDYtNC41NjYgNS4wNTkuMzU5LjMxNy42NzguOTQyLjY3OCAxLjg5OCAwIDEuMzcxLS4wMTIgMi40NzctLjAxMiAyLjgxMyAwIC4yNzQuMTguNTk0LjY4OC40OTMgMy45NzEtMS4zNTkgNi44MzMtNS4xOTkgNi44MzMtOS43MjggMC01LjY2My00LjQ3OC0xMC4yNTMtMTAuMDAxLTEwLjI1MyIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K"
            alt=""
            className="github-inner"
          />
          Github
        </a>
      </section>
    </div>
  );
};

function renderInfoTabs(
  tab: InfoTabs,
  state: AppState,
  loan: number,
  cost: number,
  percentage: number,
  annuity: {
    totalPaidGross: number;
    totalPaidNet: number;
    totalInterestGross: number;
    totalInterestNet: number;
    totalInvestedGross: number;
    totalInvestedNet: number;
  },
  linear: {
    totalPaidGross: number;
    totalPaidNet: number;
    totalInterestGross: number;
    totalInterestNet: number;
    totalInvestedGross: number;
    totalInvestedNet: number;
  },
  handleChange: (field: string, value: number) => void,
) {
  switch (tab) {
    case 'mortgage':
      return (
        <Mortgage
          price={state.price}
          savings={state.savings}
          loan={loan}
          cost={cost}
          interest={state.interest}
          percentage={percentage}
          deduction={state.deduction}
          rent={state.rent}
          annuity={annuity}
          linear={linear}
          onChange={handleChange}
        />
      );
    case 'cost':
      return <Costs {...state} loan={loan} onChange={handleChange} />;
    case 'interest':
      return <Interest />;
  }
}

function renderMortgageTabs(
  tab: TableTabs,
  annuity: Array<MonthMortgageData>,
  linear: Array<MonthMortgageData>,
) {
  switch (tab) {
    case 'annuity':
      return <DataTable data={annuity} />;
    case 'linear':
      return <DataTable data={linear} />;
    case 'graph':
      return <Graph annuity={annuity} linear={linear} />;
  }
}

export default withRouter(App);
