# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using NGINX
FROM nginx:stable-alpine

# Set the working directory in NGINX
WORKDIR /usr/share/nginx/html

# Remove the default NGINX configuration
RUN rm -rf ./*

# Copy the static export files from the builder stage
COPY --from=builder /app/out .

# Copy a custom NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
