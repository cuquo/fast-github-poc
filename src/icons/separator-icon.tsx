import 'server-only';

import { clsx } from 'clsx/lite';

export default function SeparatorIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={clsx('octicon', className)}
      display="inline-block"
      fill="currentColor"
      focusable="false"
      height="16"
      overflow="visible"
      viewBox="0 0 16 16"
      width="16"
    >
      <path d="M10.956 1.27994L6.06418 14.7201L5 14.7201L9.89181 1.27994L10.956 1.27994Z" />
    </svg>
  );
}
