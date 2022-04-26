import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { me, logout } from '../adapters/user';
import { useMutation, useQuery, useQueryClient } from 'react-query';

//useIsAuth is used to verify the user is logged in before they can view the page
export const useIsAuth = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch, isFetching } = useQuery('me', me);
  useEffect(() => {
    if (!data?.id) {
      // if the user is not logged in the router will take the user to the login page
      //once the user logs in the router with proceed forward by taking the end user to their intended page
      navigate('/login');
    } else {
      navigate('/');
    }
  }, [isFetching, data, navigate]);
};
