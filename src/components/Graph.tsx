import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MonthMortgageData } from '../common/Types';

type GraphProps = {
  annuity: Array<MonthMortgageData>;
  linear: Array<MonthMortgageData>;
};

export function Graph(props: GraphProps) {
  const data = props.annuity.map((item, index) => {
    const linearItem = props.linear[index];
    return {
      month: item.month,
      annuityGross: item.grossPaid,
      annuityCapital: item.capitalPaid,
      annuityInterest: item.interest,
      linearGross: linearItem.grossPaid,
      linearCapital: linearItem.capitalPaid,
      linearInterest: linearItem.interest,
    };
  });

  const stroke1 = '#8884d8';
  const stroke2 = '#82ca9d';
  const stroke3 = '#ff7300';

  return (
    <div className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="month" />
          <YAxis unit="€" />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />

          {/* Annuity: solid lines */}
          <Line type="monotone" dataKey="annuityGross" name="Gross (A)" stroke={stroke1} dot={false} />
          <Line type="monotone" dataKey="annuityCapital" name="Capital (A)" stroke={stroke2} dot={false} />
          <Line type="monotone" dataKey="annuityInterest" name="Interest (A)" stroke={stroke3} dot={false} />

          {/* Linear: dashed lines, same color per metric so A/L pairs are still comparable */}
          <Line type="monotone" dataKey="linearGross" name="Gross (L)" stroke={stroke1} strokeDasharray="6 4" dot={false} />
          <Line type="monotone" dataKey="linearCapital" name="Capital (L)" stroke={stroke2} strokeDasharray="6 4" dot={false} />
          <Line type="monotone" dataKey="linearInterest" name="Interest (L)" stroke={stroke3} strokeDasharray="6 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
