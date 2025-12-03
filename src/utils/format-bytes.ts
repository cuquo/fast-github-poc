export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 Bytes';

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;
  let i = 0;
  let value = bytes;

  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }

  if (i === 0) {
    const label = value === 1 ? 'Byte' : 'Bytes';
    return `${value} ${label}`;
  }

  const out = value.toFixed(2).replace(/\.?0+$/, '');
  return `${out} ${units[i]}`;
}
