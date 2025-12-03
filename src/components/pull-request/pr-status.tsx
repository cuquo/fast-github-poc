import 'server-only';

import { clsx } from 'clsx/lite';

import GitCloseIcon from '@/icons/git-close-icon';
import GitMergeIcon from '@/icons/git-merge-icon';
import GitOpenIcon from '@/icons/git-open-icon';

export default function PRStatus({
  className,
  state,
}: {
  className?: string;
  state: 'open' | 'closed' | 'merged';
}) {
  return (
    <div
      className={clsx(
        'border-(length:--borderWidth-thin) flex h-7.5 w-fit select-none items-center rounded-full px-3 font-medium capitalize',
        state === 'merged' && 'border-[#8957e5] bg-[#8957e5]',
        state === 'open' && 'border-[#238636] bg-[#238636]',
        state === 'closed' && 'border-[#da3633] bg-[#da3633]',
        className,
      )}
    >
      {state === 'merged' && (
        <GitMergeIcon className="mr-1 inline-block h-4 w-4 fill-fg-default" />
      )}
      {state === 'open' && (
        <GitOpenIcon className="mr-1 inline-block h-4 w-4 fill-fg-default" />
      )}
      {state === 'closed' && (
        <GitCloseIcon className="mr-1 inline-block h-4 w-4 fill-fg-default" />
      )}
      {state}
    </div>
  );
}
