import React from 'react';
import { NumericFormat } from 'react-number-format';

const intervals = [
  'Fix rate',
  'NHG',
  '≤55%',
  '≤60%',
  '≤65%',
  '≤70%',
  '≤75%',
  '≤80%',
  '≤85%',
  '≤90%',
  '≤95%',
  '≤100%',
];

export const interests = [
  {
    '0': '10',
    '1': '4.20',
    '55': '4.45',
    '60': '4.47',
    '65': '4.57',
    '70': '4.58',
    '75': '4.59',
    '80': '4.60',
    '85': '4.61',
    '90': '4.62',
    '95': '4.63',
    '100': '4.68',
  },
  {
    '0': '20',
    '1': '4.45',
    '55': '4.66',
    '60': '4.69',
    '65': '4.76',
    '70': '4.77',
    '75': '4.78',
    '80': '4.79',
    '85': '4.85',
    '90': '4.94',
    '95': '4.98',
    '100': '5.03',
  },
];

function TableNumber(props: { value: string; suffix: string }) {
  return (
    <td className="px-3 py-2 text-right tabular-nums">
      <NumericFormat
        value={props.value}
        displayType="text"
        thousandSeparator
        suffix={props.suffix}
        decimalScale={2}
      />
    </td>
  );
}

function RateCell(props: { value: string; onSelect?: (rate: number) => void }) {
  const formatted = (
    <NumericFormat
      value={props.value}
      displayType="text"
      thousandSeparator
      suffix="%"
      decimalScale={2}
    />
  );

  if (!props.onSelect) {
    return <td className="px-3 py-2 text-right tabular-nums">{formatted}</td>;
  }

  return (
    <td className="px-3 py-2 text-right tabular-nums">
      <button
        type="button"
        onClick={() => props.onSelect?.(parseFloat(props.value))}
        title="Use this rate"
        className="rounded px-1.5 py-0.5 transition-colors hover:bg-brand-100 hover:text-brand-600 focus:ring-2 focus:ring-brand-200 focus:outline-none"
      >
        {formatted}
      </button>
    </td>
  );
}

const links = [
  { label: 'Compare mortgage rates', href: 'https://www.ikbenfrits.nl/' },
  {
    label: 'ING',
    href: 'https://www.ing.nl/particulier/hypotheken/actuele-hypotheekrente/index.html',
  },
  {
    label: 'Rabobank',
    href: 'https://www.rabobank.nl/particulieren/hypotheek/hypotheekrente/rente-annuiteitenhypotheek-en-lineaire-hypotheek/',
  },
  {
    label: 'ABN-AMRO',
    href: 'https://www.abnamro.nl/nl/prive/hypotheken/actuele-hypotheekrente/index.html',
  },
];

type InterestProps = {
  onSelectRate?: (rate: number) => void;
};

export function Interest({ onSelectRate }: InterestProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-brand-500 uppercase">
          Reference interests
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-brand-100">
                {intervals.map((interval) => (
                  <th
                    key={interval}
                    className="px-3 py-2 text-right font-medium text-brand-400"
                  >
                    {interval === 'NHG' ? (
                      <a
                        href="https://www.nhg.nl/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 underline underline-offset-2 hover:text-brand-600"
                      >
                        NHG
                      </a>
                    ) : (
                      interval
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {interests.map((interest, i) => (
                <tr key={i} className="odd:bg-brand-50/50">
                  {Object.values(interest).map((item, j) =>
                    j > 0 ? (
                      <RateCell key={j} value={item} onSelect={onSelectRate} />
                    ) : (
                      <TableNumber key={j} value={item} suffix=" years" />
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-brand-500 uppercase">
          Interest rate sources
        </h3>
        <ul className="flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border border-brand-100 px-3 py-1.5 text-sm text-brand-500 transition-colors hover:border-brand-300 hover:text-brand-600"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
