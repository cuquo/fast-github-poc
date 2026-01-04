import 'server-only';

import CodeIcon from '@/icons/code-icon';
import CommentIcon from '@/icons/comment-icon';
import SidebarCollapseIcon from '@/icons/sidebar-collapse-icon';
import SidebarExpandIcon from '@/icons/sidebar-expand-icon';
import TriangleDownIcon from '@/icons/triangle-down-icon';

import DiffEntrySkeleton from './diff-entry-skeleton';
import PullSidebarSkeleton from './pull-sidebar-skeleton';

export default function PullRequestSkeleton() {
  return (
    <>
      <input
        className="show-sidebar-state hidden"
        defaultChecked
        id="show-sidebar"
        type="checkbox"
      />
      <div className="sticky z-10 w-full px-4 pt-6 md:px-6 lg:px-8">
        <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="order-2 mb-2! md:order-1">
            <div className="mt-2 h-7 w-75 animate-pulse rounded-(--borderRadius-medium) bg-bg-neutral-muted sm:mt-1 sm:h-9.5 sm:w-130" />
          </h1>
          <div className="border-(length:--borderWidth-thin) order-1 mb-6 flex h-7 shrink-0 items-center self-start rounded-(--borderRadius-medium) border-[#3d444d] bg-[#212830] px-2 md:order-2 md:mb-0 md:ml-2 md:self-center">
            <CodeIcon className="mr-1 hidden fill-fg-muted align-text-bottom sm:inline-block" />
            <span className="select-none font-medium text-xs">Code</span>
            <TriangleDownIcon className="ml-1 inline-block fill-fg-muted align-text-bottom" />
          </div>
        </div>
        <div className="relative z-10 flex w-full flex-col bg-bg-default md:flex-row md:items-center">
          <div className="mb-2 h-7.5 w-24 animate-pulse rounded-full bg-bg-neutral-muted md:mb-0" />
          <div className="mt-0.5 h-3.5 w-80 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted sm:mt-0 sm:w-110 md:ml-2" />
          <div className="mt-1.5 mb-2 h-3.5 w-35 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted sm:hidden" />
        </div>
      </div>
      <div className="sticky z-10 bg-bg-default pt-4">
        <div className="mask-x-from-[calc(100%-16px)] mask-x-to-100% md:mask-none hide-chrome-scrollbar overflow-x-scroll md:overflow-hidden">
          <nav className="inline-flex w-full md:w-[calc(100%-24px)] lg:w-[calc(100%-32px)]">
            <div className="border-b-(length:--borderWidth-thin) ml-4 flex h-10 shrink-0 select-none items-center border-border-default px-4 md:ml-6 lg:ml-8">
              <CommentIcon className="mr-2 inline-block size-4 fill-fg-default" />
              Conversation
              <span className="border-(length:--borderWidth-thin) ml-2 animate-pulse rounded-full border-[#00000000] bg-bg-neutral-muted px-1.5 py-0.5 font-semibold text-xs leading-3">
                &nbsp;
              </span>
            </div>
            <div className="border-b-(length:--borderWidth-thin) flex h-10 shrink-0 items-center border-border-default px-4">
              <CommentIcon className="mr-2 inline-block size-4 fill-fg-default" />
              Commits
              <span className="border-(length:--borderWidth-thin) ml-2 animate-pulse rounded-full border-[#00000000] bg-bg-neutral-muted px-1.5 py-0.5 font-semibold text-xs leading-3">
                &nbsp;
              </span>
            </div>
            <div className="border-b-(length:--borderWidth-thin) flex h-10 shrink-0 select-none items-center border-border-default px-4">
              <CommentIcon className="mr-2 inline-block size-4 fill-fg-default" />
              Checks
              <span className="border-(length:--borderWidth-thin) ml-2 animate-pulse rounded-full border-[#00000000] bg-bg-neutral-muted px-1.5 py-0.5 font-semibold text-xs leading-3">
                &nbsp;
              </span>
            </div>
            <div className="border-(length:--borderWidth-thin) z-1 flex h-10 shrink-0 select-none items-center rounded-t-(--borderRadius-medium) border-border-default border-b-0 bg-bg-default px-4">
              <CommentIcon className="mr-2 inline-block size-4 fill-fg-default" />
              Files changed
              <span className="border-(length:--borderWidth-thin) ml-2 animate-pulse rounded-full border-[#00000000] bg-bg-neutral-muted px-1.5 py-0.5 font-semibold text-xs leading-3">
                &nbsp;
              </span>
            </div>
            <div className="sm:border-b-(length:--borderWidth-thin) flex h-10 min-w-4 select-none items-center border-border-default sm:flex sm:w-full">
              <div className="md:mask-l-from-50% md:mask-l-to-95% flex w-full md:justify-end">
                <span className="hidden gap-1 font-semibold text-xs md:flex">
                  <div className="h-3.5 w-12 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                </span>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="top-0 left-15 z-9 -mt-15 hidden h-15 w-0 md:sticky md:block lg:left-0">
        <div className="relative flex h-14.75 w-[calc(100vw-243px)] bg-bg-default lg:ml-17 lg:w-[calc(100vw-259px)]">
          <div className="flex h-full w-full items-center">
            <div className="mb-2 h-7.5 w-24 shrink-0 animate-pulse rounded-full bg-bg-neutral-muted md:mb-0" />
            <div className="ml-2 flex w-full min-w-0 flex-col">
              <div className="inline-flex min-w-0 max-w-full">
                <div className="h-3 w-80 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
              </div>
              <div className="flex h-5 w-full min-w-0 items-center text-xs">
                <div className="h-3 w-90 animate-pulse rounded-(--borderRadius-small) bg-bg-neutral-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="info-sticky sticky top-0 z-8 flex h-15 w-full">
        <div className="relative h-15 w-full min-w-0 md:contain-strict">
          <div className="absolute h-14.75 w-full bg-bg-default" />
          <div className="absolute bottom-0 left-4 h-px w-[calc(100%-32px)] bg-[#3d444d] md:left-6 md:w-[calc(100%-48px)] lg:left-8 lg:w-[calc(100%-64px)]" />
          <div className="relative flex h-15 w-full items-start px-4 md:h-30 md:px-6 lg:px-8">
            <div className="sticky top-0 left-0 -z-1 -mt-px block h-15 w-0">
              <div className="-ml-4 h-15 w-screen bg-[#3d444d] md:-ml-6 lg:-ml-8" />
            </div>
            <label
              className="show-sidebar-button pointer-events-none mt-4 flex size-7 shrink-0 select-none items-center justify-center rounded-(--borderRadius-medium) lg:pointer-events-auto lg:cursor-pointer lg:hover:bg-[#2D3239]!"
              htmlFor="show-sidebar"
            >
              <SidebarExpandIcon className="sidebar-expand-icon hidden fill-fg-muted lg:block" />
              <SidebarCollapseIcon className="sidebar-collapse-icon fill-fg-muted lg:hidden" />
            </label>
            <div className="border-(length:--borderWidth-thin) sticky mt-4 ml-2 flex h-7 shrink-0 transform-gpu items-center rounded-(--borderRadius-medium) border-[#3d444d] bg-[#212830] px-2 md:top-16.25">
              <span className="select-none font-medium text-xs">
                All commits
              </span>
              <TriangleDownIcon className="ml-1 inline-block fill-fg-muted align-text-bottom" />
            </div>
            <div className="mask-l-from-80% mask-l-to-100% mt-4 flex w-full justify-end">
              <div className="border-(length:--borderWidth-thin) ml-2 flex h-7 shrink-0 items-center self-center rounded-(--borderRadius-medium) border-[#238636] bg-[#238636] px-2">
                <span className="select-none font-medium text-xs">
                  Submit comments
                </span>
                <TriangleDownIcon className="ml-1 inline-block fill-fg-default align-text-bottom" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mainNav flex w-full px-4 md:px-6 lg:px-8">
        <PullSidebarSkeleton />
        <div className="prc flex w-full min-w-0 pt-4 lg:pl-4">
          <DiffEntrySkeleton />
        </div>
      </div>
    </>
  );
}
