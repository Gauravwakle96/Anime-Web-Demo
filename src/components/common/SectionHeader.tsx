import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
}

export default function SectionHeader({ title, description, action, id }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6" id={id}>
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-muted-foreground max-w-xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}
