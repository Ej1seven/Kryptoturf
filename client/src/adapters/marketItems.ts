import axios from 'axios';
const URL = 'http://localhost:3001/marketItems';
export let collectionItem: any;

export async function collection(collectionId: any) {
  return await axios
    .post(
      `${URL}/collection`,
      { collectionId: collectionId },
      { withCredentials: true }
    )
    .then((res): any => {
      console.log(res.data);
      collectionItem = res.data;
      return res.data;
    });
}
