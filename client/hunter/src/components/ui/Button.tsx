import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`hunter-primary-btn py-3 font-medium shadow-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
