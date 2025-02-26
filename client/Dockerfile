FROM node:16-alpine

# Install dependencies required for Node.js
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Use a full Vite command with explicit host setting
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]