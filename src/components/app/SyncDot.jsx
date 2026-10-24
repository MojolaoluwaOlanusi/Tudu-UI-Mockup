const TITLES = {
  live: 'Connected',
  connecting: 'Connecting',
  offline: 'Offline',
};

const COLORS = {
  live: 'bg-brand',
  connecting: 'bg-white',
  offline: 'bg-red-500',
};

export default function SyncDot({ status = 'live', onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={TITLES[status] || 'Status'}
      aria-label={TITLES[status] || 'Status'}
      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-subtle"
    >
      <span className="relative flex h-2 w-2">
        {status === 'live' && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-50" />
        )}
        <span
          className={
            'relative inline-flex h-2 w-2 rounded-full ' +
            (COLORS[status] || 'bg-white') +
            (status === 'connecting' ? ' animate-pulse' : '')
          }
        />
      </span>
    </button>
  );
}