import 'server-only';

import { clsx } from 'clsx/lite';

export default function LoadDiffIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={clsx('octicon', className)}
      display="inline-block"
      fill="currentColor"
      focusable="false"
      height="84"
      overflow="visible"
      viewBox="0 0 340 84"
      width="340"
    >
      <rect height="11.9298746" rx="2" width="67.0175439" x="0" y="0" />
      <rect
        height="11.9298746"
        rx="2"
        width="100.701754"
        x="18.9473684"
        y="47.7194983"
      />
      <rect height="11.9298746" rx="2" width="37.8947368" x="0" y="71.930126" />
      <rect
        height="11.9298746"
        rx="2"
        width="53.3333333"
        x="127.017544"
        y="48.0703769"
      />
      <rect
        height="11.9298746"
        rx="2"
        width="72.9824561"
        x="187.719298"
        y="48.0703769"
      />
      <rect
        height="11.9298746"
        rx="2"
        width="140.350877"
        x="76.8421053"
        y="0"
      />
      <rect
        height="11.9298746"
        rx="2"
        width="140.350877"
        x="17.8947368"
        y="23.8597491"
      />
      <rect
        height="11.9298746"
        rx="2"
        width="173.684211"
        x="166.315789"
        y="23.8597491"
      />
    </svg>
  );
}
