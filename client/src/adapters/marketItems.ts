import axios from 'axios';
const apiURL = process.env.REACT_APP_API_URL;
const URL = `${apiURL}/marketItems`;
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
      return res.data;
    });
}
export async function getCollections() {
  return await axios
    .get(`${URL}/collections`, { withCredentials: true })
    .then((res): any => {
      return res.data;
    });
}
export async function getCollection(id: String) {
  return await axios
    .get(`${URL}/collection/${id}`, { withCredentials: true })
    .then((res): any => {
      return res.data.collection;
    });
}

export async function addLike(like: {
  collectionContractAddress: String;
  tokenId: Number;
  nftName: String;
  email: String;
}) {
  return await axios
    .post(
      `${URL}/likes`,
      {
        collectionContractAddress: like.collectionContractAddress,
        tokenId: like.tokenId,
        nftName: like.nftName,
        email: like.email,
      },
      { withCredentials: true }
    )
    .then((res): any => {
      return res.data;
    });
}
export async function getLikes(collectionContractAddress: String) {
  return await axios
    .get(`${URL}/likes/${collectionContractAddress}`, { withCredentials: true })
    .then((res): any => {
      return res.data;
    });
}
export async function deleteLike(id: Number) {
  return await axios
    .delete(`${URL}/likes/${id}`, { withCredentials: true })
    .then((res): any => {
      return res.data;
    });
}

export async function addTransaction(transaction: {
  collectionContractAddress: String;
  tokenId: Number;
  event: String;
  price?: Number;
  from?: String;
  to?: String;
  blockNumber: Number;
  txHash: String;
}) {
  return await axios
    .post(
      `${URL}/transactions`,
      {
        collectionContractAddress: transaction.collectionContractAddress,
        tokenId: transaction.tokenId,
        event: transaction.event,
        price: transaction.price,
        from: transaction.from,
        to: transaction.to,
        blockNumber: transaction.blockNumber,
        txHash: transaction.txHash,
      },
      { withCredentials: true }
    )
    .then((res): any => {
      return res.data;
    });
}
export async function getTransactions(
  collectionContractAddress: String,
  tokenId: String
) {
  return await axios
    .get(`${URL}/transactions/${collectionContractAddress}/${tokenId}`, {
      withCredentials: true,
    })
    .then((res): any => {
      return res.data;
    });
}
export async function collectionTransactions(
  collectionContractAddress: String
) {
  return await axios
    .get(`${URL}/allTransactions/${collectionContractAddress}`, {
      withCredentials: true,
    })
    .then((res): any => {
      return res.data;
    });
}
export async function updateTradedVolume(
  contractAddress: String,
  volume: Number
) {
  return await axios
    .put(
      `${URL}/collection`,
      {
        contractAddress: contractAddress,
        volume: volume,
      },
      { withCredentials: true }
    )
    .then((res): any => {
      return res.data;
    });
}
