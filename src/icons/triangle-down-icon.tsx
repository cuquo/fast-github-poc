import 'server-only';

import { clsx } from 'clsx/lite';

export default function TriangleDownIcon({
  className,
}: {
  className?: string;
}) {
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
      <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
    </svg>
  );
}
