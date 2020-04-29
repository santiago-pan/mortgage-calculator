import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import './App.css';
import { DataTable } from './components/DataTable';
import { Graph } from './components/Graph';
import { Interest } from './components/Interest';
import { Mortgage } from './components/Mortgage';
import { MAX_NHG, MortgageCosts, NHG_FEE } from './components/MortgageCosts';
import { IPMT, PMT, PPMT } from './Formulas';
import { Data } from './Types';

type State = {
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

function calculateAnnuityData(data: State, loan: number) {
  const rate = data.interest / (12 * 100);
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
      const taxReturn = (interest * data.taxReturn) / 100;
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

function calculateData(data: State, loan: number): Array<Data> {
  const capitalPaid = loan / 360;
  return Array(360)
    .fill(0)
    .map((v, i) => {
      const balance = loan - capitalPaid * i;
      const interest = balance * (data.interest / (12 * 100));
      const grossPaid = capitalPaid + interest;
      const remaining = balance - capitalPaid;
      const taxReturn = (interest * data.taxReturn) / 100;
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

const App = () => {
  const [state, setState] = useState<State>({
    price: 310000,
    interest: 1.34,
    taxReturn: 36.93,
    savings: 40000,

    notary: 1200,
    valuation: 800,
    financialAdvisor: 2500,
    realStateAgent: 3327,
    structuralSurvey: 800,
  });

  const { loan, cost, percentage } = calgulateLoanFigures();

  const data = calculateData({ ...state }, loan);
  const annuity = calculateAnnuityData({ ...state }, loan);

  function handleChange(field: string, value: number) {
    setState({ ...state, [field]: value });
  }

  function calgulateLoanFigures(): { loan: number; cost: number; percentage: number } {
    const bankGuarantee = 0.001 * state.price;
    const transferTax = 0.02 * state.price;
    const nhgAvailable = state.price > MAX_NHG ? false : true;

    const cost =
      bankGuarantee +
      transferTax +
      state.notary +
      state.valuation +
      state.financialAdvisor +
      state.realStateAgent +
      state.structuralSurvey;

    const loan =
      (state.price - state.savings + cost) / (nhgAvailable ? 1 - NHG_FEE : 1);

    const percentage = loan / state.price;

    return { loan, cost, percentage };
  }

  return (
    <>
      <Container>
        <Jumbotron fluid style={{ padding: '1rem 1rem' }}>
          <Container>
            <h1 className="header">Mortgage Calculator</h1>
            <p>Annuity and Linear mortgage calculator</p>
          </Container>
        </Jumbotron>

        <Row className="mb-3">
          <Col>
            <label className="mb-1">Mortage</label>
            <Tabs defaultActiveKey="mortgage" id="figures-tab">
              <Tab eventKey="mortgage" title="Mortgage">
                <Mortgage
                  price={state.price}
                  savings={state.savings}
                  loan={loan}
                  cost={cost}
                  interest={state.interest}
                  percentage={percentage}
                  onChange={handleChange}
                />
              </Tab>
              <Tab eventKey="cost" title="Cost">
                <MortgageCosts {...state} loan={loan} onChange={handleChange} />
              </Tab>
              <Tab eventKey="overview" title="Interest">
                <Interest />
              </Tab>
            </Tabs>
          </Col>
        </Row>

        <Row>
          <Col>
            <label className="mb-1">Mortage Structure</label>
            <Tabs defaultActiveKey="linear" id="graph-tab">
              <Tab eventKey="linear" title="Linear">
                <DataTable data={data} />
              </Tab>
              <Tab eventKey="annuity" title="Annuity">
                <DataTable data={annuity} />
              </Tab>
              <Tab eventKey="graph" title="Graph">
                <Graph data={data} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
