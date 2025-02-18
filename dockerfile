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
COPY public ./public
RUN yarn test run
RUN yarn build

FROM node:current-alpine AS run

WORKDIR /app
COPY examples /app/work-folder/devices
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/public ./public

EXPOSE 3000
ENV PORT=3000
CMD HOSTNAME="0.0.0.0" node server.js