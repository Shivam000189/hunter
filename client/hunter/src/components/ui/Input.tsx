import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className="hunter-input"
      {...props}
    />
  );
}
