# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build && ls -la /app/dist

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
