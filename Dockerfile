# ---- Stage 1: Build ----
FROM node:20-alpine
WORKDIR /app

# Copy package files and install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the source code
COPY . .

# Set environment and expose the port EB expects
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["npm", "start"]

