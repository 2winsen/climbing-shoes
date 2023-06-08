## MVP

http://find-cheap-climbing-shoes.surge.sh/

### Run locally

- pnpm dev
- pnpm dev:host - with exposure in local network

### Nice to have

- add rating from https://www.outdoorgearlab.com/reviews/climbing
- add rating from https://www.climbingshoereview.com/black-diamond-shadow-review/
- expand images on click or double click
- add bananafingers data - GBP?
- add gandrs data?
- storybook (screenshot tests)
- text filter (for product name)

## How to use mocks:

- in conf.ts change USE_MOCKS to true

## How to add new service:

- copy existing service i.e. fetchOliunid
- add service to Search.tsx
- add mock service data and mock support to utils.ts

## How to deploy:

- pnpm build
- pnpm surge:deploy
