import 'server-only';

import { clsx } from 'clsx/lite';

export default function DirectoryIcon({ className }: { className?: string }) {
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
      <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
    </svg>
  );
}
