interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 text-white text-xs rounded-lg text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg"
      style={{ minWidth: "280px", whiteSpace: "normal" }}
    >
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900"></div>
    </div>
  );
}
