import React from 'react';
import { Columns } from 'react-bulma-components';
import { InputField } from './InputField';

type Props = {
  price: number;
  savings: number;
  cost: number;
  loan: number;
  interest: number;
  percentage: number;
  onChange: (field: string, value: number) => void;
};
export function Mortgage(props: Props) {
  return (
    <div>
      <Columns>
        <Columns.Column>
          <InputField
            title="House Price"
            prepend="€"
            value={props.price}
            onChange={(value) => props.onChange('price', parseInt(value, 10))}
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="Purchase Costs"
            prepend="€"
            value={props.cost}
            onChange={() => {}}
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="Required Loan"
            disabled
            prepend="€"
            value={props.loan}
            onChange={() => {}}
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="Loan / Price (%)"
            disabled
            prepend="%"
            value={props.percentage * 100}
            onChange={() => {}}
          />
        </Columns.Column>
      </Columns>

      <Columns>
        <Columns.Column>
          <InputField
            title="Own savings"
            prepend="€"
            value={props.savings}
            onChange={(value) => props.onChange('savings', parseInt(value, 10))}
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="Remaining"
            disabled
            prepend="€"
            value={props.savings - props.cost}
            onChange={() => {}}
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="Interest"
            prepend="%"
            value={props.interest}
            onChange={(value) => props.onChange('interest', parseFloat(value))}
          />
        </Columns.Column>
        <Columns.Column />
      </Columns>
    </div>
  );
}
