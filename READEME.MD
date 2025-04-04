# React Authentication Application

This project is a React-based authentication application with a Flask backend, designed to demonstrate user registration, login, and protected routing.

## Features

- **User Registration:** Allows users to create new accounts.
- **User Login:** Allows users to log in with existing accounts.
- **Admin and User Roles:** Supports distinct roles for admins and regular users.
- **Protected Routes:** Ensures that only authenticated users can access certain pages.
- **Cookie-Based Authentication:** Uses cookies to maintain user sessions across page refreshes.
- **Dynamic Admin Email Validation:** Validates admin email based on organization name.
- **MongoDB Integration:** Uses MongoDB for persistent user and company data storage.
- **Flask Backend:** Provides API endpoints for registration, login, and user authentication.
- **Centralized Configuration:** Uses `config.js` for frontend and `config.py` for backend configurations.
- **Modern UI with Styled Components:** Uses styled components to create a visually appealing user interface.

## Technologies Used

- **Frontend:**
  - React
  - React Router
  - Styled Components
  - Axios
  - js-cookie
- **Backend:**
  - Flask
  - PyMongo
  - python-dotenv
  - Werkzeug

## Setup Instructions

1.  **Clone the Repository:**

    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  **Backend Setup:**

    - **Install Dependencies:**

      ```bash
      pip install Flask pymongo python-dotenv Werkzeug
      ```

    - **Create a `.env` file:**

      In the root of the backend directory, create a `.env` file with your MongoDB URI and JWT secret:

      ```
      MONGODB_URI=mongodb://localhost:27017/
      MONGODB_DB=ai_portal
      ```

    - **Run the Flask Application:**

      ```bash
      python app.py
      ```

3.  **Frontend Setup:**

    - **Install Dependencies:**

      ```bash
      npm install
      ```

    - **Run the React Application:**

      ```bash
      npm start
      ```

4.  **Access the Application:**

    - Open your browser and navigate to `http://localhost:3000`.

## Key Components

- **ProtectedRoute.js:**
  - Handles protected routing, ensuring that only authenticated users can access certain routes.
  - Uses cookies to check for authentication status.
- **AuthContext.js:**
  - Provides an authentication context for managing user login and logout.
  - Uses `useCallback` to memoize login and logout functions.
- **config.js/config.py:**
  - Centralized configuration files for frontend and backend settings.
- **mongo_handler.py:**
  - Manages MongoDB database interactions.

## Notes

- This application uses cookies for authentication, which is suitable for basic use cases. For production environments, consider using more robust authentication methods like JWTs and secure cookie handling.
- The backend API endpoints are designed to be simple and can be extended to include more features as needed.
- The frontend uses styled components for styling, which allows for component-level styling and easier maintenance.
