import { useDroppable } from '@dnd-kit/core';
import { MoreHorizontal, Plus } from 'lucide-react';
import BoardCard from './BoardCard';

export default function BoardColumn({
  column, tasks, onOpenTask, onOpenColumnSettings, onAddCard,
  isColumnDragging,
  onColumnDragStart, onColumnDragOver, onColumnDragEnd,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const atLimit = column.wip_limit != null && tasks.length >= column.wip_limit;

  return (
    <div
      ref={setNodeRef}
      className={
        'flex h-full w-72 shrink-0 flex-col overflow-hidden rounded-xl border transition-opacity ' +
        (isOver ? 'border-brand bg-brand-subtle/20' : 'border-line-subtle bg-canvas/40') +
        (isColumnDragging ? ' opacity-40' : '')
      }
    >
      <div className="h-1 shrink-0" style={{ backgroundColor: column.color }} />
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          onColumnDragStart();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          onColumnDragOver(e);
        }}
        onDrop={(e) => {
          e.preventDefault();
          onColumnDragEnd();
        }}
        onDragEnd={onColumnDragEnd}
        onPointerDown={(e) => e.stopPropagation()}
        className="shrink-0 cursor-grab border-b border-line-subtle px-3 py-2 active:cursor-grabbing"
        title="Drag to reorder"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              {column.name}
            </span>
            <span
              className={
                'shrink-0 rounded-sm px-1.5 text-[10px] font-medium tabular-nums ' +
                (atLimit ? 'bg-red-500/15 text-red-400' : 'bg-line-subtle text-ink-faint')
              }
            >
              {tasks.length}{column.wip_limit != null ? '/' + column.wip_limit : ''}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAddCard(); }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Add card"
              title="Add card"
              className="rounded p-1 text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpenColumnSettings(); }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={'Settings for ' + column.name}
              title="Column settings"
              className="rounded p-1 text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2 scroll-hidden">
        {tasks.length === 0 ? (
          <div
            className={
              'flex h-24 items-center justify-center rounded-lg border-2 border-dashed text-[11px] ' +
              (isOver ? 'border-brand bg-brand-subtle/30 text-brand' : 'border-line-subtle text-ink-faint')
            }
          >
            {isOver ? 'Drop here' : 'No cards'}
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <BoardCard key={task.id} task={task} onOpen={() => onOpenTask(task)} />
            ))}
            {isOver && <div className="h-0.5 rounded-full bg-brand" />}
          </div>
        )}
      </div>
    </div>
  );
}