import React from 'react';
import { InputField } from './InputField';
import { Card } from './Card';

type Totals = {
  totalPaidGross: number;
  totalPaidNet: number;
  totalInterestGross: number;
  totalInterestNet: number;
  totalInvestedGross: number;
  totalInvestedNet: number;
  payoffMonth: number;
};

type Props = {
  monthly: number;
  lumpSumMonth: number;
  lumpSumAmount: number;
  onChange: (field: string, value: number) => void;
  annuity: Totals;
  annuityBaseline: Totals;
  linear: Totals;
  linearBaseline: Totals;
};

function ResultCard({
  title,
  withOverpayment,
  baseline,
}: {
  title: string;
  withOverpayment: Totals;
  baseline: Totals;
}) {
  const monthsSaved = Math.max(
    baseline.payoffMonth - withOverpayment.payoffMonth,
    0,
  );
  const interestSaved =
    baseline.totalInterestGross - withOverpayment.totalInterestGross;

  return (
    <Card title={title}>
      <InputField
        title="Payoff month (of 360)"
        value={withOverpayment.payoffMonth}
        disabled
        onChange={() => {}}
      />
      <InputField
        title="Months saved"
        value={monthsSaved}
        disabled
        onChange={() => {}}
      />
      <InputField
        title="Interest saved (gross)"
        prepend="€"
        value={interestSaved}
        disabled
        onChange={() => {}}
      />
      <InputField
        title="Total interest with overpayment (gross)"
        prepend="€"
        value={withOverpayment.totalInterestGross}
        disabled
        onChange={() => {}}
      />
    </Card>
  );
}

export function Overpayment(props: Props) {
  return (
    <div className="space-y-4">
      <Card
        title="Extra repayments"
        info="Model paying more than the required monthly amount, either every month or as a one-off lump sum on a chosen month."
      >
        <InputField
          title="Extra amount per month"
          prepend="€"
          value={props.monthly}
          onChange={(value) =>
            props.onChange('overpaymentMonthly', parseFloat(value))
          }
        />
        <InputField
          title="One-off lump sum amount"
          prepend="€"
          value={props.lumpSumAmount}
          onChange={(value) =>
            props.onChange('overpaymentLumpSumAmount', parseFloat(value))
          }
        />
        <InputField
          title="Lump sum in month #"
          value={props.lumpSumMonth}
          onChange={(value) =>
            props.onChange('overpaymentLumpSumMonth', parseFloat(value))
          }
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ResultCard
          title="Annuity"
          withOverpayment={props.annuity}
          baseline={props.annuityBaseline}
        />
        <ResultCard
          title="Linear"
          withOverpayment={props.linear}
          baseline={props.linearBaseline}
        />
      </div>
    </div>
  );
}
