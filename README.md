# Interactive Spreadsheet Application

## Overview

This project is a full-stack interactive spreadsheet application built with **Node.js**, **React**, and **MongoDB**. 
It allows users to create, update, and delete cells in a 2D grid while using animations with **GSAP**. Users can also undo and redo changes made to the grid.

### Key Features:
- **Interactive Grid**: Cells can be edited with a simple input interface.
- **Undo/Redo History**: Track and revert changes made to the grid.
- **Animations**: GSAP-powered animations for hover effects on cells.
- **Backend**: A REST API with Express.js for handling cell data, connected to a MongoDB database.
- **Frontend**: React app with dynamic rendering and Three.js-based canvas effects.

## Requirements

- Node.js (>= 14.x.x)
- MongoDB (installed locally or use a cloud service like MongoDB Atlas)
- Docker (optional, for containerization)

## Installation

### 1. Clone the repository
git clone https://github.com/your-repo/interactive-spreadsheet.git
cd interactive-spreadsheet

###2. Backend (server.js)
Install dependencies:
cd backend
npm install

Run the backend server:
npm start
The backend server will be running on http://localhost:5000.

###3. Frontend (App.js)
cd frontend
npm install
Run the frontend development server:
npm start
The frontend will be running on http://localhost:3000.

###4. Database
Make sure you have MongoDB running on your local machine or configure the database URL to a cloud service in the server.js file:

mongoose.connect('mongodb://127.0.0.1:27017/interactive_spreadsheet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

###5. Docker (Optional)
If you want to run the application inside a Docker container, you can use the provided Dockerfile.

Build the Docker image:
docker build -t interactive-spreadsheet .
Run the container:
docker run -p 5000:5000 interactive-spreadsheet


Usage : 
Once both the frontend and backend are running, navigate to the React app in your browser. You will be able to:
Edit cells: Click on any cell to edit its value.
Undo/Redo: Use the undo and redo buttons to revert changes.
Animations: Hover over cells to see smooth GSAP animations.



Future Enhancements : 

Add export/import functionality for spreadsheets.
Support for formulas and expressions.
Enhanced UI/UX with more animation
