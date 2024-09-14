// components/Layout.js

// TODO: Implement a theme provider for better management of dark mode and custom themes
// TODO: Add internationalization support for multi-language functionality
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';

export default function Layout({ children, config }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // TODO: Move dark mode logic to a custom hook for reusability
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', !darkMode);
  };

  return (
    <SessionProvider>
      {/* TODO: Add accessibility attributes to improve screen reader support */}
      <div className="min-h-screen flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/">
              <a className="text-2xl font-semibold text-gray-800 dark:text-white">
                {config.name}
              </a>
            </Link>
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
            </button>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} {config.name}. All rights reserved.
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
}