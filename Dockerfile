# Use a Node.js 20 base image, as specified in your package.json
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# This command updates the package lists for upgrades and package installations
RUN apt-get update \
    # Install wget and gnupg which are required to add the Google Chrome repository
    && apt-get install -y wget gnupg \
    # Download the Google Chrome signing key and add it to the system's keyring
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome-keyring.gpg \
    # Add the official Google Chrome repository to the system's software sources
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    # Update package lists again to include the new Google repository
    && apt-get update \
    # Install the stable version of Google Chrome and necessary fonts
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    # Clean up the apt cache to reduce image size
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Set environment variables for Puppeteer before installing dependencies
# This tells Puppeteer to skip downloading its own version of Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# This tells Puppeteer where to find the system-installed Google Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Install project dependencies, omitting development-only packages
RUN npm ci --omit=dev

# Copy the application source code into the container
COPY server/ ./server/

# Expose port 3000 to allow network connections to the container
EXPOSE 3000

# Define the command to run the application
CMD ["node", "server/index.js"] 