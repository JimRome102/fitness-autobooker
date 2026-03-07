'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  usePreferences,
  useCreatePreference,
  useDeletePreference,
  useUpdatePreference,
} from '@/hooks/usePreferences';
import { Platform, Priority } from '@/utils/api';

export default function PreferencesPage() {
  const { data: preferences } = usePreferences();
  const createMutation = useCreatePreference();
  const updateMutation = useUpdatePreference();
  const deleteMutation = useDeletePreference();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'classpass' as Platform,
    studio_name: '',
    class_name: '',
    class_date: '',
    class_time: '',
    instructor: '',
    priority: 'medium' as Priority,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      setFormData({
        platform: 'classpass',
        studio_name: '',
        class_name: '',
        class_date: '',
        class_time: '',
        instructor: '',
        priority: 'medium',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create preference:', error);
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: { is_active: !currentState },
      });
    } catch (error) {
      console.error('Failed to update preference:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this preference?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete preference:', error);
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'low':
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
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
                className="text-white border-b-2 border-purple-400 px-3 py-2 text-sm font-medium"
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
            <h1 className="text-4xl font-bold text-white mb-2">Booking Preferences</h1>
            <p className="text-gray-300">
              Configure which classes to book automatically each month.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {showForm ? 'Cancel' : '+ Add Preference'}
          </button>
        </div>

        {/* Add Preference Form */}
        {showForm && (
          <div className="mb-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Add New Preference</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value as Priority })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label htmlFor="studio_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Studio Name
                </label>
                <input
                  type="text"
                  id="studio_name"
                  required
                  value={formData.studio_name}
                  onChange={(e) => setFormData({ ...formData, studio_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="e.g., Barrys Lincoln Park"
                />
              </div>

              <div>
                <label htmlFor="class_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Class Name
                </label>
                <input
                  type="text"
                  id="class_name"
                  required
                  value={formData.class_name}
                  onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="e.g., Full Body"
                />
              </div>

              <div>
                <label htmlFor="class_date" className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="class_date"
                  required
                  value={formData.class_date}
                  onChange={(e) => setFormData({ ...formData, class_date: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="class_time" className="block text-sm font-medium text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  id="class_time"
                  required
                  value={formData.class_time}
                  onChange={(e) => setFormData({ ...formData, class_time: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-300 mb-2">
                  Instructor (Optional)
                </label>
                <input
                  type="text"
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="e.g., Sarah Johnson"
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3">
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
                  {createMutation.isPending ? 'Saving...' : 'Save Preference'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Preferences List */}
        <div>
          {preferences && preferences.length > 0 ? (
            <div className="space-y-4">
              {preferences.map((pref) => (
                <div
                  key={pref.id}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-2xl font-bold text-white">{pref.class_name}</h3>
                        <span className={`px-3 py-1 border text-xs font-medium rounded-full ${getPriorityBadge(pref.priority)}`}>
                          {pref.priority}
                        </span>
                        {pref.is_active ? (
                          <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-medium rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-500/20 border border-gray-500/30 text-gray-300 text-xs font-medium rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300">
                        <div>
                          <span className="text-gray-400">Studio:</span> {pref.studio_name}
                        </div>
                        <div>
                          <span className="text-gray-400">Platform:</span>{' '}
                          <span className="capitalize">{pref.platform}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Date:</span>{' '}
                          {new Date(pref.class_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-gray-400">Time:</span> {pref.class_time}
                        </div>
                        {pref.instructor && (
                          <div className="col-span-2">
                            <span className="text-gray-400">Instructor:</span> {pref.instructor}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleToggleActive(pref.id, pref.is_active)}
                        disabled={updateMutation.isPending}
                        className={`px-4 py-2 font-medium rounded-lg transition-all disabled:opacity-50 ${
                          pref.is_active
                            ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-300'
                            : 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300'
                        }`}
                      >
                        {pref.is_active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDelete(pref.id)}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-medium rounded-lg transition-all disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl py-16">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No preferences yet</h3>
              <p className="text-gray-400 mb-6">Add your first booking preference to start automating</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                + Add Preference
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
