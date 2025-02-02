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

# Create env-config.js template
RUN echo "window.env = {" > /usr/share/nginx/html/env-config.template.js && \
    echo "  VITE_N8N_WEBHOOK_URL: \"__VITE_N8N_WEBHOOK_URL__\"," >> /usr/share/nginx/html/env-config.template.js && \
    echo "  VITE_WELCOME_MESSAGE: \"__VITE_WELCOME_MESSAGE__\"" >> /usr/share/nginx/html/env-config.template.js && \
    echo "};" >> /usr/share/nginx/html/env-config.template.js

# Create a script to replace environment variables
RUN echo '#!/bin/sh\n\
    # Replace environment variables in env-config.js\n\
    envsubst "$(printf \"$%s \" $(env | cut -d= -f1))" < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js\n\
    \n\
    # Start nginx\n\
    nginx -g "daemon off;"' > /docker-entrypoint.sh \
    && chmod +x /docker-entrypoint.sh

# Install envsubst
RUN apt-get update && apt-get install -y gettext-base && rm -rf /var/lib/apt/lists/*

# Expose port 80
EXPOSE 80

# Start nginx with our custom entrypoint script
CMD ["/docker-entrypoint.sh"]