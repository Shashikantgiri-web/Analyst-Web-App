export function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "h-11 rounded-lg text-[14px] font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-orange text-white shadow-[0_4px_10px_rgba(255,107,53,0.2)] hover:brightness-105",
    secondary:
      "bg-white text-navy-dark border border-gray-200 hover:bg-gray-50",
  };

  return <button {...props} className={`${base} ${variants[variant]} ${className}`} />;
}
