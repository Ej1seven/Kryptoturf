import { useEffect, useState } from 'react';
/*API_KEY is provided by giphy.com */
const API_KEY = process.env.REACT_APP_GIPHY_API;
/*useFetch takes the keyword provided by the user and fetches a giphy from giphy.com.
  The giphy is then returned back to the user. */
const useFetch = ({ keyword }: any) => {
  const [gifUrl, setGifUrl] = useState('');
  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword
          .split(' ')
          .join('')}&limit=1`
      );
      const { data } = await response.json();
      setGifUrl(data[0]?.images?.downsized_medium.url);
    } catch (error) {
      setGifUrl(
        'https://media4.popsugar-assets.com/files/2013/11/07/832/n/1922398/eb7a69a76543358d_28.gif'
      );
    }
  };
  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);
  return gifUrl;
};

export default useFetch;
