import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

type InputFieldProps = {
  title: string;
  prepend?: string;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function InputField(props: InputFieldProps) {
  return (
    <React.Fragment>
      <label className="mb-1">{props.title}</label>
      <InputGroup size="sm">
        {props.prepend && (
          <InputGroup.Prepend>
            <InputGroup.Text>{props.prepend}</InputGroup.Text>
          </InputGroup.Prepend>
        )}
        <NumberFormat
          decimalScale={2}
          customInput={FormControl}
          thousandSeparator={true}
          value={props.value}
          disabled={props.disabled}
          onBlur={(e: any) => {
            props.onChange(e.currentTarget.value.replace(/,/g, ''));
          }}
        />
      </InputGroup>
    </React.Fragment>
  );
}
