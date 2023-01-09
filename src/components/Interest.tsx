import React from 'react';
import { NumericFormat } from 'react-number-format';

const intervals = [
  'Fix rate',
  'NHG',
  '≤55%',
  '≤60%',
  '≤65%',
  '≤70%',
  '≤75%',
  '≤80%',
  '≤85%',
  '≤90%',
  '≤95%',
  '≤100%',
];

export const interests = [
  {
    '0': '10',
    '1': '1.34',
    '55': '1.46',
    '60': '1.49',
    '65': '1.51',
    '70': '1.56',
    '75': '1.60',
    '80': '1.62',
    '85': '1.63',
    '90': '1.68',
    '95': '1.73',
    '100': '1.80',
  },
  {
    '0': '20',
    '1': '1.79',
    '55': '1.91',
    '60': '1.94',
    '65': '1.96',
    '70': '2.01',
    '75': '2.05',
    '80': '2.07',
    '85': '2.08',
    '90': '2.13',
    '95': '2.18',
    '100': '2.25',
  },
];

function TableNumber(props: { value: string; suffix: string | '€' }) {
  return (
    <td>
      <NumericFormat
        value={props.value}
        displayType={'text'}
        thousandSeparator={true}
        suffix={props.suffix}
        decimalScale={2}
      />
    </td>
  );
}

export function Interest() {
  return (
    <>
      <div className="container">
        <h1 className="subtitle">Reference Interests</h1>
        <div className="table-container">
          <table className="table is-striped is-bordered is-narrow">
            <thead>
              <tr>
                {intervals.map((interval) => {
                  return interval === 'NHG' ? (
                    <th key={interval}>
                      <a
                        href="https://www.nhg.nl/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        NHG
                      </a>
                    </th>
                  ) : (
                    <th key={interval}>{interval}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {interests.map((interest, i) => {
                return (
                  <tr key={i}>
                    {Object.values(interest).map((item, j) =>
                      j > 0 ? (
                        <TableNumber key={j} value={item} suffix={'%'} />
                      ) : (
                        <TableNumber key={j} value={item} suffix={' years'} />
                      ),
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <div className="container">
        <h1 className="subtitle">Interest Rates Sources</h1>
        <table className="table is-bordered">
          <tbody>
            <tr>
              <td>
                <a
                  href="https://www.ikbenfrits.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Compare mortgage rates
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <a
                  href="https://www.ing.nl/particulier/hypotheken/actuele-hypotheekrente/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ING
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <a
                  href="https://www.rabobank.nl/particulieren/hypotheek/hypotheekrente/rente-annuiteitenhypotheek-en-lineaire-hypotheek/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rabobank
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <a
                  href="https://www.abnamro.nl/nl/prive/hypotheken/actuele-hypotheekrente/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ABN-AMRO
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
