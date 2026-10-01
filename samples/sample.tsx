// Onion syntax sample for TSX
import { useState, type ReactNode } from 'react';

type Props<T> = { items: T[]; render?: (item: T) => ReactNode; title: string };

export function OnionList<T extends { id: number }>({ items, render, title }: Props<T>) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <section className="onion-list" aria-label={title} data-open={open}>
      <Header title={title} onToggle={() => setOpen((o) => !o)} />
      {open && items.map((item) => <li key={item.id}>{render?.(item) ?? String(item.id)}</li>)}
      <p>Plain JSX text with {items.length} layers.</p>
    </section>
  );
}

const Header = ({ title, onToggle }: { title: string; onToggle: () => void }) => (
  <h2 onClick={onToggle}>{title}</h2>
);
