'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCredentials, useCreateCredential, useDeleteCredential } from '@/hooks/useCredentials';
import { Platform } from '@/utils/api';

export default function CredentialsPage() {
  const { data: credentials, isLoading } = useCredentials();
  const createMutation = useCreateCredential();
  const deleteMutation = useDeleteCredential();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'classpass' as Platform,
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      setFormData({ platform: 'classpass', username: '', password: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create credential:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credential?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete credential:', error);
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
                className="text-primary-600 border-b-2 border-primary-600 px-3 py-2 text-sm font-medium"
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
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
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
            <h1 className="text-3xl font-bold text-gray-900">Platform Credentials</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your login credentials for ClassPass, Mindbody, and other platforms.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {showForm ? 'Cancel' : 'Add Credential'}
          </button>
        </div>

        {/* Add Credential Form */}
        {showForm && (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Add New Credential
              </h3>
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                    Platform
                  </label>
                  <select
                    id="platform"
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value as Platform })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  >
                    <option value="classpass">ClassPass</option>
                    <option value="mindbody">Mindbody</option>
                    <option value="barrys">Barrys Bootcamp</option>
                    <option value="slt">SLT</option>
                    <option value="y7">Y7 Studio</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username / Email
                  </label>
                  <input
                    type="text"
                    id="username"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {createMutation.isPending ? 'Saving...' : 'Save Credential'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Credentials List */}
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : credentials && credentials.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {credentials.map((credential) => (
                  <li key={credential.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-600 font-semibold text-sm uppercase">
                                {credential.platform.substring(0, 2)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {credential.platform}
                            </div>
                            <div className="text-sm text-gray-500">
                              {credential.is_active ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Inactive
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(credential.id)}
                          disabled={deleteMutation.isPending}
                          className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-error-700 bg-error-100 hover:bg-error-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center bg-white rounded-lg shadow py-12">
              <p className="text-gray-500">No credentials yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
