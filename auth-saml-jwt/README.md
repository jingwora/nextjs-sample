
# Next.js Authentication

- A role-based authentication system using Next.js 14, featuring secure login, session management with JWT, and middleware-based access control for protected routes.

## Initiate nextjs 

```bash
npx create-next-app@14 .
npm install zod
npm install jose
npm install @node-saml/node-saml

```

Mock SAML SAML SSO
Certification
https://mocksaml.com/namespace/mock


```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File Structure:
```
nextjs/auth-saml-jwt/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/                 # Authentication-related routes
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts      # API route to handle SAML login redirect
│   │   │   │   ├── callback/
│   │   │   │   │   └── route.ts      # API route to process SAML callback
│   │   │   │   └── logout/
│   │   │   │       └── route.ts      # API route to handle logout
│   │   │   └── session/
│   │   │       └── route.ts        # API route to handle session data (e.g., fetch session email).
│   │   ├── login/
│   │   │   └── page.tsx              # Login page for initiating SAML authentication
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard for authenticated users
│   │   ├── admin/
│   │   │   └── page.tsx              # Admin-only dashboard
│   │   ├── fonts/                    # Default fonts directory
│   │   ├── lib/                      # Utility and library functions
│   │   │   ├── session.ts            # JWT-based session management
│   │   │   └── saml.ts               # SAML utilities and configuration
│   │   ├── favicon.ico               # Default favicon
│   │   ├── globals.css               # Default global styles
│   │   ├── layout.tsx                # Default app layout
│   │   └── page.tsx                  # Root page redirect to `/login`
├── middleware.ts                     # Middleware for route protection and validation
```

### Flow of Data and Actions

1. **User Accesses the Application**  
   - The user navigates to the application.  
   - By default, they are redirected to the `/login` page if not authenticated.

2. **Login Page Initiates SAML Authentication**  
   - The `/login` page provides a button or auto-redirects to the SAML Identity Provider (IdP).  
   - Clicking the button triggers a request to `/api/auth/login`, which redirects to the SAML IdP for authentication.

3. **User Authenticates with the SAML IdP**  
   - The user enters credentials on the SAML IdP.  
   - Upon successful login, the IdP redirects the user back to the application via the SAML callback URL (`/api/auth/callback`).

4. **Processing the SAML Callback**  
   - The `/api/auth/callback` route validates the SAML response using the `validateSamlResponse` utility in `lib/saml.ts`.  
   - It extracts user attributes (e.g., `userId`, `email`, `roles`) and creates a signed JWT using `lib/session.ts`.  
   - The JWT is stored in an HTTP-only cookie as the session.

5. **Middleware Validates Access**  
   - The `middleware.ts` file runs for each request to protected or admin routes.  
   - It checks for the presence of a valid session JWT and redirects unauthenticated users to `/login`.  
   - Admin-only routes are further restricted based on roles.

6. **User Accesses Dashboard**  
   - Authenticated users with valid sessions can access the `/dashboard` route.  
   - The `Dashboard` component fetches session data via `/api/session` to display personalized information (e.g., the user's email).

7. **Admin Page Restriction**  
   - The `/admin` route is accessible only to users with the admin role (`admin@example.com`).  
   - Unauthorized users attempting to access `/admin` are redirected back to `/dashboard`.

8. **Logout**  
   - Clicking "Logout" in either the `/dashboard` or `/admin` page triggers a `POST` request to `/api/auth/logout`.  
   - This API clears the session cookie and redirects the user to `/login`.

9. **Session Validation and Expiration**  
   - Each request to a protected route checks the validity and expiration of the session JWT.  
   - Expired or invalid sessions prompt the user to re-authenticate by redirecting them to `/login`.
                                                           |
