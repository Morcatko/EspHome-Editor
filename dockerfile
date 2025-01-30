FROM --platform=$BUILDPLATFORM node:current-alpine AS builder 
WORKDIR /build

 #COPY .npmrc ./
COPY .eslintrc.json ./
COPY next-env.d.ts ./
COPY next.config.ts ./
COPY package.json ./
COPY postcss.config.mjs ./
COPY tsconfig.json ./
COPY vitest.config.ts ./
COPY yarn.lock ./

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile

COPY src ./src
RUN yarn test run
RUN yarn build

FROM node:current-alpine AS run

WORKDIR /app
COPY examples /app/work-folder/devices
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static

EXPOSE 50106
ENV PORT=50106
CMD HOSTNAME="0.0.0.0" node server.js
#ENTRYPOINT [ "node", "server.js" ]