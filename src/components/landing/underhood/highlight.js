const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'await', 'async',
  'import', 'from', 'export', 'new', 'if', 'else', 'for', 'while',
  'class', 'extends', 'typeof', 'in', 'of', 'try', 'catch', 'finally',
  'throw', 'default', 'true', 'false', 'null', 'undefined',
]);

const PUNCT = new Set([
  '{', '}', '(', ')', '[', ']', ';', ',', '.', '=', ':', '<', '>',
  '|', '&', '!', '+', '-', '*', '/', '?',
]);

export function tokenize(line) {
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    const c = line[i];

    if (c === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), type: 'comment' });
      break;
    }

    if (c === '"' || c === "'" || c === '`') {
      const q = c;
      let j = i + 1;
      while (j < line.length && line[j] !== q) {
        if (line[j] === '\\') j++;
        j++;
      }
      j = Math.min(j + 1, line.length);
      tokens.push({ text: line.slice(i, j), type: 'string' });
      i = j;
      continue;
    }

    if (/\d/.test(c)) {
      let j = i;
      while (j < line.length && /[\d_]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: 'number' });
      i = j;
      continue;
    }

    if (/[a-zA-Z_$]/.test(c)) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      tokens.push({
        text: word,
        type: KEYWORDS.has(word) ? 'keyword' : 'plain',
      });
      i = j;
      continue;
    }

    if (/\s/.test(c)) {
      let j = i;
      while (j < line.length && /\s/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: 'plain' });
      i = j;
      continue;
    }

    tokens.push({ text: c, type: PUNCT.has(c) ? 'punct' : 'plain' });
    i++;
  }
  return tokens;
}

export const TYPE_COLOR = {
  keyword: 'text-[#C792EA]',
  string: 'text-[#A5D6A7]',
  number: 'text-[#F5A524]',
  comment: 'text-ink-faint italic',
  punct: 'text-ink-muted',
  plain: 'text-ink',
};

export function clipTokens(tokens, budget) {
  if (budget <= 0) return [];
  const out = [];
  let used = 0;
  for (const t of tokens) {
    if (used + t.text.length <= budget) {
      out.push(t);
      used += t.text.length;
    } else {
      const remaining = budget - used;
      if (remaining > 0) out.push({ text: t.text.slice(0, remaining), type: t.type });
      break;
    }
  }
  return out;
}
