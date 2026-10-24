function FilterDropdown({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <select
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="input cursor-pointer"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function FilterPanel({ filters, onChange, onClear }) {
  const hasAny = filters.status || filters.category || filters.priority;

  const setField = (field, value) => onChange({ ...filters, [field]: value });

  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FilterDropdown
          id="filter-status"
          label="Status"
          value={filters.status}
          onChange={(v) => setField('status', v)}
          options={[
            { value: 'todo', label: 'To-do' },
            { value: 'doing', label: 'Doing' },
            { value: 'done', label: 'Done' },
          ]}
        />
        <FilterDropdown
          id="filter-category"
          label="Category"
          value={filters.category}
          onChange={(v) => setField('category', v)}
          options={[
            { value: 'work', label: 'Work' },
            { value: 'personal', label: 'Personal' },
            { value: 'study', label: 'Study' },
          ]}
        />
        <FilterDropdown
          id="filter-priority"
          label="Priority"
          value={filters.priority}
          onChange={(v) => setField('priority', v)}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      </div>
      {hasAny && (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 text-[12px] font-medium text-brand transition-colors hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}