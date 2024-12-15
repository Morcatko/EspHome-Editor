FROM --platform=$BUILDPLATFORM node:current-alpine AS builder 
WORKDIR /build

 #COPY .npmrc ./
COPY .eslintrc.json ./
COPY next-env.d.ts ./
COPY next.config.ts ./
COPY package.json ./
COPY postcss.config.mjs ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./
COPY yarn.lock ./

RUN yarn --frozen-lockfile

COPY src ./src
RUN yarn test run
RUN yarn build

FROM node:current-alpine AS run

WORKDIR /app
COPY examples /app/work-folder/devices
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
CMD HOSTNAME="0.0.0.0" node server.js
#ENTRYPOINT [ "node", "server.js" ]