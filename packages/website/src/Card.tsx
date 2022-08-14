import React from "react";
import { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={`${className} bg-orange-100 shadow-hard p-4`}
      >
        {children}
      </div>
    );
  }
);

export default Card;
