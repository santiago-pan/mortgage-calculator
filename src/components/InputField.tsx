import React from 'react';
import { NumericFormat } from 'react-number-format';

type InputFieldProps = {
  title: string;
  prepend?: string;
  append?: string;
  toggle?: boolean;
  onToggle?: (checked: boolean) => void;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function InputField(props: InputFieldProps) {
  const handleCheck = (e: any) => {
    props.onToggle && props.onToggle(!props.toggle);
  };

  return (
    <>
      <div className="field">
        <label>
          {props.title}
          {props.onToggle && (
            <span className="input-toggle">
              <input
                checked={props.toggle}
                type="checkbox"
                onChange={handleCheck}
              />
            </span>
          )}
        </label>
        <div className="control has-icons-left">
          <NumericFormat
            inputMode={'decimal'}
            decimalScale={2}
            customInput={(field) => {
              return (
                <>
                  <input
                    className={
                      'input' +
                      (props?.onToggle && !props.toggle ? ' strikethrough' : '')
                    }
                    {...field}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas">{props.prepend}</i>
                  </span>
                </>
              );
            }}
            thousandSeparator={true}
            value={props.value}
            disabled={props.disabled}
            onBlur={(e: any) => {
              props.onChange(e.currentTarget.value.replace(/,/g, ''));
            }}
          />
        </div>
      </div>
    </>
  );
}
