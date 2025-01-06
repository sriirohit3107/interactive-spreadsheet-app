# Step 1: Use official Node.js image as a base image
FROM node:22

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the entire application code
COPY . .

# Step 5: Expose the port your app will run on (e.g., 5000)
EXPOSE 5000

# Step 6: Run the app
CMD ["node", "server.js"]
