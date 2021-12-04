# Use node image as the base image
FROM node:12.22.5-alpine3.11

# Set production enviroment
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Install all the dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Add the source code to app
COPY . .

# Generate the build of the application
RUN npm run build:prod

# Expose port 3010
EXPOSE 3010

# Run main Node.js file
CMD ["node", "build/server/server.js"]


#docker buildx build --platform linux/amd64,linux/arm64 --push -t gerardoarceo/piase-backend .