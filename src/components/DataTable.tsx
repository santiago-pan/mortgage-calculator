import React from 'react';
import NumberFormat from 'react-number-format';
import { MonthMortgageData } from '../common/Types';

type TableProps = {
  data: Array<MonthMortgageData>;
};

function TableNumber(props: { value: number }) {
  return (
    <td style={{ width: '200px' }}>
      <NumberFormat
        value={props.value}
        displayType={'text'}
        thousandSeparator={true}
        suffix={'€'}
        decimalScale={2}
      />
    </td>
  );
}

export function DataTable(props: TableProps) {
  return (
    <div className="table-container">
      <table className="table is-striped is-narrow" >
        <thead>
          <tr>
            <th>#</th>
            <th>Balance</th>
            <th>Gross</th>
            <th>Capital</th>
            <th>Interest</th>
            <th>Tax Return</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, i) => {
            return (
              <tr key={i}>
                <td style={{ width: '40px' }}>{i + 1}</td>
                <TableNumber value={item.balance} />
                <TableNumber value={item.grossPaid} />
                <TableNumber value={item.capitalPaid} />
                <TableNumber value={item.interest} />
                <TableNumber value={item.deduction} />
                <TableNumber value={item.netPaid} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}