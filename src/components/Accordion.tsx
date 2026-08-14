"use client";

import { useState, ReactNode } from "react";

interface AccordionItemData {
  title: string;
  content: ReactNode;
}

export function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-walnut/10 overflow-hidden rounded-2xl border border-walnut/10 bg-cream-light">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.title}>
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className="text-sm font-bold text-walnut md:text-base">
                {item.title}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className={`shrink-0 text-teal transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {open && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-ink/80 md:text-base">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
