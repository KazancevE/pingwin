FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2 - Serve with nginx in production, but for now use simple server
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/build ./build

# Install serve to serve static files
RUN npm install -g serve

EXPOSE 3001

CMD ["serve", "-s", "build", "-l", "3001"]