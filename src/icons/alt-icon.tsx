import 'server-only';

import { clsx } from 'clsx/lite';

export default function AltIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={clsx('octicon', className)}
      display="inline-block"
      fill="currentColor"
      focusable="false"
      height="24"
      overflow="visible"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M12 0c6.627 0 12 5.37 12 11.995 0 1.925-.454 3.744-1.26 5.357-.449-.595-1.538-2.144-3.979-1.652 1.042 1.872 1.004 3.542.592 4.252-2.435-1.132-2.435-2.785-2.435-3.916s.749-2.713.862-4.858c0-1.395-.585-3.647-2.671-4.826s-4.778-.982-6.651 0-3.02 2.984-3.02 4.826c0 1.738.273 2.596 1.45 4.522 1.175 1.926-.286 4.062-2.043 4.252q-.56-2.123 1.05-3.916c-.236 0-2.693-.673-4.625 1.336A11.94 11.94 0 0 1 0 11.995C0 5.37 5.373 0 12 0" />
    </svg>
  );
}
