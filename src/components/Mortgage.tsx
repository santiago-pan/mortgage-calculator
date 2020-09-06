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
  rent: number;
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
        </div>
        <div className="column">
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
          <ColumnInputField
            title="Current rent"
            prepend="€"
            value={props.rent}
            field={'rent'}
          />
          <ColumnInputField
            title="Total invested on rent (30 years)"
            prepend="€"
            value={props.rent * 360}
            field={null}
          />
          <ColumnInputField
            title="Total cost - Total rent (gross)"
            prepend="€"
            value={props.annuity.totalInvestedGross - props.rent * 360}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Total cost - Total rent (net)"
            prepend="€"
            value={props.annuity.totalInvestedNet - props.rent * 360}
            field={null}
            disabled
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
            title="Annuity - Total interest (gross)"
            prepend="€"
            value={props.annuity.totalInterestGross}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Annuity - Total invested (gross)"
            prepend="€"
            value={props.annuity.totalInvestedGross}
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
            title="Annuity - Total interest (net)"
            prepend="€"
            value={props.annuity.totalInterestNet}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Annuity - Total invested (net)"
            prepend="€"
            value={props.annuity.totalInvestedNet}
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
            title="Linear - Total interest (gross)"
            prepend="€"
            value={props.linear.totalInterestGross}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Linear - Total invested (gross)"
            prepend="€"
            value={props.linear.totalInvestedGross}
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
            title="Linear - Total interest (net)"
            prepend="€"
            value={props.linear.totalInterestNet}
            field={null}
            disabled
          />
          <ColumnInputField
            title="Linear - Total invested (net)"
            prepend="€"
            value={props.linear.totalInvestedNet}
            field={null}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
