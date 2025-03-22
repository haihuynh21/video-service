FROM node:18-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
