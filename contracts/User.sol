//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./AccessControl.sol";
contract User is  AccessControl{
using ECDSA for bytes32;



//State variables to keep track of User
uint256 public userCount;

//Event to track user registration
 event UserRegistered(address indexed userAddress, bytes32 hashedDetails);

 //Function to register user
 function registeredUser(bytes32 _hasheddetails,bytes memory _signedHash) public{
    //Check if user is already registered
    require(!UserHashes[msg.sender],"User already registered");

    //Verify the user's signature
    require(_hasheddetails.isValidSignatureNow(msg.sender,_signedHash),"Invalid signature");
    //Mark the user as registered
    UserHashes[msg.sender]= true;

    //Increment user count
    userCount++;
    emit UserRegistered(msg.sender,_hasheddetails);
 }

}
