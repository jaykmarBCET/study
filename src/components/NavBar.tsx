'use client'
import Link from 'next/link'
import { useAuthStore } from '../app/store/AuthStore'

export default function NavBar() {
  const { user } = useAuthStore()

  return (
    <nav className="bg-gray-900 border border-gray-700  text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-blue-500 hover:text-blue-400 transition">
          MyApp
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-sm font-medium">
          {!user ? (
            <>
              <Link href="/register" className="hover:text-blue-400 transition">
                Register
              </Link>
              <Link href="/login" className="hover:text-blue-400 transition">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hover:text-blue-400 transition">
                Dashboard
              </Link>
              <Link href="/" className="hover:text-blue-400 transition">
                Home
              </Link>
              <Link href="/setting" className="hover:text-blue-400 transition">
                Setting
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
