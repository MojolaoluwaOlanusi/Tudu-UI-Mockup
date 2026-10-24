export default function SharedRow({ name, initials, meta, badge, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-subtle"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-ink-inverse">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] text-ink">{name}</p>
        {meta && <p className="truncate text-[10px] text-ink-faint">{meta}</p>}
      </div>
      {badge != null && (
        <span className="shrink-0 rounded-sm bg-line-subtle px-1.5 text-[10px] font-medium text-ink-faint tabular-nums">
          {badge}
        </span>
      )}
    </button>
  );
}