FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

RUN apk add --no-cache git
RUN git clone https://github.com/mintlify/mint.git

WORKDIR /mint/client
# Install dependencies
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder

COPY --from=deps /mint/client ./client

# Copy docs
COPY . /docs

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /client

# Preconfigure mint client and build
RUN yarn preconfigure ../docs
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /client/package.json ./
COPY --from=builder /client/next.config.js ./
COPY --from=builder /client/public ./public
COPY --from=builder /client/.next ./.next
COPY --from=builder /client/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000
CMD ["node_modules/.bin/next", "start"]
