# Use a full Node.js image instead of Alpine
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Run Vite with a specific flag to handle crypto
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]