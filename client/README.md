# WishTogether Frontend

The frontend of WishTogether is a modern React application built with TypeScript, Vite, and Tailwind CSS. It provides an intuitive user interface for managing wishlists collaboratively.

## Tech Stack

- **React**: UI library for building component-based interfaces
- **TypeScript**: Static typing for JavaScript
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: For client-side routing
- **Recoil**: State management library
- **Axios**: HTTP client for API requests

## Project Structure

```
client/
├── src/
│   ├── atoms/           # Recoil state atoms
│   ├── components/      # Reusable UI components
│   ├── routes/          # Route configurations
│   ├── pages/           # Page components for different routes
│   ├── services/        # API service functions
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Key Features

### Authentication

- JWT-based authentication system
- Login and registration
- Token storage and validation

### Wishlist Management

- Create new wishlists
- Add items with details (title, description, price, URL, etc.)
- Manage existing wishlists (edit, delete)
- View wishlist details and contained items

### Collaboration

- Share wishlists via public links
- Invite collaborators to wishlists
- Control collaborator permissions
- View shared wishlists

### User Interface

- Responsive design for mobile and desktop
- Dark/light theme support
- Intuitive navigation
- Modern and clean UI components

## Development

### Prerequisites

- Node.js (v18 or higher)
- PNPM package manager

### Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   - Create a `.env` file in the root directory
   - Add the required variables:
     ```
     VITE_API_URL=http://localhost:5000/api/v1
     ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

## Best Practices

- **Component Structure**: Keep components small and focused on a single responsibility
- **State Management**: Use Recoil for global state and React hooks for local state
- **TypeScript**: Utilize TypeScript for type safety and better developer experience
- **Error Handling**: Implement proper error handling for API requests
- **Responsive Design**: Ensure the application works well on all device sizes
