import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MortgageData } from '../common/Types';

type GraphProps = {
  annuity: Array<MortgageData>;
  linear: Array<MortgageData>;
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
    <LineChart
      width={800}
      height={400}
      data={data}
      margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
    >
      <XAxis dataKey="month" />
      <YAxis unit="€" />
      <Tooltip />
      <Legend />
      <CartesianGrid strokeDasharray="3 3" />

      <Line
        type="monotone"
        dataKey="annuityGross"
        name="Gross (A)"
        stroke={stroke1}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="annuityCapital"
        name="Capital (A)"
        stroke={stroke2}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="annuityInterest"
        name="Interest (A)"
        stroke={stroke3}
        dot={false}
      />

      <Line
        type="monotone"
        dataKey="linearGross"
        name="Gross (L)"
        stroke={stroke1}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="linearCapital"
        name="Capital (L)"
        stroke={stroke2}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="linearInterest"
        name="Interest (L)"
        stroke={stroke3}
        dot={false}
      />
    </LineChart>
  );
}
