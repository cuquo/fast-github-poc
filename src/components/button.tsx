'use client';

export default function ButtonTop() {
  return (
    <button
      className="flex h-7 items-center rounded-(--borderRadius-medium)! px-2 hover:bg-bg-neutral-muted"
      onClick={() =>
        document.documentElement.scrollTo({ behavior: 'smooth', top: 0 })
      }
      type="button"
    >
      <span>
        <svg
          aria-hidden="true"
          className="mr-1 fill-fg-muted"
          fill="currentColor"
          focusable="false"
          height="16"
          overflow="visible"
          viewBox="0 0 16 16"
          width="16"
        >
          <path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0Z"></path>
        </svg>
      </span>
      <span className="font-medium! text-fg-default text-xs!">Top</span>
    </button>
  );
}
