import React, { useId } from 'react';
import { NumericFormat } from 'react-number-format';
import { InfoTooltip } from './InfoTooltip';

type InputFieldProps = {
  title: string;
  prepend?: string;
  append?: string;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  info?: string;
  toggle?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  };
};

export function InputField({
  title,
  prepend,
  append,
  value,
  onChange,
  disabled,
  info,
  toggle,
}: InputFieldProps) {
  const id = useId();

  return (
    <div className={toggle && !toggle.checked ? 'opacity-50' : undefined}>
      <div className="mb-1 flex items-center gap-1.5 text-sm text-brand-400">
        {toggle && (
          <input
            type="checkbox"
            checked={toggle.checked}
            onChange={(e) => toggle.onChange(e.target.checked)}
            aria-label={`Include ${title} in total`}
            className="h-3.5 w-3.5 rounded border-brand-300 text-brand-400 focus:ring-2 focus:ring-brand-200"
          />
        )}
        <label htmlFor={id}>{title}</label>
        {info && <InfoTooltip text={info} />}
        {disabled && (
          <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-brand-400 uppercase">
            computed
          </span>
        )}
      </div>
      <div className="relative">
        {prepend && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-brand-300">
            {prepend}
          </span>
        )}
        <NumericFormat
          id={id}
          inputMode="decimal"
          decimalScale={2}
          thousandSeparator
          value={value}
          disabled={disabled}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            onChange(e.currentTarget.value.replace(/,/g, ''));
          }}
          className={
            'w-full rounded-md border py-2 text-sm tabular-nums transition-colors ' +
            (prepend ? 'pl-8' : 'pl-3') +
            ' ' +
            (append ? 'pr-8' : 'pr-3') +
            ' ' +
            (disabled
              ? 'cursor-default border-transparent bg-brand-50 text-brand-500'
              : 'border-brand-200 bg-white text-brand-600 focus:border-brand-400 focus:ring-2 focus:ring-brand-200 focus:outline-none')
          }
        />
        {append && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-brand-300">
            {append}
          </span>
        )}
      </div>
    </div>
  );
}
