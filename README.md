# Article Management System

A responsive web application for managing articles with user and admin roles, built with Next.js, Tailwind CSS, and ShadCN UI.

## Features

### User Features

- **Authentication**

  - Login with form validation
  - Register with form validation
  - Automatic redirect after login/register
  - Logout functionality

- **Article Management**
  - Browse article list with filtering and pagination
  - Search articles with debounce
  - View article details
  - See related articles from the same category

### Admin Features

- **Authentication** (same as User)

- **Category Management**

  - List all categories with search and pagination
  - Create new categories with form validation
  - Edit existing categories
  - Delete categories

- **Article Management**
  - List all articles with filtering and pagination
  - Create new articles with form validation and preview
  - Edit existing articles
  - (Delete functionality could be added)

## Technologies Used

- **Next.js** (App Router) with SSR and CSR capabilities
- **Tailwind CSS** for styling
- **ShadCN UI** for UI components
- **Axios** for API communication
- **Lucide React** for icons
- **Zod** + **React Hook Form** for form validation
- **TypeScript** for type safety

## API Integration

The application is connected to the following API:

```
https://test-fe.mysellerpintar.com/api
```

### Fallback Data

The application includes dummy data to handle scenarios where the API might be unavailable:

- Dummy articles
- Dummy categories
- Dummy user data

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd article-management
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application can be deployed to any platform that supports Next.js applications, such as Vercel or Netlify.

## License

This project is open-source and available under the MIT License.
