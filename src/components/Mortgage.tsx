import React from 'react';
import { InputField } from './InputField';

type Props = {
  price: number;
  savings: number;
  cost: number;
  loan: number;
  interest: number;
  percentage: number;
  deduction: number;
  annuity: {
    totalPaidGross: number;
    totalPaidNet: number;
    totalInterestGross: number;
    totalInterestNet: number;
    totalInvestedGross: number;
    totalInvestedNet: number;
  };
  linear: {
    totalPaidGross: number;
    totalPaidNet: number;
    totalInterestGross: number;
    totalInterestNet: number;
    totalInvestedGross: number;
    totalInvestedNet: number;
  };
  onChange: (field: string, value: number) => void;
};

export function Mortgage(props: Props) {
  function ColumnInputField(input: {
    title: string;
    prepend: string;
    append?: string;
    value: number;
    field: string | null;
    disabled?: boolean;
  }) {
    return (
      <InputField
        disabled={input.disabled}
        title={input.title}
        prepend={input.prepend}
        append={input.append}
        value={input.value}
        onChange={(value) =>
          input.field && props.onChange(input.field, parseFloat(value))
        }
      />
    );
  }

  return (
    <div>
      <div className="columns">
        <div className="column">
          <ColumnInputField
            title="House price"
            prepend="€"
            value={props.price}
            field={'price'}
          />
          <ColumnInputField
            title="Own savings"
            prepend="€"
            value={props.savings}
            field={'savings'}
          />
          <ColumnInputField
            title="Purchase cost"
            prepend="€"
            value={props.cost}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Remaining = Savings - Cost"
            prepend="€"
            value={props.savings - props.cost}
            field={null}
            disabled
          />
        </div>
        <div className="column">
          <ColumnInputField
            title="Required loan"
            prepend="€"
            value={props.loan}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Loan / Price Rate (%)"
            prepend="%"
            value={props.percentage * 100}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Interest"
            prepend="%"
            value={props.interest}
            field={'interest'}
          />
          <ColumnInputField
            title="Interest deduction"
            prepend="%"
            value={props.deduction}
            field={'deduction'}
          />
        </div>
        <div className="column">
          <ColumnInputField
            title="Annuity - Total repaid (gross)"
            prepend="€"
            value={props.annuity.totalPaidGross}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Annuity - Total repaid (net)"
            prepend="€"
            value={props.annuity.totalPaidNet}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Annuity - Total interest"
            prepend="€"
            value={props.annuity.totalInterestGross}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Annuity - Total invested"
            prepend="€"
            value={props.annuity.totalInvestedGross}
            field={null}
            disabled
          />
        </div>
        <div className="column">
          <ColumnInputField
            title="Linear - Total repaid (gross)"
            prepend="€"
            value={props.linear.totalPaidGross}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Linear - Total repaid (net)"
            prepend="€"
            value={props.linear.totalPaidNet}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Linear - Total interest"
            prepend="€"
            value={props.linear.totalInterestGross}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Linear - Total invested"
            prepend="€"
            value={props.linear.totalInvestedGross}
            field={null}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
