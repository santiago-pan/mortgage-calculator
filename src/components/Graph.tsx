import React from 'react';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from 'recharts';
import { Data } from '../common/Types';

type GraphProps = {
  data: Array<Data>;
};

export function Graph(props: GraphProps) {
  return (
    <LineChart
      width={1000}
      height={400}
      data={props.data}
      margin={{ top: 50, right: 20, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="month" />
      <YAxis
        yAxisId={0}
        name="Gross Paid"
        scale="linear"
        orientation="left"
        unit="€"
      />
      <YAxis
        yAxisId={1}
        name="Gross Paid"
        scale="linear"
        orientation="right"
        unit="€"
      />
      <YAxis yAxisId={2} name="Capital Paid" scale="linear" hide />
      <YAxis yAxisId={3} name="Interest" scale="linear" hide />
      <YAxis yAxisId={4} name="Tax Return" scale="linear" hide />
      <YAxis yAxisId={5} name="Net Paid" scale="linear" hide />
      <Tooltip />
      <CartesianGrid stroke="#f5f5f5" />

      <Line
        type="natural"
        dataKey="balance"
        stroke="#ff7300"
        yAxisId={0}
        dot={false}
      />
      <Line
        type="step"
        dataKey="grossPaid"
        stroke="#ff0000"
        yAxisId={1}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="capitalPaid"
        stroke="#00ff00"
        yAxisId={2}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="interest"
        stroke="#0000ff"
        yAxisId={3}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="taxReturn"
        stroke="#2e2e2e"
        yAxisId={4}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="netPaid"
        stroke="#adadad"
        yAxisId={5}
        dot={false}
      />
    </LineChart>
  );
}
