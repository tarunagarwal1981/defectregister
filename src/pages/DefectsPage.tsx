// src/pages/DefectsPage.tsx
import { useEffect } from 'react';
import { DefectsTable } from '@/components/ui/table';
import { useDefects } from '@/hooks/useDefects';

export const DefectsPage = () => {
  const { defects, loading, error, fetchDefects } = useDefects();

  useEffect(() => {
    fetchDefects();
  }, [fetchDefects]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Defects Register</h1>
          <button
            onClick={() => {/* TODO: Add defect modal */}}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Add New Defect
          </button>
        </div>
        <DefectsTable 
          data={defects}
          onEdit={(defect) => {/* TODO: Edit defect modal */}}
        />
      </div>
    </div>
  );
};
