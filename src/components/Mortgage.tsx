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
  totalPaidGrossAnnuity: number;
  totalPaidGrossLinear: number;
  totalPaidNetAnnuity: number;
  totalPaidNetLinear: number;
  onChange: (field: string, value: number) => void;
};

export function Mortgage(props: Props) {
  function ColumnInputField(input: {
    title: string;
    prepend: string;
    value: number;
    field: string | null;
    disabled?: boolean;
  }) {
    return (
      <div className="column">
        <InputField
          disabled={input.disabled}
          title={input.title}
          prepend={input.prepend}
          value={input.value}
          onChange={(value) =>
            input.field && props.onChange(input.field, parseFloat(value))
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="columns">
        <ColumnInputField
          title="House Price"
          prepend="€"
          value={props.price}
          field={'price'}
        />
        <ColumnInputField
          title="Required Loan"
          prepend="€"
          value={props.loan}
          field={null}
          disabled
        />
        <ColumnInputField
          title="Total Gross Paid Annuity"
          prepend="€"
          value={props.totalPaidGrossAnnuity}
          field={null}
          disabled
        />
      </div>
      <div className="columns">
        <ColumnInputField
          title="Own Savings"
          prepend="€"
          value={props.savings}
          field={'savings'}
        />
        <ColumnInputField
          title="Loan / Price Rate (%)"
          prepend="%"
          value={props.percentage * 100}
          field={null}
          disabled
        />
        <ColumnInputField
          title="Total Gross Paid Linear"
          prepend="€"
          value={props.totalPaidGrossLinear}
          field={null}
          disabled
        />
      </div>
      <div className="columns">
        <ColumnInputField
          title="Purchase Cost"
          prepend="€"
          value={props.cost}
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
          title="Total Net Paid Annuity"
          prepend="€"
          value={props.totalPaidNetLinear}
          field={null}
          disabled
        />
      </div>
      <div className="columns">
        <ColumnInputField
          title="Remaining"
          prepend="€"
          value={props.savings - props.cost}
          field={null}
          disabled
        />
        <ColumnInputField
          title="Interest Deduction"
          prepend="%"
          value={props.deduction}
          field={'deduction'}
        />
        <ColumnInputField
          title="Total Net Paid Linear"
          prepend="€"
          value={props.totalPaidNetLinear}
          field={null}
          disabled
        />
      </div>
    </div>
  );
}
