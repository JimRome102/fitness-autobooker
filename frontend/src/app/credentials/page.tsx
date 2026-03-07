'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCredentials, useCreateCredential, useDeleteCredential } from '@/hooks/useCredentials';
import { Platform } from '@/utils/api';

export default function CredentialsPage() {
  const { data: credentials } = useCredentials();
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
                className="text-white border-b-2 border-purple-400 px-3 py-2 text-sm font-medium"
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
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
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
            <h1 className="text-4xl font-bold text-white mb-2">Platform Credentials</h1>
            <p className="text-gray-300">
              Manage your login credentials for ClassPass, Mindbody, and other platforms.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {showForm ? 'Cancel' : '+ Add Credential'}
          </button>
        </div>

        {/* Add Credential Form */}
        {showForm && (
          <div className="mb-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Add New Credential</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  id="platform"
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value as Platform })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="classpass">ClassPass</option>
                  <option value="mindbody">Mindbody</option>
                  <option value="barrys">Barrys Bootcamp</option>
                  <option value="slt">SLT</option>
                  <option value="y7">Y7 Studio</option>
                </select>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username / Email
                </label>
                <input
                  type="text"
                  id="username"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 transition-all"
                >
                  {createMutation.isPending ? 'Saving...' : 'Save Credential'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Credentials List */}
        <div>
          {credentials && credentials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credentials.map((credential) => (
                <div
                  key={credential.id}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg uppercase">
                        {credential.platform.substring(0, 2)}
                      </span>
                    </div>
                    {credential.is_active ? (
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-medium rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-500/20 border border-gray-500/30 text-gray-300 text-xs font-medium rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white capitalize mb-2">
                    {credential.platform}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4">
                    Added {new Date(credential.created_at).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => handleDelete(credential.id)}
                    disabled={deleteMutation.isPending}
                    className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-medium rounded-lg transition-all disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl py-16">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔐</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No credentials yet</h3>
              <p className="text-gray-400 mb-6">Add your first platform credential to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                + Add Credential
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
