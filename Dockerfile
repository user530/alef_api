# Build stage
FROM node:current-alpine3.19 as build

WORKDIR /build

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV production

# Clean install after build
RUN npm ci --omit=dev && npm cache clean --force

# Production stage
FROM node:current-alpine3.19

WORKDIR /alef_api

COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules

EXPOSE 5000

CMD ["node", "dist/src/main.js"]