//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
import "./User.sol";
import "./AccessControl.sol";

contract AccessControl is User,EventOrganizer{

//Mapping to track registered users
mapping(address => bool) public UserHashes;

//Mapping to tract if user is organizer
mapping(address => bool) public organizers;

//State variables
address payable public owner;

constructor(){
    owner = payable(msg.sender);

}

modifier isOwner({
    require(msg.sender == owner,"Only owner can call this function");
    _;
}) 

modifier isOrganizer(){
    require(organizers[msg.sender],"Only organizer can call this function");
    _;
}
modifier isUser(){
    require(UserHashes[msg.sender],"Only user can call this function");
    _;

}}