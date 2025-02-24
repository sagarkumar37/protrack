# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:14.15.5 as node

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY . .

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build --prod


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:alpine
# Copy the build output to replace the default nginx contents.
COPY --from=node /app/dist/quick-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf