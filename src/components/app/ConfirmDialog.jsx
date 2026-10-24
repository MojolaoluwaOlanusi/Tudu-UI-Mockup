import { useApp } from '@/store/AppContext';

export default function ConfirmDialog() {
  const { confirmDialog, confirmResolve } = useApp();
  if (!confirmDialog) return null;

  const {
    title = 'Are you sure?',
    body,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger,
  } = confirmDialog;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={() => confirmResolve(false)}
      role="presentation"
    >
      <div
        className="card w-full max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <h2 id="confirm-title" className="font-handwritten text-2xl text-ink">
          {title}
        </h2>
        {body && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => confirmResolve(false)} className="btn-ghost">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => confirmResolve(true)}
            className={
              danger
                ? 'inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600'
                : 'btn-accent'
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}