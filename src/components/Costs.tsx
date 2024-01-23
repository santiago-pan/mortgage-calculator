import React from 'react';
import { InputField } from './InputField';

export const MAX_NHG = 510_000;
export const NHG_FEE = 0.006;

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

export function Costs(props: Props) {
  const bankGuarantee = 0.001 * props.price;
  const transferTax = 0.02 * props.price;
  const nhg = props.price > MAX_NHG ? 0 : NHG_FEE * props.loan;

  return (
    <div>
      <div className="columns">
        <div className="column">
          <InputField
            title="Transfer tax"
            prepend="€"
            disabled
            value={transferTax}
            onChange={() => {}}
          />
          <InputField
            title="Valuation"
            prepend="€"
            value={props.valuation}
            onChange={(value) =>
              props.onChange('valuation', parseInt(value, 10))
            }
          />
          <InputField
            title="Real estate agent"
            prepend="€"
            value={props.realStateAgent}
            onChange={(value) =>
              props.onChange('realStateAgent', parseInt(value, 10))
            }
          />
          <InputField
            title="Bank guarantee"
            prepend="€"
            disabled
            value={bankGuarantee}
            onChange={() => {}}
          />
        </div>
        <div className="column">
          <InputField
            title="Notary"
            prepend="€"
            value={props.notary}
            onChange={(value) => props.onChange('notary', parseInt(value, 10))}
          />
          <InputField
            title="Financial advisor"
            prepend="€"
            value={props.financialAdvisor}
            onChange={(value) =>
              props.onChange('financialAdvisor', parseInt(value, 10))
            }
          />
          <InputField
            title="NHG"
            prepend="€"
            disabled
            value={nhg}
            onChange={() => {}}
          />
          <InputField
            title="Structural survey"
            prepend="€"
            value={props.structuralSurvey}
            onChange={(value) =>
              props.onChange('structuralSurvey', parseInt(value, 10))
            }
          />
        </div>
      </div>
    </div>
  );
}
