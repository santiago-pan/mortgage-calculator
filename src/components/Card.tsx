import React from 'react';
import { InfoTooltip } from './InfoTooltip';

export function Card({
  title,
  info,
  children,
}: {
  title: string;
  info?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-brand-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold tracking-wide text-brand-500 uppercase">
        {title}
        {info && <InfoTooltip text={info} />}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}
