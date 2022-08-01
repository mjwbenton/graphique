import { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div {...props} className={`${className} bg-orange-100 shadow-hard p-4`}>
      {children}
    </div>
  );
}
