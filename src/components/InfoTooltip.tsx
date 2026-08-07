import React, { useEffect, useId, useRef, useState } from 'react';

type InfoTooltipProps = {
  text: string;
};

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={(event) => {
          // Prevent an ancestor <label> from forwarding this click to its input.
          event.preventDefault();
          setOpen((value) => !value);
        }}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-brand-300 text-[10px] leading-none font-semibold text-brand-300 normal-case transition-colors hover:border-brand-400 hover:text-brand-400"
      >
        i
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-md border border-brand-100 bg-white p-2 text-xs font-normal normal-case text-brand-500 shadow-md"
        >
          {text}
        </span>
      )}
    </span>
  );
}
