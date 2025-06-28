################################
#### PRODUCTION ENVIRONMENT ####
################################

# Use the official NGINX image for production
FROM nginx:stable-alpine as production

WORKDIR /usr/share/nginx/html

COPY dist/. .

# copy nginx configuration in side conf.d folder
COPY default.conf /etc/nginx/conf.d

# Copy the build output from the dist folder into the Nginx html directory
# COPY /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 to allow access to the app
EXPOSE 80

# Run Nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"] 