import React from 'react';
import { InputField } from './InputField';
import { Card } from './Card';
import { glossary } from '../common/glossary';

type Totals = {
  totalPaidGross: number;
  totalPaidNet: number;
  totalInterestGross: number;
  totalInterestNet: number;
  totalInvestedGross: number;
  totalInvestedNet: number;
};

type Props = {
  price: number;
  savings: number;
  cost: number;
  loan: number;
  interest: number;
  percentage: number;
  deduction: number;
  rent: number;
  annuity: Totals;
  linear: Totals;
  annuityBreakEvenMonth: number | null;
  linearBreakEvenMonth: number | null;
  onChange: (field: string, value: number) => void;
};

type FieldSpec = {
  title: string;
  prepend: string;
  value: number;
  field: string | null;
  disabled?: boolean;
  info?: string;
};

function Field({
  spec,
  onChange,
}: {
  spec: FieldSpec;
  onChange: (field: string, value: number) => void;
}) {
  return (
    <InputField
      disabled={spec.disabled}
      title={spec.title}
      prepend={spec.prepend}
      value={spec.value}
      info={spec.info}
      onChange={(value) => spec.field && onChange(spec.field, parseFloat(value))}
    />
  );
}

function BreakEvenField({
  title,
  month,
}: {
  title: string;
  month: number | null;
}) {
  return (
    <div>
      <span className="mb-1 flex items-center gap-1.5 text-sm text-brand-400">
        {title}
        <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-brand-400 uppercase">
          computed
        </span>
      </span>
      <div className="rounded-md border border-transparent bg-brand-50 px-3 py-2 text-sm text-brand-500">
        {month === null
          ? 'Never within 30 years'
          : `Month ${month} (year ${Math.ceil(month / 12)})`}
      </div>
    </div>
  );
}

function MortgageTypeCard({
  title,
  info,
  totals,
}: {
  title: string;
  info?: string;
  totals: Totals;
}) {
  return (
    <Card title={title} info={info}>
      <Field
        spec={{ title: 'Total repaid (gross)', prepend: '€', value: totals.totalPaidGross, field: null, disabled: true }}
        onChange={() => {}}
      />
      <Field
        spec={{ title: 'Total repaid (net)', prepend: '€', value: totals.totalPaidNet, field: null, disabled: true }}
        onChange={() => {}}
      />
      <Field
        spec={{ title: 'Total interest (gross)', prepend: '€', value: totals.totalInterestGross, field: null, disabled: true }}
        onChange={() => {}}
      />
      <Field
        spec={{ title: 'Total interest (net)', prepend: '€', value: totals.totalInterestNet, field: null, disabled: true }}
        onChange={() => {}}
      />
      <Field
        spec={{ title: 'Total invested (gross)', prepend: '€', value: totals.totalInvestedGross, field: null, disabled: true }}
        onChange={() => {}}
      />
      <Field
        spec={{ title: 'Total invested (net)', prepend: '€', value: totals.totalInvestedNet, field: null, disabled: true }}
        onChange={() => {}}
      />
    </Card>
  );
}

export function Mortgage(props: Props) {
  const { onChange } = props;

  return (
    <div className="space-y-4">
      <Card title="Your details">
        <Field spec={{ title: 'House price', prepend: '€', value: props.price, field: 'price' }} onChange={onChange} />
        <Field spec={{ title: 'Own savings', prepend: '€', value: props.savings, field: 'savings' }} onChange={onChange} />
        <Field spec={{ title: 'Interest', prepend: '%', value: props.interest, field: 'interest' }} onChange={onChange} />
        <Field spec={{ title: 'Interest deduction', prepend: '%', value: props.deduction, field: 'deduction', info: glossary.interestDeduction }} onChange={onChange} />
        <Field spec={{ title: 'Current rent', prepend: '€', value: props.rent, field: 'rent' }} onChange={onChange} />
      </Card>

      <Card title="Purchase summary">
        <Field spec={{ title: 'Purchase cost', prepend: '€', value: props.cost, field: null, disabled: true }} onChange={onChange} />
        <Field spec={{ title: 'Remaining = Savings - Cost', prepend: '€', value: props.savings - props.cost, field: null, disabled: true }} onChange={onChange} />
        <Field spec={{ title: 'Required loan', prepend: '€', value: props.loan, field: null, disabled: true }} onChange={onChange} />
        <Field spec={{ title: 'Loan / Price rate (%)', prepend: '%', value: props.percentage * 100, field: null, disabled: true, info: glossary.loanToPrice }} onChange={onChange} />
      </Card>

      <Card
        title="Rent vs. buy (30 years)"
        info="Break-even: the first month where what you've spent buying (upfront cost + payments so far) drops to or below what you'd have spent renting."
      >
        <Field spec={{ title: 'Total invested on rent', prepend: '€', value: props.rent * 360, field: null, disabled: true }} onChange={onChange} />
        <Field spec={{ title: 'Total rent - total cost (gross)', prepend: '€', value: props.rent * 360 - props.annuity.totalInvestedGross, field: null, disabled: true }} onChange={onChange} />
        <Field spec={{ title: 'Total rent - total cost (net)', prepend: '€', value: props.rent * 360 - props.annuity.totalInvestedNet, field: null, disabled: true }} onChange={onChange} />
        <BreakEvenField title="Break-even (Annuity)" month={props.annuityBreakEvenMonth} />
        <BreakEvenField title="Break-even (Linear)" month={props.linearBreakEvenMonth} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MortgageTypeCard title="Annuity" info={glossary.annuity} totals={props.annuity} />
        <MortgageTypeCard title="Linear" info={glossary.linear} totals={props.linear} />
      </div>
    </div>
  );
}
