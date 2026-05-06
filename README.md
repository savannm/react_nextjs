This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

**GOOGLE ANALYTICS**
END POINTS: POST https://analyticsdata.googleapis.com/v1beta/{property=properties/*}:runReport
*MORE RESOURCE HERE: https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties

- lib/Analytics.ts functions gets passed to  /GoogleAnalytics/page.tsx.
- components in /GoogleAnalytics/components -> to /googleAnalytics/components/dashbaord.tsx -> /GoogleAnalytics/page.tsx
- visualisation module uses: recharts
