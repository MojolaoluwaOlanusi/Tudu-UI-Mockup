import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { parseTaskText } from '@/lib/mockTasks';
import { useApp } from '@/store/AppContext';

const Composer = forwardRef(function Composer(props, ref) {
  const inputRef = useRef(null);
  const { createTask } = useApp();
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }), []);

  useEffect(() => {
    if (!text.trim()) {
      setParsed(null);
      return;
    }
    const result = parseTaskText(text);
    setParsed(result);
  }, [text]);

  const submit = () => {
    if (!text.trim()) return;
    const parsed = parseTaskText(text);
    createTask({
      title: parsed.title,
      due_date: parsed.due_date,
      category: parsed.category,
      priority: parsed.priority,
    });
    setText('');
    setParsed(null);
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
    if (e.key === 'Escape') {
      setText('');
      inputRef.current?.blur();
    }
  };

  const chips = parsed && parsed.matched.length > 0 ? parsed.matched : [];

  return (
    <div className="border-b border-line-subtle px-3 py-2.5">
      <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2">
        <Plus className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add a task... try 'Buy milk tomorrow 9am #personal'"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
        {text.trim() && (
          <kbd className="shrink-0 rounded border border-line bg-raised px-1 font-mono text-[10px] text-ink-muted">
            Enter
          </kbd>
        )}
      </div>
      {chips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {chips.map((c, i) => (
            <span
              key={i}
              className="rounded-sm border border-brand/30 bg-brand-subtle px-1.5 py-0.5 text-[10px] font-medium text-brand"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

export default Composer;