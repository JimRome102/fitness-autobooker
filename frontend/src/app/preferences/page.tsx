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
  const { data: preferences, isLoading } = usePreferences();
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

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
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
                className="text-primary-600 border-b-2 border-primary-600 px-3 py-2 text-sm font-medium"
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
            <h1 className="text-3xl font-bold text-gray-900">Booking Preferences</h1>
            <p className="mt-2 text-sm text-gray-700">
              Configure which classes to book automatically each month.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {showForm ? 'Cancel' : 'Add Preference'}
          </button>
        </div>

        {/* Add Preference Form */}
        {showForm && (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Add New Preference
              </h3>
              <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as Priority })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="studio_name" className="block text-sm font-medium text-gray-700">
                    Studio Name
                  </label>
                  <input
                    type="text"
                    id="studio_name"
                    required
                    value={formData.studio_name}
                    onChange={(e) => setFormData({ ...formData, studio_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                    placeholder="e.g., Barrys Lincoln Park"
                  />
                </div>

                <div>
                  <label htmlFor="class_name" className="block text-sm font-medium text-gray-700">
                    Class Name
                  </label>
                  <input
                    type="text"
                    id="class_name"
                    required
                    value={formData.class_name}
                    onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                    placeholder="e.g., Full Body"
                  />
                </div>

                <div>
                  <label htmlFor="class_date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="class_date"
                    required
                    value={formData.class_date}
                    onChange={(e) => setFormData({ ...formData, class_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label htmlFor="class_time" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    id="class_time"
                    required
                    value={formData.class_time}
                    onChange={(e) => setFormData({ ...formData, class_time: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                    Instructor (Optional)
                  </label>
                  <input
                    type="text"
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end space-x-3">
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
                    {createMutation.isPending ? 'Saving...' : 'Save Preference'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preferences List */}
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : preferences && preferences.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {preferences.map((pref) => (
                  <li key={pref.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{pref.class_name}</h3>
                            <span
                              className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                pref.priority
                              )}`}
                            >
                              {pref.priority}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm text-gray-500">
                            <div>
                              <p>
                                <span className="font-medium">Studio:</span> {pref.studio_name}
                              </p>
                              <p>
                                <span className="font-medium">Platform:</span>{' '}
                                <span className="capitalize">{pref.platform}</span>
                              </p>
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">Date:</span>{' '}
                                {new Date(pref.class_date).toLocaleDateString()}
                              </p>
                              <p>
                                <span className="font-medium">Time:</span> {pref.class_time}
                              </p>
                            </div>
                            {pref.instructor && (
                              <p className="col-span-2">
                                <span className="font-medium">Instructor:</span> {pref.instructor}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleActive(pref.id, pref.is_active)}
                            disabled={updateMutation.isPending}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                              pref.is_active
                                ? 'text-warning-700 bg-warning-100 hover:bg-warning-200 focus:ring-warning-500'
                                : 'text-success-700 bg-success-100 hover:bg-success-200 focus:ring-success-500'
                            }`}
                          >
                            {pref.is_active ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleDelete(pref.id)}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-error-700 bg-error-100 hover:bg-error-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center bg-white rounded-lg shadow py-12">
              <p className="text-gray-500">No preferences yet. Add one to start booking!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
