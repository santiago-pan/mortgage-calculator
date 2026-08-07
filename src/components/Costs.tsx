import React from 'react';
import { InputField } from './InputField';
import { Card } from './Card';
import { nhgFee } from '../common/constants';
import { glossary } from '../common/glossary';
import { ToggleableCost } from '../App';

type Props = {
  price: number;
  savings: number;
  loan: number;
  notary: number;
  valuation: number;
  financialAdvisor: number;
  realStateAgent: number;
  structuralSurvey: number;
  costEnabled: Record<ToggleableCost, boolean>;
  onChange: (field: string, value: number) => void;
  onToggle: (field: ToggleableCost, enabled: boolean) => void;
};

export function Costs(props: Props) {
  const bankGuarantee = 0.001 * props.price;
  const transferTax = 0.02 * props.price;
  const nhg = nhgFee(props.price, props.loan);

  function toggle(field: ToggleableCost) {
    return {
      checked: props.costEnabled[field],
      onChange: (checked: boolean) => props.onToggle(field, checked),
    };
  }

  return (
    <Card title="Purchase costs">
      <InputField title="Transfer tax" prepend="€" disabled value={transferTax} onChange={() => {}} info={glossary.transferTax} />
      <InputField
        title="Valuation"
        prepend="€"
        value={props.valuation}
        toggle={toggle('valuation')}
        onChange={(value) => props.onChange('valuation', parseFloat(value))}
      />
      <InputField
        title="Real estate agent"
        prepend="€"
        value={props.realStateAgent}
        toggle={toggle('realStateAgent')}
        onChange={(value) => props.onChange('realStateAgent', parseFloat(value))}
      />
      <InputField title="Bank guarantee" prepend="€" disabled value={bankGuarantee} onChange={() => {}} info={glossary.bankGuarantee} />
      <InputField
        title="Notary"
        prepend="€"
        value={props.notary}
        toggle={toggle('notary')}
        onChange={(value) => props.onChange('notary', parseFloat(value))}
      />
      <InputField
        title="Financial advisor"
        prepend="€"
        value={props.financialAdvisor}
        toggle={toggle('financialAdvisor')}
        onChange={(value) => props.onChange('financialAdvisor', parseFloat(value))}
      />
      <InputField title="NHG" prepend="€" disabled value={nhg} onChange={() => {}} info={glossary.nhg} />
      <InputField
        title="Structural survey"
        prepend="€"
        value={props.structuralSurvey}
        toggle={toggle('structuralSurvey')}
        onChange={(value) => props.onChange('structuralSurvey', parseFloat(value))}
      />
    </Card>
  );
}
