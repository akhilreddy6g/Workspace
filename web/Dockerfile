FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite replaces VITE_* values in the browser bundle during this build.
ARG VITE_SERVER_API
ENV VITE_SERVER_API=$VITE_SERVER_API
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

RUN npm install --global serve@14.2.4

COPY --from=build /app/build ./build

ENV PORT=5173
EXPOSE 5173

# Render provides PORT at runtime. The local fallback keeps docker-compose working.
CMD ["sh", "-c", "serve -s build -l ${PORT:-5173}"]
