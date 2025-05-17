FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Expose port 5000
EXPOSE 5000

# Run the application
CMD ["npm", "start"]
