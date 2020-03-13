import React from 'react';
import { Table } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

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
    '1': '1.17',
    '55': '1.26',
    '60': '1.29',
    '65': '1.31',
    '70': '1.36',
    '75': '1.40',
    '80': '1.42',
    '85': '1.43',
    '90': '1.48',
    '95': '1.53',
    '100': '1.60',
  },
  {
    '0': '20',
    '1': '1.52',
    '55': '1.64',
    '60': '1.67',
    '65': '1.69',
    '70': '1.74',
    '75': '1.78',
    '80': '1.80',
    '85': '1.81',
    '90': '1.86',
    '95': '1.91',
    '100': '1.98',
  },
];

function TableNumber(props: { value: string; suffix: string | '€' }) {
  return (
    <td>
      <NumberFormat
        style={{ fontSize: '14px' }}
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
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          {intervals.map(interval => (
            <th key={interval}>{interval}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {interests.map((interest, i) => {
          return (
            <tr key={i}>
              {Object.values(interest).map((item, j) =>
                i > 0 ? (
                  <TableNumber key={j} value={item} suffix={'€'} />
                ) : (
                  <TableNumber key={j} value={item} suffix={' years'} />
                ),
              )}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
