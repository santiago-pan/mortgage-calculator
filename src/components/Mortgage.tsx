import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputField } from './InputField';

type Props = {
  price: number;
  savings: number;
  cost: number;
  loan: number;
  interest: number;
  onChange: (field: string, value: number) => void;
};
export function Mortgage(props: Props) {
  return (
    <>
      <Row className="mb-3">
        <Col>
          <InputField
            title="House Price"
            prepend="€"
            value={props.price}
            onChange={value => props.onChange('price', parseInt(value, 10))}
          />
        </Col>
        <Col>
          <InputField
            title="Cost"
            prepend="€"
            value={props.cost}
            onChange={() => {}}
          />
        </Col>
        <Col>
          <InputField
            title="Loan"
            disabled
            prepend="€"
            value={props.loan}
            onChange={() => {}}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <InputField
            title="Own savings"
            prepend="€"
            value={props.savings}
            onChange={value => props.onChange('savings', parseInt(value, 10))}
          />
        </Col>
        <Col>
          <InputField
            title="Remaining"
            disabled
            prepend="€"
            value={props.savings - props.cost}
            onChange={() => {}}
          />
        </Col>
        <Col>
          <InputField
            title="Interest"
            prepend="%"
            value={props.interest}
            onChange={value => props.onChange('interest', parseFloat(value))}
          />
        </Col>
      </Row>
    </>
  );
}
