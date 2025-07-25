# Zidio - Blog Platform (Frontend)

A modern, responsive blog platform built with React, Vite, and Tailwind CSS. This frontend application provides an intuitive user interface for reading, creating, and interacting with blog posts.

## Features

- User authentication (login/register)
- Rich text editor for blog posts
- Real-time comments and likes
- Responsive design for all devices
- Dark/light mode support
- Interactive UI with smooth animations
- State management with Redux Toolkit
- Client-side routing with React Router

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Rich Text Editor**: Tiptap
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pragathi04-k/Zidio.git
   cd Zidio/Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```
   Update the URL if your backend is hosted elsewhere.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── Components/       # Reusable UI components
│   └── Blog/        # Blog-specific components
├── pages/           # Page components
├── services/        # API services and configurations
├── ui-components/   # Base UI components
└── lib/             # Utility functions and helpers
```

## API Integration

The frontend communicates with a RESTful API. The API base URL is configured in the environment variables. All API requests are made through the `services/api.js` axios instance, which includes request/response interceptors for handling authentication.

## Contributing

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgements

- [Vite](https://vitejs.dev/) for the fast development experience
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Tiptap](https://tiptap.dev/) for the rich text editor
- [React Router](https://reactrouter.com/) for client-side routing
