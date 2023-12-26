//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
import "./User.sol";
import "./AccessControl.sol";
contract EventOrganizer is AccessControl,User{

   

    //State variables
    uint256 public organizerCount;

    //Event to track organizer registration
    event OrganizerRegistered(address indexed organizerAddress);



}