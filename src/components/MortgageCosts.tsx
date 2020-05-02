import React from 'react';
import { Columns } from 'react-bulma-components';
import { InputField } from './InputField';

export const MAX_NHG = 310000;
export const NHG_FEE = 0.007;

type Props = {
  price: number;
  savings: number;
  loan: number;
  notary: number;
  valuation: number;
  financialAdvisor: number;
  realStateAgent: number;
  structuralSurvey: number;
  onChange: (field: string, value: number) => void;
};

export function MortgageCosts(props: Props) {
  const bankGuarantee = 0.001 * props.price;
  const transferTax = 0.02 * props.price;
  const nhg = props.price > MAX_NHG ? 0 : NHG_FEE * props.loan;

  return (
    <div>
      <Columns>
        <Columns.Column>
          <InputField
            title="Transfer Tax"
            prepend="€"
            disabled
            value={transferTax}
            onChange={() => {}}
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="Valuation"
            prepend="€"
            value={props.valuation}
            onChange={(value) =>
              props.onChange('valuation', parseInt(value, 10))
            }
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="Real State Agent"
            prepend="€"
            value={props.realStateAgent}
            onChange={(value) =>
              props.onChange('realStateAgent', parseInt(value, 10))
            }
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="Bank Guarantee"
            prepend="€"
            disabled
            value={bankGuarantee}
            onChange={() => {}}
          />
        </Columns.Column>
      </Columns>

      <Columns className="mb-3">
        <Columns.Column>
          <InputField
            title="Notary"
            prepend="€"
            value={props.notary}
            onChange={(value) => props.onChange('notary', parseInt(value, 10))}
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="Financial Advisor"
            prepend="€"
            value={props.financialAdvisor}
            onChange={(value) =>
              props.onChange('financialAdvisor', parseInt(value, 10))
            }
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="NHG"
            prepend="€"
            disabled
            value={nhg}
            onChange={() => {}}
          />
        </Columns.Column>
        <Columns.Column>
          <InputField
            title="Structural Survey"
            prepend="€"
            value={props.structuralSurvey}
            onChange={(value) =>
              props.onChange('structuralSurvey', parseInt(value, 10))
            }
          />
        </Columns.Column>
      </Columns>
    </div>
  );
}
