import React, { useState } from 'react';
import {
  Container,
  Heading,
  Hero,
  Section,
  Tabs,
} from 'react-bulma-components';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import {
  calculateAnnuityData,
  calculateLinearData,
  calgulateLoanFigures,
} from './common/Formulas';
import { MortgageData } from './common/Types';
import { DataTable } from './components/DataTable';
import { Graph } from './components/Graph';
import { Interest } from './components/Interest';
import { Mortgage } from './components/Mortgage';
import { Costs } from './components/Costs';
import './App.sass';
import './index.css';

export type AppState = {
  // mortgage
  price: number;
  interest: number;
  taxReturn: number;
  savings: number;

  // costs
  notary: number;
  valuation: number;
  financialAdvisor: number;
  realStateAgent: number;
  structuralSurvey: number;
};

type InfoTabs = 'mortgage' | 'cost' | 'interest';
type TableTabs = 'annuity' | 'linear' | 'graph';

const App = () => {
  const [state, setState] = useState<AppState>({
    price: 310000,
    interest: 1.34,
    taxReturn: 36.93,
    savings: 40000,

    notary: 1200,
    valuation: 800,
    financialAdvisor: 2500,
    realStateAgent: 3000,
    structuralSurvey: 800,
  });

  const [tab, setTab] = useState<TableTabs>('annuity');
  const [infoTab, setInfoTab] = useState<InfoTabs>('mortgage');

  const { loan, cost, percentage } = calgulateLoanFigures(state);

  const linar = calculateLinearData(state.interest, state.taxReturn, loan);
  const annuity = calculateAnnuityData(state.interest, state.taxReturn, loan);

  function handleChange(field: string, value: number) {
    setState({ ...state, [field]: value });
  }

  return (
    <Container>
      <Section>
        <Hero color="primary">
          <Hero.Body>
            <Heading>Mortgage Calculator</Heading>
            <Heading subtitle>
              Annuity and Linear mortgage calculator for The Netherlands
            </Heading>
          </Hero.Body>
        </Hero>
      </Section>
      <Section>
        <Heading subtitle>Mortage</Heading>
        <Tabs color="primary">
          <Tabs.Tab
            color="primary"
            active={infoTab === 'mortgage'}
            onClick={() => setInfoTab('mortgage')}
          >
            Mortgage
          </Tabs.Tab>
          <Tabs.Tab
            active={infoTab === 'cost'}
            onClick={() => setInfoTab('cost')}
          >
            Purchase Costs
          </Tabs.Tab>
          <Tabs.Tab
            active={infoTab === 'interest'}
            onClick={() => setInfoTab('interest')}
          >
            Interest
          </Tabs.Tab>
        </Tabs>
        {renderInfoTabs(infoTab, state, loan, cost, percentage, handleChange)}
      </Section>
      <Section>
        <Heading subtitle>Mortage Structure</Heading>
        <Tabs>
          <Tabs.Tab
            active={tab === 'annuity'}
            onClick={() => setTab('annuity')}
          >
            Annuity
          </Tabs.Tab>
          <Tabs.Tab active={tab === 'linear'} onClick={() => setTab('linear')}>
            Linear
          </Tabs.Tab>
          {/* <Tabs.Tab active={tab === 'graph'} onClick={() => setTab('graph')}>
            Graph
          </Tabs.Tab> */}
        </Tabs>
        {renderMortgageTabs(tab, annuity, linar)}
      </Section>
    </Container>
  );
};

function renderInfoTabs(
  tab: InfoTabs,
  state: AppState,
  loan: number,
  cost: number,
  percentage: number,
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
  annuity: MortgageData[],
  linear: MortgageData[],
) {
  switch (tab) {
    case 'annuity':
      return <DataTable data={annuity} />;
    case 'linear':
      return <DataTable data={linear} />;
    case 'graph':
      return <Graph data={linear} />;
  }
}

export default App;
