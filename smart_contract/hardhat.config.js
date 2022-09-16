//https://eth-ropsten.alchemyapi.io/v2/SX36abl-pGK543NVx4X7l9XJNNIqu8C-

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/SX36abl-pGK543NVx4X7l9XJNNIqu8C-',
      accounts: [
        'e5cff1fcb3bb9263947919ac9cc412624884e542adf0efcde690f1a232c78516',
      ],
    },
    rinkeby: {
      url: 'https://eth-.alchemyapi.io/v2/hKF-ScD-E399jeGhRfiT0VkwkUzeoJ8g',
      accounts: [
        'e5cff1fcb3bb9263947919ac9cc412624884e542adf0efcde690f1a232c78516',
      ],
    },
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/4ht15HX4e4b3kFaopvBKras7Ueaphi4p',
      accounts: [
        'e5cff1fcb3bb9263947919ac9cc412624884e542adf0efcde690f1a232c78516',
      ],
    },
  },
};
