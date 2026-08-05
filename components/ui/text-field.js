export function TextField({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={props.id}
        className="text-[14px] font-medium text-navy-dark"
      >
        {label}
      </label>
      <input
        {...props}
        className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-[14px]
          text-navy-dark placeholder:text-gray-400 outline-none transition
          focus:border-orange focus:ring-1 focus:ring-orange"
      />
      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
