'use client';

import Link from 'next/link';
import { useBookingStats } from '@/hooks/useBookings';

export default function Home() {
  const { data: stats, isLoading } = useBookingStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">FitBook Auto</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/credentials"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Credentials
              </Link>
              <Link
                href="/preferences"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Preferences
              </Link>
              <Link
                href="/history"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                History
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Never Miss Your Favorite Class
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Automatically book fitness classes at midnight. Wake up with your schedule already set.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {isLoading ? '...' : stats?.total || 0}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Successful</dt>
              <dd className="mt-1 text-3xl font-semibold text-success-600">
                {isLoading ? '...' : stats?.successful || 0}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Waitlisted</dt>
              <dd className="mt-1 text-3xl font-semibold text-warning-600">
                {isLoading ? '...' : stats?.waitlisted || 0}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
              <dd className="mt-1 text-3xl font-semibold text-primary-600">
                {isLoading ? '...' : `${stats?.successRate || 0}%`}
              </dd>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/credentials"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Manage Credentials</h3>
              <p className="mt-2 text-sm text-gray-500">
                Add and manage your ClassPass, Mindbody, and other platform credentials.
              </p>
            </div>
          </Link>

          <Link
            href="/preferences"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Set Preferences</h3>
              <p className="mt-2 text-sm text-gray-500">
                Configure which classes to book automatically each month.
              </p>
            </div>
          </Link>

          <Link
            href="/history"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">View History</h3>
              <p className="mt-2 text-sm text-gray-500">
                See all past booking attempts and their results.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
