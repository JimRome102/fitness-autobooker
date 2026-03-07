'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBookingHistory, useRunBooking } from '@/hooks/useBookings';
import { BookingResult, Platform } from '@/utils/api';

export default function HistoryPage() {
  const [filters, setFilters] = useState<{
    platform?: Platform;
    result?: BookingResult;
  }>({});

  const { data: history } = useBookingHistory(filters);
  const runBookingMutation = useRunBooking();

  const handleRunBooking = async (dryRun: boolean = false) => {
    if (!dryRun && !confirm('Start the booking process now? This will attempt to book all active preferences.')) {
      return;
    }

    try {
      const result = await runBookingMutation.mutateAsync(dryRun);
      if (dryRun) {
        alert('Dry run complete! Check console for details.');
      } else if (result.summary) {
        alert(
          `Booking complete!\n\n` +
          `Total: ${result.summary.total}\n` +
          `Successful: ${result.summary.successful}\n` +
          `Waitlisted: ${result.summary.waitlisted}\n` +
          `Failed: ${result.summary.failed}`
        );
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Check console for details.');
    }
  };

  const getResultBadge = (result: BookingResult) => {
    switch (result) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'waitlisted':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'failed':
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
    }
  };

  const getResultIcon = (result: BookingResult) => {
    switch (result) {
      case 'success':
        return '✓';
      case 'waitlisted':
        return '⏳';
      case 'failed':
      case 'error':
        return '✗';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💪</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FitBook Auto
              </h1>
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/credentials"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Credentials
              </Link>
              <Link
                href="/preferences"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Preferences
              </Link>
              <Link
                href="/history"
                className="text-white border-b-2 border-purple-400 px-3 py-2 text-sm font-medium"
              >
                History
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Booking History</h1>
            <p className="text-gray-300">
              View all past booking attempts and their results.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <button
              onClick={() => handleRunBooking(true)}
              disabled={runBookingMutation.isPending}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-all disabled:opacity-50"
            >
              Dry Run
            </button>
            <button
              onClick={() => handleRunBooking(false)}
              disabled={runBookingMutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
            >
              {runBookingMutation.isPending ? 'Running...' : 'Run Booking'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-300 mb-2">
                Platform
              </label>
              <select
                id="platform-filter"
                value={filters.platform || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    platform: e.target.value ? (e.target.value as Platform) : undefined,
                  })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">All Platforms</option>
                <option value="classpass">ClassPass</option>
                <option value="mindbody">Mindbody</option>
                <option value="barrys">Barrys</option>
                <option value="slt">SLT</option>
                <option value="y7">Y7</option>
              </select>
            </div>

            <div>
              <label htmlFor="result-filter" className="block text-sm font-medium text-gray-300 mb-2">
                Result
              </label>
              <select
                id="result-filter"
                value={filters.result || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    result: e.target.value ? (e.target.value as BookingResult) : undefined,
                  })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">All Results</option>
                <option value="success">Success</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* History List */}
        <div>
          {history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl mt-1">{getResultIcon(record.result)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-xl font-bold text-white">{record.class_name}</h3>
                          <span className={`px-3 py-1 border text-xs font-medium rounded-full ${getResultBadge(record.result)}`}>
                            {record.result}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">
                          {record.studio_name} · <span className="capitalize">{record.platform}</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300">
                          <div>
                            <span className="text-gray-400">Class Time:</span>{' '}
                            {new Date(record.class_datetime).toLocaleString()}
                          </div>
                          {record.instructor && (
                            <div>
                              <span className="text-gray-400">Instructor:</span> {record.instructor}
                            </div>
                          )}
                          <div>
                            <span className="text-gray-400">Attempted:</span>{' '}
                            {new Date(record.attempt_timestamp).toLocaleString()}
                          </div>
                          <div>
                            <span className="text-gray-400">Duration:</span>{' '}
                            {(record.execution_time_ms / 1000).toFixed(1)}s
                          </div>
                        </div>
                        {record.error_message && (
                          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-300">
                              <span className="font-medium">Error:</span> {record.error_message}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl py-16">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No booking history yet</h3>
              <p className="text-gray-400 mb-6">
                Run a booking to see results here!
              </p>
              <button
                onClick={() => handleRunBooking(false)}
                disabled={runBookingMutation.isPending}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Run First Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
