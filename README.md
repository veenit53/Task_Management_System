# Instagram Mini Clone - Frontend

This is the frontend application for the Instagram Mini Clone built with React, Vite, and Tailwind CSS.

## Features

- User authentication (Login/Signup)
- View home feed with all posts
- Create new posts with image upload
- User profiles with post gallery
- Follow/Unfollow users
- View follower and following lists
- Responsive design with Tailwind CSS
- Protected routes for authenticated users

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Font Awesome
- **State Management**: React Context API

## Installation

1. Clone the repository:
```bash
git clone https://github.com/veenit53/Instagram_Mini_Clone.git
cd Instagram_Mini_Clone/Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Frontend directory:
```
VITE_BASE_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
Frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx                    # Feed page
│   │   ├── Profile.jsx                 # User profile page
│   │   ├── CreatePost.jsx              # Create post page
│   │   ├── UserLogin.jsx               # Login page
│   │   ├── UserSignup.jsx              # Signup page
│   │   └── UserProtectedWrapper.jsx    # Protected route wrapper
│   ├── context/
│   │   └── UserContext.jsx             # User state management
│   ├── App.jsx                         # Main app component
│   ├── main.jsx                        # Entry point
│   └── index.css                       # Global styles
├── public/                             # Static assets
├── index.html                          # HTML template
├── vite.config.js                      # Vite configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── postcss.config.js                   # PostCSS configuration
├── package.json
└── .env                                # Environment variables
```

## Key Pages & Components

### [Home.jsx](src/pages/Home.jsx)
Displays the feed with all posts from all users. Users can see post images, captions, and username.

### [Profile.jsx](src/pages/Profile.jsx)
Shows user profile with:
- User information (username)
- Post count, followers, following
- Grid of user's posts
- Follow/Unfollow button (for other users)
- Logout button (for own profile)

### [CreatePost.jsx](src/pages/CreatePost.jsx)
Allows authenticated users to:
- Upload an image
- Add a caption
- Submit the post

### [UserLogin.jsx](src/pages/UserLogin.jsx)
Login form with email and password fields.

### [UserSignup.jsx](src/pages/UserSignup.jsx)
Registration form with:
- First name and last name
- Username
- Email
- Password

### [UserProtectedWrapper.jsx](src/pages/UserProtectedWrapper.jsx)
Higher-order component that:
- Verifies user authentication
- Redirects to login if not authenticated
- Fetches user profile data
- Shows loading state while verifying

### [UserContext.jsx](src/context/UserContext.jsx)
Global state management for user data using React Context API.

## Routing

The application uses React Router with the following routes:

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/login` | UserLogin | No | User login page |
| `/signup` | UserSignup | No | User registration page |
| `/home` | Home | Yes | Feed with all posts |
| `/create-post` | CreatePost | Yes | Create new post |
| `/profile` | Profile | Yes | Logged-in user's profile |
| `/profile/:id` | Profile | Yes | Other user's profile |

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_BASE_URL | Backend API base URL (default: http://localhost:5000) |

## Features in Detail

### Authentication Flow
1. User signs up or logs in
2. JWT token is stored in localStorage
3. Token is sent with every API request in Authorization header
4. UserProtectedWrapper verifies token validity
5. On logout, token is removed and user is redirected to login

### Creating Posts
1. User navigates to create post page
2. Selects an image (preview shown)
3. Adds optional caption
4. Submits form via multipart/form-data
5. Redirected to profile after successful upload

### Following Users
1. Visit another user's profile
2. Click Follow/Unfollow button
3. Real-time UI update with follower count change
4. Current state persists across navigation

## Dependencies

See [package.json](package.json) for all dependencies and versions.

### Key Dependencies:
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `tailwindcss` - Utility-first CSS framework
- `@fortawesome/fontawesome-free` - Icon library

## Styling

The project uses Tailwind CSS for utility-first styling. Custom styles are minimal, with most styling done through Tailwind classes.

See [tailwind.config.js](tailwind.config.js) for Tailwind configuration.

## API Integration

All API calls are made using Axios with:
- Authorization header with JWT token
- Base URL from environment variables
- Proper error handling with console logging

## File Upload

Images are uploaded using:
- HTML input with `accept="image/*"`
- FormData for multipart submission
- Image preview before upload
- Validation to ensure image is selected

## Navigation

The app includes a navigation bar at the bottom with three buttons:
- Home (house icon)
- Create Post (plus icon - centered)
- Profile (user icon)

This navigation is present on all protected pages (Home, Profile, CreatePost).

## Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Future Enhancements

- Add likes functionality with UI toggle
- Implement comments section
- Real-time notifications
- Search users functionality
- Direct messaging
- Edit/delete posts
- User profile editing
- Dark mode support
- Image optimization

## Troubleshooting

**Issue**: Getting 401 Unauthorized errors
- Check if token is stored in localStorage
- Verify backend server is running
- Check VITE_BASE_URL in .env file

**Issue**: Images not loading
- Ensure backend `/uploads` route is configured
- Check if images are stored in Backend/uploads directory

**Issue**: CORS errors
- Verify backend CORS configuration allows frontend URL
- Check if backend is running on port 5000

## Author

Created as a mini version of Instagram with core social media features.