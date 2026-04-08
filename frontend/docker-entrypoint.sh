#!/bin/sh

# Exit on error
set -e

# Function to check if a variable is set
check_env_var() {
    local var_name="$1"
    local var_value="${!var_name}"
    
    if [ -z "$var_value" ]; then
        echo "Error: Environment variable $var_name is not set"
        return 1
    fi
    return 0
}

# Check required environment variables
echo "Checking environment variables..."
check_env_var "API_URL" || exit 1

# Replace environment variables in the built files
echo "Injecting environment variables..."
find /usr/share/nginx/html -name '*.js' -o -name '*.html' -o -name '*.css' | while read file; do
    sed -i "s|__API_URL__|$API_URL|g" "$file"
    sed -i "s|__NODE_ENV__|$NODE_ENV|g" "$file"
    sed -i "s|__VERSION__|$VERSION|g" "$file"
done

# Set proper permissions
echo "Setting permissions..."
chown -R nginx:nginx /usr/share/nginx/html
chmod -R 755 /usr/share/nginx/html

# Create nginx directories
mkdir -p /var/log/nginx /var/cache/nginx
chown -R nginx:nginx /var/log/nginx /var/cache/nginx

# Check if nginx configuration is valid
echo "Validating nginx configuration..."
nginx -t

# Start nginx
echo "Starting nginx..."
exec nginx -g "daemon off;"