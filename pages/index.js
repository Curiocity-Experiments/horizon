import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home({ config }) {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-8" style={{ color: config.colors.primary }}>
          Welcome to {config.name}
        </h1>
        
        <p className="mt-3 text-2xl mb-8">
          Help shape the future of our product by sharing your ideas and voting on others.
        </p>
        
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link href="/feedback">
            <a className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 transition duration-150 ease-in-out">
              <h3 className="text-2xl font-bold" style={{ color: config.colors.secondary }}>View Feedback &rarr;</h3>
              <p className="mt-4 text-xl">
                Browse and vote on existing feedback from our community.
              </p>
            </a>
          </Link>

          <Link href={session ? "/submit-feedback" : "/api/auth/signin"}>
            <a className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 transition duration-150 ease-in-out">
              <h3 className="text-2xl font-bold" style={{ color: config.colors.secondary }}>Submit Feedback &rarr;</h3>
              <p className="mt-4 text-xl">
                Share your ideas and help us improve our product.
              </p>
            </a>
          </Link>

          {session ? (
            <Link href="/profile">
              <a className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 transition duration-150 ease-in-out">
                <h3 className="text-2xl font-bold" style={{ color: config.colors.secondary }}>Your Profile &rarr;</h3>
                <p className="mt-4 text-xl">
                  View and manage your submitted feedback.
                </p>
              </a>
            </Link>
          ) : (
            <Link href="/api/auth/signin">
              <a className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 transition duration-150 ease-in-out">
                <h3 className="text-2xl font-bold" style={{ color: config.colors.secondary }}>Sign In &rarr;</h3>
                <p className="mt-4 text-xl">
                  Sign in to submit feedback and vote on ideas.
                </p>
              </a>
            </Link>
          )}
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://curiocity.rocks"
          target="_blank"
          rel="noopener noreferrer"
        >
          A Curiocity Company Experiment{' '}
        </a>
      </footer>
    </div>
  );
}
