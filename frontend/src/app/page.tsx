'use client';

import Link from 'next/link';
import { useBookingStats } from '@/hooks/useBookings';

export default function Home() {
  const { data: stats, isLoading } = useBookingStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💪</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FitBook Auto
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/credentials"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Credentials
              </Link>
              <Link
                href="/preferences"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Preferences
              </Link>
              <Link
                href="/history"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                History
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <span className="text-2xl">🎯</span>
              <span className="text-purple-300 text-sm font-medium">Automated Class Booking</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Never Miss Your
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Favorite Class
              </span>
            </h2>

            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
              Automatically book fitness classes at midnight. Wake up with your schedule already set.
              <br />
              <span className="text-purple-400 font-semibold">Barry's, SLT, ClassPass, and more.</span>
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/credentials"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started →
              </Link>
              <Link
                href="/history"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-200"
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-right">
                  <dt className="text-sm font-medium text-gray-400">Total Bookings</dt>
                  <dd className="text-4xl font-bold text-white mt-1">
                    {isLoading ? '...' : stats?.total || 0}
                  </dd>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-right">
                  <dt className="text-sm font-medium text-gray-400">Successful</dt>
                  <dd className="text-4xl font-bold text-green-400 mt-1">
                    {isLoading ? '...' : stats?.successful || 0}
                  </dd>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="text-right">
                  <dt className="text-sm font-medium text-gray-400">Waitlisted</dt>
                  <dd className="text-4xl font-bold text-yellow-400 mt-1">
                    {isLoading ? '...' : stats?.waitlisted || 0}
                  </dd>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-right">
                  <dt className="text-sm font-medium text-gray-400">Success Rate</dt>
                  <dd className="text-4xl font-bold text-purple-400 mt-1">
                    {isLoading ? '...' : `${stats?.successRate || 0}%`}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/credentials"
              className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200 hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔐</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Manage Credentials</h3>
              <p className="text-gray-300 leading-relaxed">
                Securely store your ClassPass, Mindbody, and other platform credentials with military-grade encryption.
              </p>
              <div className="mt-6 text-purple-400 font-semibold group-hover:text-purple-300">
                Add credentials →
              </div>
            </Link>

            <Link
              href="/preferences"
              className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg border border-blue-500/20 rounded-2xl p-8 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-200 hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Set Preferences</h3>
              <p className="text-gray-300 leading-relaxed">
                Configure which classes to book automatically each month. Set priorities and never miss a spot.
              </p>
              <div className="mt-6 text-blue-400 font-semibold group-hover:text-blue-300">
                Create preference →
              </div>
            </Link>

            <Link
              href="/history"
              className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg border border-green-500/20 rounded-2xl p-8 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-200 hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">View History</h3>
              <p className="text-gray-300 leading-relaxed">
                Track all booking attempts, success rates, and get insights into your fitness routine.
              </p>
              <div className="mt-6 text-green-400 font-semibold group-hover:text-green-300">
                See history →
              </div>
            </Link>
          </div>

          {/* How It Works Section */}
          <div className="mt-20 text-center">
            <h3 className="text-3xl font-bold text-white mb-12">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">1️⃣</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Add Credentials</h4>
                <p className="text-gray-400 text-sm">Store your platform logins securely</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">2️⃣</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Set Preferences</h4>
                <p className="text-gray-400 text-sm">Choose your favorite classes</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">3️⃣</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Automate</h4>
                <p className="text-gray-400 text-sm">Books run at midnight automatically</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">4️⃣</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Wake Up Booked</h4>
                <p className="text-gray-400 text-sm">Your classes are already reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400 text-sm">
            Built with ❤️ for fitness enthusiasts who refuse to wake up at midnight
          </p>
        </div>
      </footer>
    </div>
  );
}
