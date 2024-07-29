## MVP

http://find-cheap-climbing-shoes.surge.sh/

### Run locally

create `.env.production` with production value of environment variables

#### Proxy Server

```
cd server
pnpm install
pnpm start
or
pnpm run server (from base directory)
```

#### UI

```
cd ..
pnpm install
pnpm dev
pnpm dev:host # with exposure in local network
```

### Stuff

- `src/utils.ts` contains proxy function
- version is visible in dev console
- `server/index.js` proxy server

### Nice to have

- add rating from https://www.outdoorgearlab.com/reviews/climbing
- add rating from https://www.climbingshoereview.com/black-diamond-shadow-review/
- expand images on click or double click
- add bananafingers data - GBP?
- add gandrs data?
- storybook (screenshot tests)

## How to add new service:

- copy existing service i.e. fetchOliunid
- add service to Search.tsx
- add mock service data and mock support to utils.ts

## How to deploy:

N.B. `.env.production` should exist with correct endpoint

- pnpm version patch
- pnpm build
- pnpm surge:deploy

## In case of prod error deploy "Under Construction" placeholder page

- pnpm surge:deployUnderConstruction
