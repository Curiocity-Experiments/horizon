import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sun, Moon } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { getConfig } from '../config/privateLabel';
import logger from '../lib/logger';

export default function Layout({ children, config, user }) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      logger.error('Error during logout:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', !darkMode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold text-gray-800 dark:text-white">
              {config.name}
            </a>
          </Link>
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
            </button>
            {user ? (
              <>
                <Link href="/profile">
                  <a className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Profile</a>
                </Link>
                <button onClick={handleLogout} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login">
                <a className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Login</a>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} {config.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}