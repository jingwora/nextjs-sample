// nextjs/auth/src/app/login/form-login.tsx

'use client';

import { useState } from 'react';
import { login } from './actions';
import React from 'react';
import { useRouter } from 'next/navigation';

// Define the type for form errors
type FormErrors = {
  email?: string[];
  password?: string[];
};

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const result = await login({}, formData);

      if (result.success) {
        // Redirect to the dashboard on successful login
        router.push('/dashboard');
      } else if (result.errors) {
        setErrors(result.errors as FormErrors);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        email: ['An unexpected error occurred. Please try again.'],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[300px] flex-col gap-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.join(', ')}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        {errors.password && <p className="text-red-500">{errors.password.join(', ')}</p>}
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
