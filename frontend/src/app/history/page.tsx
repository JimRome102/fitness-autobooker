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

  const { data: history, isLoading } = useBookingHistory(filters);
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
        return 'bg-success-100 text-success-800';
      case 'waitlisted':
        return 'bg-warning-100 text-warning-800';
      case 'failed':
      case 'error':
        return 'bg-error-100 text-error-800';
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              FitBook Auto
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/credentials"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Credentials
              </Link>
              <Link
                href="/preferences"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Preferences
              </Link>
              <Link
                href="/history"
                className="text-primary-600 border-b-2 border-primary-600 px-3 py-2 text-sm font-medium"
              >
                History
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking History</h1>
            <p className="mt-2 text-sm text-gray-700">
              View all past booking attempts and their results.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button
              onClick={() => handleRunBooking(true)}
              disabled={runBookingMutation.isPending}
              className="inline-flex items-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Dry Run
            </button>
            <button
              onClick={() => handleRunBooking(false)}
              disabled={runBookingMutation.isPending}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {runBookingMutation.isPending ? 'Running...' : 'Run Booking'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-4">
          <div>
            <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-700">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
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
            <label htmlFor="result-filter" className="block text-sm font-medium text-gray-700">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">All Results</option>
              <option value="success">Success</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* History List */}
        <div className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : history && history.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {history.map((record) => (
                  <li key={record.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{getResultIcon(record.result)}</span>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {record.class_name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {record.studio_name} · {' '}
                                <span className="capitalize">{record.platform}</span>
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm text-gray-500">
                            <div>
                              <p>
                                <span className="font-medium">Class Time:</span>{' '}
                                {new Date(record.class_datetime).toLocaleString()}
                              </p>
                              {record.instructor && (
                                <p>
                                  <span className="font-medium">Instructor:</span> {record.instructor}
                                </p>
                              )}
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">Attempted:</span>{' '}
                                {new Date(record.attempt_timestamp).toLocaleString()}
                              </p>
                              <p>
                                <span className="font-medium">Duration:</span>{' '}
                                {(record.execution_time_ms / 1000).toFixed(1)}s
                              </p>
                            </div>
                          </div>
                          {record.error_message && (
                            <div className="mt-2 text-sm text-error-600">
                              <span className="font-medium">Error:</span> {record.error_message}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getResultBadge(
                              record.result
                            )}`}
                          >
                            {record.result}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center bg-white rounded-lg shadow py-12">
              <p className="text-gray-500">
                No booking history yet. Run a booking to see results here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
