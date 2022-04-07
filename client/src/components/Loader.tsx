import React from 'react';

interface LoaderProps {}

export const Loader: React.FC<LoaderProps> = ({}) => {
  return (
    <div className="flex justify-center items-center py-3">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700" />
    </div>
  );
};
