import 'server-only';

import { clsx } from 'clsx/lite';

import ArrowRightIcon from '@/icons/arrow-right-icon';
import ChevronDownIconMedium from '@/icons/chevron-down-icon-medium';
import { numberFormatter } from '@/utils/number-formatter';

export default function DiffEntryWrapper({
  additions,
  aproximateHeight,
  children,
  deletions,
  filename,
  id,
  inputId,
  previous_filename,
  shouldNotRender,
}: {
  additions: number;
  aproximateHeight: number;
  children: React.ReactNode;
  deletions: number;
  filename: string;
  id: string;
  inputId: string;
  previous_filename?: string;
  shouldNotRender: boolean;
}) {
  return (
    <>
      <input
        className="collapse-diff-state hidden"
        id={inputId}
        type="checkbox"
      />
      <section
        className="diffBlock -mt-1 -ml-1 flex w-[calc(100%+8px)] scroll-mt-20 bg-bg-default px-1 pt-1 contain-content lg:w-[calc(100%+8px)] lg:scroll-mt-18"
        id={id}
        {...(!shouldNotRender && {
          style: {
            containIntrinsicSize: `auto ${aproximateHeight}px`,
            contentVisibility: 'auto',
          },
        })}
      >
        <div className="difWrapper relative mb-4 flex w-full flex-col">
          <header className="diffHeader sticky top-14.75 z-1 flex min-h-10.5 border border-border-default bg-bg-muted py-1.25 pr-4 pl-2 text-neutral-400 text-xs">
            <div
              className={clsx(
                'grid w-full grid-cols-[28px_auto] gap-x-1 gap-y-0.5 sm:grid-cols-[28px_auto_auto]',
                previous_filename
                  ? 'grid-rows-[28px_auto] sm:grid-rows-[auto]'
                  : 'grid-rows-[28px_21px] sm:grid-rows-[28px]',
              )}
            >
              <div className="w-full">
                <label
                  className="collapse-diff-button mt-px flex size-7 shrink-0 cursor-pointer select-none items-center justify-center rounded-(--borderRadius-medium) hover:bg-[#252B34]!"
                  htmlFor={inputId}
                >
                  <ChevronDownIconMedium className="size-4 fill-fg-muted" />
                </label>
              </div>
              <div className="sm:col-start-3">
                <div className="mask-l-from-50% mask-l-to-95% flex h-full w-full items-center justify-end pl-1 sm:mt-0.5">
                  <span className="flex gap-1 font-semibold text-xs">
                    {additions > 0 && (
                      <span className="text-[#3fb950]">
                        +{numberFormatter.format(additions) ?? 0}
                      </span>
                    )}
                    {deletions > 0 && (
                      <span className="text-[#f85149]">
                        -{numberFormatter.format(deletions) ?? 0}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <div className="col-span-full w-full min-w-0 sm:col-[2/3] sm:row-[1/2]">
                <a
                  className="ml-1 inline-grid h-full items-center text-fg-default! hover:text-fg-accent! sm:ml-0"
                  href={`#${id}`}
                >
                  <h3
                    className={clsx(
                      'font-mono font-normal! text-xs!',
                      previous_filename
                        ? 'inline-flex w-full flex-wrap leading-5!'
                        : 'mt-1! truncate [direction:rtl]',
                    )}
                  >
                    {previous_filename ? (
                      <>
                        <span className="truncate [direction:rtl] sm:max-w-[45%]">
                          {previous_filename}
                        </span>
                        <span className="mx-2 flex shrink-0 items-center">
                          <ArrowRightIcon />
                        </span>
                        <span className="truncate [direction:rtl] sm:max-w-[45%]">
                          {'\u200E'}
                          {filename}
                          {'\u200E'}
                        </span>
                      </>
                    ) : (
                      <>
                        {'\u200E'}
                        {filename}
                        {'\u200E'}
                      </>
                    )}
                  </h3>
                </a>
              </div>
            </div>
          </header>
          <div className="fakeBorder absolute top-0 z-2 flex h-1.5 w-full overflow-hidden bg-bg-default pt-0">
            <div className="flex h-2 w-full rounded-t-(--borderRadius-medium) border border-border-default border-b-0 bg-bg-muted" />
          </div>
          <div className="diffContent rounded-b-(--borderRadius-medium) border border-border-default border-t-0 contain-content">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
