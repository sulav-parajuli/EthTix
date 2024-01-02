//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

import "./AccessControl.sol";
import "./User.sol";
contract EventOrganizer is AccessControl,User{

   //mapping to store organizer CID
   mapping(address=>string) public organizerCID;
    //event to be emitted when organizer is registered

    //bool mapping to check if user is organizer
   mapping(address=>bool) public organizers;
   event OrganizerRegistered(address indexed organizerAddress,string indexed CID);

    //function to register organizer and store their CID
   function registerEventOrganizer(string memory _CID)public {
    require(bytes(_CID).length>0,"CID cannot be empty");
    organizerCID[msg.sender]=_CID; 
    organizers[msg.sender]=true;
    emit OrganizerRegistered(msg.sender,_CID);
   }
   modifier onlyOrganizer(){
       require(organizers[msg.sender]==true,"Only registered organizers can call this function");
       _;
   }

    //function to get organizer CID by particular address
    function getOrganizerCID(address _organizerAddress)public onlyOrganizer view returns(string memory){
         require(_organizerAddress!=address(0),"Invalid address");
         require(msg.sender==owner || msg.sender==_organizerAddress ,"Only owner or organizer can call this function");
         return organizerCID[_organizerAddress];
    }
    
    
       

    
   
   
}