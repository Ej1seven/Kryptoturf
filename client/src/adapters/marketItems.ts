import axios from 'axios';
const URL = 'http://localhost:3001/marketItems';
export let collectionItem: any;

export async function createCollection(collection: {
  title: String;
  contractAddress: String;
  description?: String;
  createdBy: String;
  volumeTraded?: Number;
  floorPrice?: Number;
  owners: String[];
  profileImage?: String;
  bannerImage?: String;
  logoImage?: String;
}) {
  console.log(collection);
  return await axios
    .post(
      `${URL}/collection`,
      {
        title: collection.title,
        contractAddress: collection.contractAddress,
        description: collection.description,
        createdBy: collection.createdBy,
        volumeTraded: collection.volumeTraded,
        floorPrice: collection.floorPrice,
        owners: collection.owners,
        profileImage: collection.profileImage,
        bannerImage: collection.bannerImage,
        logoImage: collection.logoImage,
      },
      { withCredentials: true }
    )
    .then((res): any => {
      console.log(res.data);
      // collectionItem = res.data;
      return res.data;
    });
}
export async function getCollections() {
  return await axios
    .get(`${URL}/collections`, { withCredentials: true })
    .then((res): any => {
      console.log(res.data);
      return res.data;
    });
}
export async function getCollection(id: String) {
  return await axios
    .get(`${URL}/collection/${id}`, { withCredentials: true })
    .then((res): any => {
      console.log(res.data);
      return res.data.collection;
    });
}

export async function addLike(like: {
  collectionContractAddress: String;
  tokenId: Number;
  nftName: String;
}) {
  console.log(like);
  return await axios
    .post(
      `${URL}/likes`,
      {
        collectionContractAddress: like.collectionContractAddress,
        tokenId: like.tokenId,
        nftName: like.nftName,
      },
      { withCredentials: true }
    )
    .then((res): any => {
      console.log(res.data);
      // collectionItem = res.data;
      return res.data;
    });
}
export async function getLikes(collectionContractAddress: String) {
  console.log(collectionContractAddress);
  return await axios
    .get(`${URL}/likes/${collectionContractAddress}`, { withCredentials: true })
    .then((res): any => {
      console.log(res.data);
      return res.data;
    });
}
