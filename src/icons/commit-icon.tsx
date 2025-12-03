import 'server-only';

import { clsx } from 'clsx/lite';

export default function CommitIcon({ className }: { className?: string }) {
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
      <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
    </svg>
  );
}
