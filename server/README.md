# WishTogether Backend

The backend of WishTogether is a REST API built with Express.js and TypeScript, providing the server-side functionality for the wishlist application.

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for Node.js
- **TypeScript**: Static typing for JavaScript
- **Prisma**: Next-generation ORM for database access
- **PostgreSQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing and validation
- **Zod**: Schema validation library

## Project Structure

```
server/
├── src/
│   ├── controllers/     # Request handlers for routes
│   ├── middlewares/     # Express middlewares
│   ├── models/          # Data models and types
│   ├── routes/          # API route definitions
│   │   ├── v1.routes.ts # API v1 route entry point
│   │   ├── user.routes.ts
│   │   └── wishlist.routes.ts
│   ├── schema/          # Validation schemas
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── prisma/
│   ├── schema.prisma    # Prisma database schema
│   └── migrations/      # Database migrations
├── scripts/             # Utility scripts
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── .env                 # Environment variables
```

## API Endpoints

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user info

### Wishlist Endpoints

- `GET /api/v1/wishlists` - Get all user's wishlists
- `POST /api/v1/wishlists` - Create a new wishlist
- `GET /api/v1/wishlists/:id` - Get a wishlist by ID
- `PATCH /api/v1/wishlists/:id` - Update a wishlist
- `DELETE /api/v1/wishlists/:id` - Delete a wishlist
- `GET /api/v1/wishlists/public/:publicId` - Get a wishlist by public ID

### Wishlist Item Endpoints

- `POST /api/v1/wishlists/:id/items` - Add item to wishlist
- `PATCH /api/v1/wishlists/:id/items/:itemId` - Update item in wishlist
- `DELETE /api/v1/wishlists/:id/items/:itemId` - Remove item from wishlist

### Collaboration Endpoints

- `GET /api/v1/wishlists/:id/collaborators` - Get wishlist collaborators
- `POST /api/v1/wishlists/:id/collaborators` - Add collaborator to wishlist
- `PATCH /api/v1/wishlists/:id/collaborators/:collaboratorId` - Update collaborator permissions
- `DELETE /api/v1/wishlists/:id/collaborators/:userId` - Remove collaborator from wishlist

## Database Schema

The database uses PostgreSQL with Prisma ORM. The main entities include:

- **User**: Account credentials and user information
- **Wishlist**: Collection of wishlist items
- **WishlistItem**: Individual items in a wishlist
- **Collaborator**: Users who can access and modify shared wishlists

## Development

### Prerequisites

- Node.js (v18 or higher)
- PNPM package manager
- PostgreSQL database

### Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Configure the database connection string and other settings

3. Set up the database:

   ```bash
   # Generate Prisma client
   pnpm db:generate

   # Run database migrations
   pnpm db:migrate
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Database Management

- `pnpm db:studio` - Open Prisma Studio for database visualization
- `pnpm db:migrate` - Create and apply migrations
- `pnpm db:push` - Push schema changes to database without migrations
- `pnpm db:generate` - Generate Prisma client

## Deployment

The application is configured for deployment on Vercel, but can be deployed to any Node.js hosting platform:

1. Configure environment variables on the hosting platform
2. Build the application:
   ```bash
   pnpm build
   ```
3. Start the production server:
   ```bash
   pnpm start
   ```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Zod schemas
- CORS configuration
- Helmet.js for HTTP security headers
