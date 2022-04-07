//SPDX-License-Identifier: UNLICENSED
//Solidity is an object-oriented, high-level language for implementing smart contracts. Smart contracts are programs which govern the behaviour of accounts within the Ethereum state.

pragma solidity ^0.8.0;
//creating a contract named Transactions
contract Transactions {
  //uint256 is an integer type and its value type can handle only non-negative numbers.
  uint256 transactionCount;
  //Event is an inheritable member of a contract. An event is emitted, it stores the arguments passed in transaction logs. These logs are stored on blockchain and are accessible using address of the contract till the contract is present on the blockchain. An event generated is not accessible from within contracts, not even the one which have created and emitted them.
  event Transfer(address from, address reciever, uint amount, string message, uint256 timestamp, string keyword );
  //Solidity gives us the flexibility to create our own data type using struct, which is just a collection of variables under a single name. This allows us to organize data according to our needs.
  struct TransferStruct {
    address sender;
    address reciever;
    uint amount;
    string message;
    uint256 timestamp;
    string keyword;
  }

  TransferStruct[] transactions;

  function addToBlockchain(address payable reciever, uint amount, string memory message, string memory keyword) public {
    transactionCount += 1;
    transactions.push(TransferStruct(msg.sender, reciever, amount, message, block.timestamp, keyword));

    emit Transfer(msg.sender, reciever, amount, message, block.timestamp, keyword);
  }

  function getAllTransactions() public view returns (TransferStruct[] memory) {
    return transactions;

  }
  function getTransactionCount() public view returns (uint256) {
    return transactionCount;
  }
}