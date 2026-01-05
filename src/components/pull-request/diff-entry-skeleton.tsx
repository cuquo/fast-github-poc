import 'server-only';

import { clsx } from 'clsx/lite';

import ChevronDownIconMedium from '@/icons/chevron-down-icon-medium';

export default function DiffEntrySkeleton({
  numberOfPendingRows = 0,
}: {
  numberOfPendingRows?: number;
}) {
  return (
    <section className="diffBlock -mt-1 -ml-1 flex w-[calc(100%+8px)] shrink-0 scroll-mt-20 bg-bg-default px-1 pt-1 contain-content lg:w-[calc(100%+8px)] lg:scroll-mt-18">
      <div className="difWrapper relative mb-4 flex w-full flex-col">
        <header className="diffHeader sticky top-14.75 z-1 flex min-h-10.5 border border-border-default bg-bg-muted py-1.25 pr-4 pl-2 text-neutral-400 text-xs">
          <div className="grid w-full grid-cols-[28px_auto] grid-rows-[28px_21px] gap-x-1 gap-y-0.5 sm:grid-cols-[28px_auto_auto] sm:grid-rows-[28px]">
            <div className="w-full">
              <div className="collapse-diff-button mt-px flex size-7 shrink-0 select-none items-center justify-center rounded-(--borderRadius-medium)">
                <ChevronDownIconMedium className="size-4 fill-fg-muted" />
              </div>
            </div>
            <div className="sm:col-start-3">
              <div className="mask-l-from-50% mask-l-to-95% flex h-full w-full items-center justify-end pl-1 sm:mt-0.5">
                <span className="flex gap-1 font-semibold text-xs">
                  <span className="h-3.5 w-5 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                </span>
              </div>
            </div>
            <div className="col-span-full w-full min-w-0 sm:col-[2/3] sm:row-[1/2]">
              <div className="ml-1 flex h-full items-center text-fg-default! sm:ml-0">
                <span className="h-3.5 w-35 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
              </div>
            </div>
          </div>
        </header>
        <div className="fakeBorder absolute top-0 z-2 flex h-1.5 w-full overflow-hidden bg-bg-default pt-0">
          <div className="flex h-2 w-full rounded-t-(--borderRadius-medium) border border-border-default border-b-0 bg-bg-muted" />
        </div>
        <div className="diffContent rounded-b-(--borderRadius-medium) border border-border-default border-t-0 contain-content">
          <table className="diff-table w-full min-w-full table-fixed">
            <colgroup>
              <col width={40} />
              <col />
              <col width={40} />
              <col />
            </colgroup>
            <tbody>
              <tr className="h-6 leading-6">
                <td colSpan={4} valign="top">
                  <div className="flex w-full">
                    <span className="flex w-10 shrink-0 items-center justify-center bg-[#0c2d6b]">
                      <span className="size-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                    </span>
                    <span className="flex h-6 w-full select-none items-center bg-[#131D2E] px-6 font-mono text-fg-muted text-xs">
                      <span className="h-3 w-40 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                      &nbsp;
                    </span>
                  </div>
                </td>
              </tr>
              {/* lines */}
              <tr className="leading-6">
                <td className="w-[1%] min-w-3 select-none" tabIndex={-1}>
                  <div className="flex w-full items-center justify-center">
                    <span className="h-3.5 w-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  </div>
                </td>
                <td className="border-r-(length:--borderWidth-thin) relative border-border-default">
                  <div className="diff-code diff-code-left wrap-break-word h-6 px-6 leading-6">
                    <div className="flex h-6 w-full items-center">
                      <span className="block h-3 w-14 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted sm:w-50" />
                    </div>
                  </div>
                </td>
                <td className="w-[1%] min-w-13 select-none">
                  <div className="flex w-full items-center justify-center">
                    <span className="h-3.5 w-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  </div>
                </td>
                <td className="relative" valign="top">
                  <div className="diff-code wrap-break-word diff-code-right px-6 leading-6">
                    <div className="flex h-6 w-full items-center">
                      <span className="h-3 w-30 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                    </div>
                  </div>
                </td>
              </tr>
              {/* lines 2 */}
              <tr className="leading-6">
                <td className="w-[1%] min-w-3 select-none">
                  <div className="flex w-full items-center justify-center">
                    <span className="h-3.5 w-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  </div>
                </td>
                <td className="border-r-(length:--borderWidth-thin) relative border-border-default">
                  <div className="diff-code diff-code-left wrap-break-word h-6 px-6 leading-6">
                    <div className="flex h-6 w-full items-center">
                      <span className="block h-3 w-30 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                    </div>
                  </div>
                </td>
                <td className="w-[1%] min-w-13 select-none">
                  <div className="flex w-full items-center justify-center">
                    <span className="h-3.5 w-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  </div>
                </td>
                <td className="relative" valign="top">
                  <div className="diff-code wrap-break-word diff-code-right px-6 leading-6">
                    <div className="flex h-6 w-full items-center">
                      <span className="h-3 w-15 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted sm:w-50" />
                    </div>
                  </div>
                </td>
              </tr>
              {/* line 3 */}
              <tr className="leading-6">
                <td className="w-[1%] min-w-3 select-none" />
                <td className="border-r-(length:--borderWidth-thin) relative border-border-default">
                  <div className="diff-code diff-code-left wrap-break-word h-6 px-6 leading-6" />
                </td>
                <td className="w-[1%] min-w-13 select-none">
                  <div className="flex w-full items-center justify-center">
                    <span className="h-3.5 w-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  </div>
                </td>
                <td className="relative" valign="top">
                  <div className="diff-code wrap-break-word diff-code-right px-6 leading-6">
                    <div className="flex h-6 w-full items-center">
                      <span className="h-3 w-20 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted sm:w-15" />
                    </div>
                  </div>
                </td>
              </tr>
              {/* lines 4 */}
              <tr className="leading-6">
                <td className="w-[1%] min-w-3 select-none" tabIndex={-1}>
                  <div className="flex w-full items-center justify-center">
                    <span className="h-3.5 w-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  </div>
                </td>
                <td className="border-r-(length:--borderWidth-thin) relative border-border-default">
                  <div className="diff-code diff-code-left wrap-break-word h-6 px-6 leading-6">
                    <div className="flex h-6 w-full items-center">
                      <span className="block h-3 w-14 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted sm:w-50" />
                    </div>
                  </div>
                </td>
                <td className="w-[1%] min-w-13 select-none" />
                <td className="relative" valign="top">
                  <div className="diff-code wrap-break-word diff-code-right px-6 leading-6">
                    <div className="flex h-6 w-full items-center" />
                  </div>
                </td>
              </tr>
              {/* lines 5 */}
              <tr className="leading-6">
                <td className="w-[1%] min-w-3 select-none" tabIndex={-1}>
                  <div className="flex w-full items-center justify-center">
                    <span className="h-3.5 w-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  </div>
                </td>
                <td className="border-r-(length:--borderWidth-thin) relative border-border-default">
                  <div className="diff-code diff-code-left wrap-break-word h-6 px-6 leading-6">
                    <div className="flex h-6 w-full items-center">
                      <span className="block h-3 w-20 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted sm:w-30" />
                    </div>
                  </div>
                </td>
                <td className="w-[1%] min-w-13 select-none">
                  <div className="flex w-full items-center justify-center">
                    <span className="h-3.5 w-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  </div>
                </td>
                <td className="relative" valign="top">
                  <div className="diff-code wrap-break-word diff-code-right px-6 leading-6">
                    <div className="flex h-6 w-full items-center">
                      <span className="h-3 w-8 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted sm:w-60" />
                    </div>
                  </div>
                </td>
              </tr>
              {numberOfPendingRows > 0 &&
                Array.from({ length: numberOfPendingRows }).map((_, idx) => (
                  <tr
                    className="leading-6"
                    key={`pending-row-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: fake rows
                      idx
                    }`}
                  >
                    <td className="w-[1%] min-w-3 select-none">
                      <div className="flex w-full items-center justify-center">
                        <span className="h-3.5 w-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                      </div>
                    </td>
                    <td className="border-r-(length:--borderWidth-thin) relative border-border-default">
                      <div className="diff-code diff-code-left wrap-break-word h-6 px-6 leading-6">
                        <div className="flex h-6 w-full items-center">
                          <span
                            className={clsx(
                              'block h-3 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted',
                              idx % 2 === 0 ? 'w-30' : 'w-15',
                            )}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="w-[1%] min-w-13 select-none">
                      <div className="flex w-full items-center justify-center">
                        <span className="h-3.5 w-4 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                      </div>
                    </td>
                    <td className="relative" valign="top">
                      <div className="diff-code wrap-break-word diff-code-right px-6 leading-6">
                        <div className="flex h-6 w-full items-center">
                          <span
                            className={clsx(
                              'h-3 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted',
                              idx % 2 === 0 ? 'w-20 sm:w-50' : 'w-10 sm:w-30',
                            )}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
