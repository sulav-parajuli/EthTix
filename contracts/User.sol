//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
import "./AccessControl.sol";


contract User is AccessControl{
//Mapping to store user CID
   mapping (address=> string) public userCID;

   //bool mapping to check if user is registered
   mapping(address=>bool) public isUsers;
   //event to be emitted when user is registered
   event UserRegistered(address indexed userAddress,string indexed CID);
   //Function to registera user and store their CID
   function registerUser(string memory _CID) public{
       require(bytes(_CID).length>0,"CID cannot be empty");
       userCID[msg.sender]=_CID;
       isUsers[msg.sender]=true;
       emit UserRegistered(msg.sender,_CID);
   }
     modifier onlyUser(){
       require(isUsers[msg.sender],"Only registered users can call this function");
       _;
   }
   //Function to get userId by particular address
   function getUserCID(address _userAddress) public view returns(string memory){
      require(_userAddress!=address(0),"Invalid address");
      require(msg.sender==owner || msg.sender==_userAddress ,"Only owner or user can call this function");
      return userCID[_userAddress];
   }  
     function isRegisteredUser(address _UserAddress)public view returns(bool){
return isUsers[_UserAddress];
    }
}
