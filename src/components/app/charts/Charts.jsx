export function BarChart({ data, height = 160, color = 'var(--accent)', valueKey = 'value', labelKey = 'label' }) {
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height: height + 20 }}>
      {data.map((d, i) => {
        const v = d[valueKey] || 0;
        const h = (v / max) * height;
        return (
          <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div className="flex w-full flex-1 items-end" style={{ height }}>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: Math.max(h, v > 0 ? 4 : 0),
                  backgroundColor: color,
                  opacity: v > 0 ? 0.9 : 0.2,
                }}
                title={String(v)}
              />
            </div>
            <span className="w-full truncate text-center text-[10px] text-ink-faint">
              {d[labelKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function PieChart({ data, size = 160 }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  let cumulative = 0;
  const slices = data.map((d, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += d.value || 0;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const path = d.value === 0 ? '' : `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
    return { path, color: d.color, label: d.label, value: d.value, key: d.key || i };
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {slices.map((s) => (
          <path key={s.key} d={s.path} fill={s.color} opacity={0.9} />
        ))}
      </svg>
      <ul className="w-full space-y-1">
        {slices.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-[11px]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="min-w-0 flex-1 truncate text-ink-muted">{s.label}</span>
            <span className="shrink-0 tabular-nums text-ink">{s.value}</span>
            <span className="w-10 shrink-0 text-right tabular-nums text-ink-faint">
              {Math.round(((s.value || 0) / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LineChart({ data, height = 160, color = 'var(--accent)', valueKey = 'value' }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  const w = 100;
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * w,
    y: 100 - ((d[valueKey] || 0) / max) * 100,
  }));
  const line = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const fill = line + ` L${w},100 L0,100 Z`;
  return (
    <svg
      viewBox={`0 0 ${w} 100`}
      preserveAspectRatio="none"
      style={{ width: '100%', height }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="line-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#line-grad)" />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}