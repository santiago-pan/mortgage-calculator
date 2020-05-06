import React from 'react';
import NumberFormat from 'react-number-format';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faInfo } from '@fortawesome/free-solid-svg-icons';

type InputFieldProps = {
  title: string;
  prepend?: string;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function InputField(props: InputFieldProps) {
  return (
    <>
      <div className="field">
        <label>{props.title}</label>
        {/* <FontAwesomeIcon icon={faInfo} title="How much of your own savings" /> */}
        <div className="control has-icons-left">
          <NumberFormat
            decimalScale={2}
            customInput={(field) => {
              return (
                <>
                  <input className="input" {...field} />
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
