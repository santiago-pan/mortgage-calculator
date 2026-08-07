import React, { useRef } from 'react';

type Tab<T extends string> = { value: T; label: string };

type TabsProps<T extends string> = {
  tabs: Tab<T>[];
  active: T;
  onChange: (value: T) => void;
  label: string;
};

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
}: TabsProps<T>) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const nextIndex =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
    const next = tabs[nextIndex];
    onChange(next.value);
    refs.current[next.value]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-1 border-b border-brand-200"
    >
      {tabs.map((tab, index) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            ref={(el) => {
              refs.current[tab.value] = el;
            }}
            id={`tab-${tab.value}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.value}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={
              '-mb-px cursor-pointer border-b-2 px-4 py-2 text-sm font-semibold transition-colors ' +
              (isActive
                ? 'border-brand-400 text-brand-500'
                : 'border-transparent text-brand-300 hover:border-brand-200 hover:text-brand-400')
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  value,
  active,
  children,
}: {
  value: string;
  active: string;
  children: React.ReactNode;
}) {
  if (value !== active) return null;
  return (
    <div role="tabpanel" id={`tabpanel-${value}`} aria-labelledby={`tab-${value}`}>
      {children}
    </div>
  );
}
