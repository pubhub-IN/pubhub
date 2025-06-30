# Use a Node.js 20 base image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Google Chrome for Puppeteer
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the rest of your application's code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["node", "server/index.js"] 