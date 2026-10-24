import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import BoardColumn from './BoardColumn';
import { BoardCardVisual } from './BoardCard';
import TaskForm from '@/components/app/list/TaskForm';

export default function BoardView() {
  const { tasks, columns, openDetail, moveTask, createColumn, pushToast, reorderColumns, isComposerOpen, openComposer, closeComposer } = useApp();
  const [activeId, setActiveId] = useState(null);
  const [draggedColId, setDraggedColId] = useState(null);
  const [columnDropTarget, setColumnDropTarget] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const visibleTasks = tasks.filter((t) => !t.deleted);
  const activeTask = activeId ? visibleTasks.find((t) => t.id === activeId) : null;

  const onDragStart = (e) => setActiveId(e.active.id);
  const onDragCancel = () => setActiveId(null);

  const onDragEnd = (e) => {
    const draggedId = e.active.id;
    const targetColumnId = e.over ? e.over.id : null;
    setActiveId(null);
    if (!targetColumnId) return;
    const task = visibleTasks.find((t) => t.id === draggedId);
    if (!task) return;
    if (task.column_id === targetColumnId) return;
    const targetColumn = columns.find((c) => c.id === targetColumnId);
    if (!targetColumn) return;
    const targetCount = visibleTasks.filter((t) => t.column_id === targetColumnId).length;
    if (targetColumn.wip_limit != null && targetCount >= targetColumn.wip_limit) {
      pushToast('"' + targetColumn.name + '" is full (WIP limit ' + targetColumn.wip_limit + '). Move or finish a card first.');
      return;
    }
    moveTask(draggedId, targetColumnId);
  };

  const handleColumnDragStart = (id) => setDraggedColId(id);

  const handleColumnDragOver = (e, columnId) => {
    e.preventDefault();
    if (!draggedColId) return;
    if (draggedColId === columnId) { setColumnDropTarget(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const side = e.clientX < rect.left + rect.width / 2 ? 'left' : 'right';
    setColumnDropTarget({ id: columnId, side });
  };

  const handleColumnDrop = () => {
    if (!draggedColId || !columnDropTarget) {
      setDraggedColId(null);
      setColumnDropTarget(null);
      return;
    }
    const fromIdx = columns.findIndex((c) => c.id === draggedColId);
    const overIdx = columns.findIndex((c) => c.id === columnDropTarget.id);
    if (fromIdx < 0 || overIdx < 0) {
      setDraggedColId(null);
      setColumnDropTarget(null);
      return;
    }
    let toIdx = columnDropTarget.side === 'left' ? overIdx : overIdx + 1;
    if (fromIdx < toIdx) toIdx -= 1;
    if (fromIdx !== toIdx) reorderColumns(fromIdx, toIdx);
    setDraggedColId(null);
    setColumnDropTarget(null);
  };

  const handleColumnDragEnd = () => {
    setDraggedColId(null);
    setColumnDropTarget(null);
  };

  const handleAddColumn = () => {
    const col = createColumn({ name: 'New column', stage: 'todo' });
    if (col) openDetail({ type: 'column', id: col.id });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-line-subtle px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-handwritten text-3xl leading-none text-ink sm:text-4xl">Board</h1>
            <p className="mt-2 text-[11px] text-ink-faint">Drag a card by its grip. Drag a column header to reorder.</p>
          </div>
          <button type="button" onClick={() => (isComposerOpen ? closeComposer() : openComposer())} className="btn-accent brush-stroke !py-1.5 !text-[13px]">
            {isComposerOpen ? 'Cancel' : '+ New task'}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden p-4">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
          <div className="flex h-full gap-3">
            {columns.map((column) => {
              const columnTasks = visibleTasks.filter((t) => t.column_id === column.id).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
              const showDrop = columnDropTarget && columnDropTarget.id === column.id && draggedColId !== column.id;
              return (
                <div key={column.id} className="relative shrink-0">
                  {showDrop && (
                    <div
                      className={'pointer-events-none absolute top-0 bottom-0 z-10 w-1 rounded-full bg-brand ' + (columnDropTarget.side === 'left' ? '-left-2' : '-right-2')}
                      aria-hidden="true"
                    />
                  )}
                  <BoardColumn
                    column={column}
                    tasks={columnTasks}
                    isColumnDragging={draggedColId === column.id}
                    onOpenTask={(task) => openDetail({ type: 'task', id: task.id })}
                    onOpenColumnSettings={() => openDetail({ type: 'column', id: column.id })}
                    onAddCard={() => openComposer(column.id)}
                    onColumnDragStart={() => handleColumnDragStart(column.id)}
                    onColumnDragOver={(e) => handleColumnDragOver(e, column.id)}
                    onColumnDrop={handleColumnDrop}
                    onColumnDragEnd={handleColumnDragEnd}
                  />
                </div>
              );
            })}
            <button type="button" onClick={handleAddColumn} className="flex h-full w-72 shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line-subtle text-[12px] font-medium text-ink-faint transition-colors hover:border-brand hover:text-brand">
              <Plus className="h-4 w-4" />
              Add column
            </button>
          </div>
          <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
            {activeTask ? <div className="w-72 rotate-2 cursor-grabbing"><BoardCardVisual task={activeTask} /></div> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20 md:pt-24" onClick={closeComposer} role="presentation">
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <TaskForm onClose={closeComposer} />
          </div>
        </div>
      )}
    </div>
  );
}