import React from 'react';
import './MainSkeleton.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MainSkeleton = () => {
  return (
    <div className="skeleton">
      <Skeleton className="skeleton-video" />
      <Skeleton className="skeleton-buttons" />
    </div>
  );
};

export default MainSkeleton;