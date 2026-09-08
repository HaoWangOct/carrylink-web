import type { ButtonHTMLAttributes } from "react";

const variants = {
  orange: "bg-orange text-white hover:bg-orange-hover",
  ink: "bg-ink text-white hover:bg-ink-hover",
  ghost: "border border-white/15 bg-white/10 text-white hover:bg-white/20",
};

export function Button({
  variant = "orange",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition-colors disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
