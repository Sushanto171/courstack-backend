FROM node:20-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml .npmrc ./
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile 

COPY . .

# RUN pnpm generate
RUN pnpm build

EXPOSE 5000
CMD ["pnpm", "start"]