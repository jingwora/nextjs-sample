
# Next.js Authentication

- A role-based authentication system using Next.js 14, featuring secure login, session management with JWT, and middleware-based access control for protected routes.

## Initiate nextjs 

```bash
npx create-next-app@14 .
npm install zod
npm install jose
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File Structure:
```
nextjs/auth-login-jwt/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── session/
│   │   │   │   └── route.ts        # API route to handle session data (e.g., fetch session email).
│   │   ├── login/
│   │   │   ├── actions.ts          # Server-side functions for login and logout
│   │   │   ├── form-login.tsx      # LoginForm component
│   │   │   └── page.tsx            # Login 
│   │   ├── dashboard/
│   │   │   └── page.tsx            # All users
│   │   ├── admin/
│   │   │   └── page.tsx            # Only admin
│   │   ├── fonts/                  # Default
│   │   ├── lib/
│   │   │   └── session.ts          # Handles session using JWT.
│   │   ├── favicon.ico             # Default
│   │   ├── globals.css             # Default
│   │   ├── layout.tsx              # Default
│   │   └── page.tsx                # Root page redirect to Login page
├── middleware.ts                   # Middleware to handle route protection and session validation.
```

### Flow of Data and Actions

1. **User Accesses the Application**  
   - The user navigates to the application.  
   - By default, the root page (`/`) redirects to the `/login` page.

2. **Login Page**  
   - The `/login` page displays a form for user credentials (e.g., email and password).  
   - The form uses the `LoginForm` component (`form-login.tsx`) to handle input and submission.  
   - On submission, the `login` function from `actions.ts` is called to authenticate the user.

3. **Authentication Process**  
   - The `login` function validates the user’s credentials on the server.  
   - Upon successful authentication:
     - A signed JWT containing user details (e.g., `userId`, `email`, and roles) is created in `session.ts`.  
     - The JWT is stored in an HTTP-only cookie to serve as the user’s session.  
   - The user is redirected to `/dashboard`.

4. **Middleware Validates Access**  
   - The `middleware.ts` file intercepts every request to protected routes like `/dashboard` and `/admin`.  
   - It validates the session by checking the presence and validity of the JWT stored in cookies.  
   - Unauthorized users are redirected to `/login`.

5. **Dashboard Access for Authenticated Users**  
   - Authenticated users with a valid session can access the `/dashboard` page.  
   - The `Dashboard` component fetches the session data from the `/api/session` API route to display the user’s email or other relevant data.

6. **Admin Page Access Restriction**  
   - The `/admin` route is restricted to users with the admin role.  
   - Middleware checks the user's role from the session data. Unauthorized users are redirected to `/dashboard`.

7. **Logout**  
   - Clicking the "Logout" button triggers the `logout` function from `actions.ts`.  
   - The `logout` function deletes the session cookie on the server.  
   - The user is then redirected to the `/login` page.

8. **Session Validation and Expiration**  
   - Each request to a protected route validates the session’s integrity and checks if the JWT is expired.  
   - If the session is invalid or expired, the user is redirected to `/login` to re-authenticate.
