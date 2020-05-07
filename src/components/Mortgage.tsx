import React from 'react';
import { InputField } from './InputField';

type Props = {
  price: number;
  savings: number;
  cost: number;
  loan: number;
  interest: number;
  percentage: number;
  taxReturn: number;
  onChange: (field: string, value: number) => void;
};
export function Mortgage(props: Props) {
  return (
    <div>
      <div className="columns">
        <div className="column">
          <InputField
            title="House Price"
            prepend="€"
            value={props.price}
            onChange={(value) => props.onChange('price', parseInt(value, 10))}
          />
        </div>
        <div className="column">
          <InputField
            title="Purchase Costs"
            disabled
            prepend="€"
            value={props.cost}
            onChange={() => {}}
          />
        </div>
        <div className="column">
          <InputField
            title="Required Loan"
            disabled
            prepend="€"
            value={props.loan}
            onChange={() => {}}
          />
        </div>
        <div className="column">
          <InputField
            title="Loan / Price (%)"
            disabled
            prepend="%"
            value={props.percentage * 100}
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="columns">
        <div className="column">
          <InputField
            title="Own savings"
            prepend="€"
            value={props.savings}
            onChange={(value) => props.onChange('savings', parseInt(value, 10))}
          />
        </div>
        <div className="column">
          <InputField
            title="Remaining"
            disabled
            prepend="€"
            value={props.savings - props.cost}
            onChange={() => {}}
          />
        </div>
        <div className="column">
          <InputField
            title="Interest"
            prepend="%"
            value={props.interest}
            onChange={(value) => props.onChange('interest', parseFloat(value))}
          />
        </div>
        <div className="column">
          <InputField
            title="Interest Deduction"
            prepend="%"
            value={props.taxReturn}
            onChange={(value) => props.onChange('taxReturn', parseFloat(value))}
          />
        </div>
      </div>
    </div>
  );
}
