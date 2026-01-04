export function PerformanceMarker({
  name,
  type = 'mark',
}: {
  name: string;
  type?: 'mark' | 'measure';
}) {
  const safeName = JSON.stringify(name);

  if (type === 'mark') {
    return (
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: marker
        dangerouslySetInnerHTML={{
          __html: `performance.mark(${safeName});`,
        }}
      />
    );
  }

  return null;
}
