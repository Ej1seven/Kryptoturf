import React from 'react';
import { useParams } from 'react-router-dom';

interface CollectionsProps {}

export const Collections: React.FC<CollectionsProps> = ({}) => {
  let { id } = useParams();

  return <>{id}</>;
};
