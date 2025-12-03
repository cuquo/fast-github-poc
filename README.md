I built a fully streamed, instant-loading version of the GitHub repository view that keeps native browser search, removes the blue loading bar, and feels dramatically faster than the original.
To learn more, check the original [post](https://wtbb.vercel.app)

## Getting Started

Install the latest version of Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

Install dependencies:
```bash
bun install
```

Copy the .env.example file to .env and add your GitHub token:
```bash
cp .env.example .env
```

Run the development server:
```bash
bun dev
```
