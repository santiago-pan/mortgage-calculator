import React from 'react';
import { NumericFormat } from 'react-number-format';
import { MonthMortgageData } from '../common/Types';

type TableProps = {
  data: Array<MonthMortgageData>;
};

function TableNumber(props: { value: number }) {
  return (
    <td className="px-3 py-1.5 text-right tabular-nums">
      <NumericFormat
        value={props.value}
        displayType="text"
        thousandSeparator
        decimalScale={2}
        fixedDecimalScale
        suffix="€"
      />
    </td>
  );
}

export function DataTable(props: TableProps) {
  return (
    <div className="max-h-[32rem] overflow-auto rounded-lg border border-brand-100 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-white shadow-[0_1px_0_var(--color-brand-100)]">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-brand-400">#</th>
            <th className="px-3 py-2 text-right font-medium text-brand-400">Balance</th>
            <th className="px-3 py-2 text-right font-medium text-brand-400">Gross</th>
            <th className="px-3 py-2 text-right font-medium text-brand-400">Capital</th>
            <th className="px-3 py-2 text-right font-medium text-brand-400">Interest</th>
            <th className="px-3 py-2 text-right font-medium text-brand-400">Tax Return</th>
            <th className="px-3 py-2 text-right font-medium text-brand-400">Net</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, i) => (
            <tr key={i} className="odd:bg-brand-50/50">
              <td className="px-3 py-1.5 text-left text-brand-400">{i + 1}</td>
              <TableNumber value={item.balance} />
              <TableNumber value={item.grossPaid} />
              <TableNumber value={item.capitalPaid} />
              <TableNumber value={item.interest} />
              <TableNumber value={item.deduction} />
              <TableNumber value={item.netPaid} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
