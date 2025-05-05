'use client';
import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const { user, currentUser,login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    // Assuming 'login' in your store updates the 'user' state upon successful login
    await login({ email, password });
  };

  useEffect(() => {
    currentUser(); // Fetch current user on component mount (or when dependencies change)
  }, [currentUser]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]); // Only run this effect when 'user' or 'router' changes

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className=" transition-all duration-300 border hover:scale-105 border-gray-700 p-8 rounded-xl shadow-lg w-96">
        <h1 className=" text-center py-3 font-bold text-xl rounded-lg text-white">
          Login Page
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium ">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium ">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full border border-gray-700 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;