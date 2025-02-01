# Build stage
FROM node:22.13.1 as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:latest

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to replace environment variables
RUN echo '#!/bin/sh\n\
    envsubst "\$VITE_N8N_WEBHOOK_URL \$VITE_WELCOME_MESSAGE" < /usr/share/nginx/html/env-config.js > /usr/share/nginx/html/env-config.js.tmp\n\
    mv /usr/share/nginx/html/env-config.js.tmp /usr/share/nginx/html/env-config.js\n\
    nginx -g "daemon off;"' > /docker-entrypoint.sh \
    && chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Start nginx with our custom entrypoint script
CMD ["/docker-entrypoint.sh"]