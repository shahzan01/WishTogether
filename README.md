# WishTogether

WishTogether is a collaborative wishlist sharing application that allows users to create, share, and collaborate on wishlists with others.

## Features

- Create and manage personal wishlists
- Share wishlists via public links
- Collaborate with friends and family on shared wishlists
- Add, update, and remove items from wishlists
- User authentication and authorization

## Project Structure

This project is split into two main parts:

- **Frontend** (client): React application built with TypeScript, Vite, and Tailwind CSS
- **Backend** (server): Express.js API with Prisma ORM for database management

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PNPM package manager
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shahzan01/WishTogether.git
   cd WishTogether
   ```

2. Install dependencies for both client and server:

   ```bash
   # Install client dependencies
   cd client
   pnpm install

   # Install server dependencies
   cd ../server
   pnpm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in the server directory
   - Update the database connection string and other required variables

4. Run the development servers:

   ```bash
   # Start the backend server
   cd server
   pnpm dev

   # In a separate terminal, start the frontend
   cd client
   pnpm dev
   ```

## Demo Video

<div align="center">
   <h2>Gdrive : https://drive.google.com/file/d/1_C1a9Ypidj6nAbcrvd79Qc3HFOteDttK/view?usp=sharing</h2>

   <h1>Youtube</h1>
  <a href="https://www.youtube.com/watch?v=MZcjPv5Lv_8" target="_blank">
    <img src="https://img.youtube.com/vi/MZcjPv5Lv_8/hqdefault.jpg" alt="Watch the demo video" width="640" height="360" />
  </a>
</div>


## Detailed Documentation

For more detailed information about each part of the application:

- [Frontend Documentation](./client/README.md)
- [Backend Documentation](./server/README.md)

## License

[MIT](LICENSE)
