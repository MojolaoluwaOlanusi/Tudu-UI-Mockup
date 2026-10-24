import { useParams } from 'react-router-dom';
import MarketingShell from '@/components/marketing/MarketingShell';
import DocsLayout from '@/components/docs/DocsLayout';
import { DOCS } from '@/lib/docsData';
import { H1, H2, P, UL, Code } from '@/components/marketing/Prose';

export default function DocsPage({ forcedSlug }) {
  const { slug } = useParams();
  const key = forcedSlug || slug || 'index';
  const doc = DOCS[key] || DOCS.index;

  return (
    <MarketingShell>
      <DocsLayout>
        <article className="max-w-3xl">
          <H1>{doc.title}</H1>
          <P>{doc.intro}</P>
          {doc.sections.map((sec, i) => (
            <section key={i}>
              {sec.heading && <H2>{sec.heading}</H2>}
              {sec.paragraphs && sec.paragraphs.map((p, j) => <P key={j}>{p}</P>)}
              {sec.bullets && <UL items={sec.bullets} />}
              {sec.code && <Code>{sec.code}</Code>}
            </section>
          ))}
        </article>
      </DocsLayout>
    </MarketingShell>
  );
}