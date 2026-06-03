import type { HTMLAttributes, ReactNode } from 'react';

type BrutalistCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function BrutalistCard({ children, className = '', ...props }: BrutalistCardProps) {
  return (
    <div className={`brutalist-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}