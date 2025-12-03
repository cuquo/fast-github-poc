/** biome-ignore-all lint/suspicious/noArrayIndexKey: testing */
import 'server-only';

const NUM_BLOCKS = 10;
const MIN_ROWS = 3;
const MAX_ROWS = 33;
const MAX_NUMBER_OF_LINES = 3;

// Approximate line height in px for table rows
const LINE_HEIGHT_PX = 20;
// Extra padding, borders, etc.
const VERTICAL_PADDING_PX = 16;

type Block = {
  id: number;
  rows: number;
  estimatedHeight: number;
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBlocks(): Block[] {
  const blocks: Block[] = [];

  for (let i = 0; i < NUM_BLOCKS; i += 1) {
    const rows = randomInt(MIN_ROWS, MAX_ROWS);
    const estimatedHeight = rows * LINE_HEIGHT_PX + VERTICAL_PADDING_PX;

    blocks.push({
      estimatedHeight,
      id: i,
      rows,
    });
  }

  return blocks;
}

async function BlockTable({ block }: { block: Block }) {
  'use cache';

  return (
    <section
      className="px-4"
      style={{
        // inline-size auto, block-size estimatedHeight
        // containIntrinsicSize: `auto ${block.estimatedHeight}px`,
        contentVisibility: block.id < 3 ? 'auto' : 'hidden',
      }}
    >
      <div
        className="ccontain-[layout_paint_style] relative mb-6 flex w-full flex-col"
        id={`chunk-${block.id + 1}`}
      >
        <header className="sticky top-0 z-1 flex h-[42px] items-center justify-between border border-border-default border-t-0 bg-bg-muted px-4 py-2 text-neutral-400 text-xs">
          <span>{`Chunk #${block.id + 1}`}</span>
          <span>{`${block.rows} rows · est. ${block.estimatedHeight}px`}</span>
        </header>
        <div className="absolute top-0 z-2 flex h-2 w-full overflow-hidden bg-bg-default pt-0">
          <div className="flex h-2 w-full rounded-t-(--borderRadius-medium) border border-border-default border-b-0 bg-bg-muted"></div>
        </div>

        <div className="@container contain-[layout_paint_style] rounded-b-(--borderRadius-medium) border border-border-default border-t-0">
          <table className="w-full min-w-full table-fixed">
            {/* <colgroup>
              <col width="40" />
              <col />
              <col width="40" />
              <col />
            </colgroup> */}
            {/* <thead className="wrap-normal absolute h-px w-px overflow-hidden border-0 p-0 [clip-path:inset(0)]">
              <tr>
                <th scope="col">Original file line number</th>
                <th scope="col">Original file line</th>
                <th scope="col">Diff line number</th>
                <th scope="col">Diff line change</th>
              </tr>
            </thead> */}
            <tbody>
              {Array.from({ length: block.rows }).map((_, idx) => {
                const numberOfLines = randomInt(1, MAX_NUMBER_OF_LINES);

                return (
                  <tr className="h-6 leading-6" key={idx}>
                    <td tabIndex={-1} valign="top" />
                    <td tabIndex={-1} valign="top" />
                    <td
                      className="w-[1%] min-w-12.5 text-center align-center text-xs"
                      tabIndex={-1}
                      valign="top"
                    >
                      <code className="font-mono leading-6">{idx + 1}</code>
                    </td>
                    <td className="px-3 align-top" tabIndex={-1} valign="top">
                      {/* Random-ish content to make wrapping visible */}
                      {
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
                      }
                      {numberOfLines >= 2 &&
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor'}
                      {numberOfLines === 3 &&
                        'Lorem ipsum dolor sit amet, consectetur adipiscing chale.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default async function Page() {
  'use cache';
  const blocks = generateBlocks();

  return (
    <>
      <link
        href="/assets/syntax-highlighting.css"
        precedence="medium"
        rel="stylesheet"
      />
      <main className="flex w-full">
        <aside className="border-r-(length:--borderWidth-thin) sticky top-0 hidden h-screen w-80 shrink-0 border-border-default lg:block">
          <div className="block w-full">
            <div className="contain-[layout_paint_style] h-screen overflow-y-auto bg-bg-canvas [scrollbar-gutter:stable]">
              <div className="my-2 w-full px-4">
                <ul className="w-full">
                  <li className="w-full">
                    <a
                      className="hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) pl-6 text-fg-default! hover:bg-bg-neutral-muted!"
                      href="#chunk-1"
                    >
                      File 1
                    </a>
                  </li>
                  <li className="w-full">
                    <a
                      className="hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) pl-6 text-fg-default! hover:bg-bg-neutral-muted!"
                      href="#chunk-40"
                    >
                      File 40
                    </a>
                  </li>
                  <li className="w-full">
                    <a
                      className="hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) pl-6 text-fg-default! hover:bg-bg-neutral-muted!"
                      href="#chunk-100"
                    >
                      File 100
                    </a>
                  </li>
                  <li className="w-full">
                    <a
                      className="hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) pl-6 text-fg-default! hover:bg-bg-neutral-muted!"
                      href="#chunk-200"
                    >
                      File 200
                    </a>
                  </li>
                  <li className="w-full">
                    <a
                      className="hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) pl-6 text-fg-default! hover:bg-bg-neutral-muted!"
                      href="#chunk-300"
                    >
                      File 300
                    </a>
                  </li>
                  <li className="w-full">
                    <a
                      className="hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) pl-6 text-fg-default! hover:bg-bg-neutral-muted!"
                      href="#chunk-400"
                    >
                      File 400
                    </a>
                  </li>
                  <li className="w-full">
                    <a
                      className="hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) pl-6 text-fg-default! hover:bg-bg-neutral-muted!"
                      href="#chunk-1000"
                    >
                      File 1000
                    </a>
                  </li>
                  <li className="w-full">
                    <a
                      className="hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) pl-6 text-fg-default! hover:bg-bg-neutral-muted!"
                      href="#chunk-2000"
                    >
                      File 2000
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
        <div className="mb-8 flex w-full min-w-0 flex-col">
          <header className="w-full p-4">
            <h1 className="font-semibold text-2xl text-neutral-50">
              CLS playground
            </h1>
            <p className="mt-2 max-w-2xl text-neutral-400 text-sm">
              Server-rendered fake tables with{' '}
              <code>content-visibility: auto</code> and{' '}
              <code>contain-intrinsic-size</code> based on an estimated number
              of rows. Resize the window, hard-reload, and observe how much
              layout shift you get with different estimations.
            </p>
          </header>

          {blocks.map((block) => (
            <BlockTable block={block} key={block.id} />
          ))}
        </div>
      </main>
    </>
  );
}
