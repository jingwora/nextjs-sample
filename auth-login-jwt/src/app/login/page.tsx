// nextjs/auth/src/app/login/page.tsx

import { LoginForm } from "./form-login";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <LoginForm />
      </div>
    </div>
  );
}
