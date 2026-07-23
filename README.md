# MERN Stack NotePad Application

This is a full-stack NotePad application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It allows users to create, read, update, and delete notes, featuring a responsive frontend with theme toggling and API rate limiting on the backend.

## Features

- **Create Notes**: Easily add new notes with a title and content.

- **View Notes**: Display all notes in a clean, organized interface.

- **Edit Notes**: Update existing notes.

- **Delete Notes**: Remove notes from the application.

- **Responsive Design**: User-friendly interface across various devices.

- **Theme Toggling**: Switch between dark and light themes.

- **API Rate Limiting**: Protects the backend API from excessive requests using Upstash Redis.

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces.

- **Vite**: A fast build tool for modern web projects.

- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

- **Framer Motion**: A production-ready motion library for React.

- **GSAP**: GreenSock Animation Platform for robust animations.

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.

- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.

- **MongoDB**: A NoSQL document database.

- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.

- **Upstash Redis**: Used for API rate limiting.

- **dotenv**: Loads environment variables from a `.env` file.

## Installation

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)

- npm or yarn

- MongoDB instance (local or cloud-based, e.g., MongoDB Atlas)

- Upstash Redis instance (for rate limiting)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mohamedosama2004/mernstack-app.git
   cd mernstack-app/backend
   ```

1. Install backend dependencies:

   ```bash
   npm install
   # or yarn install
   ```

1. Create a `.env` file in the `backend` directory and add the following environment variables:

   ```
   PORT=5001
   DB_CONNECTION=<Your_MongoDB_Connection_String>
   UPSTASH_REDIS_REST_URL=<Your_Upstash_Redis_REST_URL>
   UPSTASH_REDIS_REST_TOKEN=<Your_Upstash_Redis_REST_TOKEN>
   ```
  - `DB_CONNECTION`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/notepad` or a MongoDB Atlas URI ).
  - `UPSTASH_REDIS_REST_URL`: The REST URL for your Upstash Redis instance.
  - `UPSTASH_REDIS_REST_TOKEN`: The REST token for your Upstash Redis instance.

1. Start the backend server:

   ```bash
   npm run dev
   # or yarn dev
   ```

   The backend server will run on `http://localhost:5001`.

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

1. Install frontend dependencies:

   ```bash
   npm install
   # or yarn install
   ```

1. Start the frontend development server:

   ```bash
   npm run dev
   # or yarn dev
   ```

   The frontend application will run on `http://localhost:5173` (or another available port ).

## API Endpoints

The backend API provides the following endpoints for managing notes:

| Method | Endpoint | Description | Request Body (JSON) | Response (JSON) |
| --- | --- | --- | --- | --- |
| `GET` | `/api/notes` | Get all notes | None | `[{ _id, title, content, createdAt, updatedAt }]` |
| `GET` | `/api/notes/:id` | Get a single note by ID | None | `{ _id, title, content, createdAt, updatedAt }` or `{ message: "Note not Found" }` (404) |
| `POST` | `/api/notes` | Create a new note | `{ "title": "string", "content": "string" }` | `{ _id, title, content, createdAt, updatedAt }` |
| `PUT` | `/api/notes/:id` | Update an existing note | `{ "title": "string", "content": "string" }` | `{ _id, title, content, createdAt, updatedAt }` or `{ message: "Note not found" }` (404) |
| `DELETE` | `/api/notes/:id` | Delete a note by ID | None | `{ _id, title, content, createdAt, updatedAt }` or `{ message: "Note not found" }` (404) |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
