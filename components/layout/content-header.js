export function ContentHeader({ title, subtitle }) {
  return (
    <div className="flex h-16 flex-col justify-center border-b border-gray-200 bg-white px-8">
      <h1 className="text-[20px] font-bold text-navy-dark">{title}</h1>
      {subtitle && (
        <p className="text-[13px] text-gray-500 leading-tight">{subtitle}</p>
      )}
    </div>
  );
}
