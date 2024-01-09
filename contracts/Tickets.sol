//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
import "./AccessControl.sol";

import "./EventOrganizer.sol";
contract Tickets is AccessControl,EventOrganizer{
    struct Event{
        string eventCID;
        uint256 totalTickets;
        uint256 remTickets;
        uint256 price;
        address payable creator;
        
    }
    struct TicketHolder{
        address userAddress;
        string eventName;
        uint eventId;
        uint ticketsOwned;
    }
    //Mapping to store events
    mapping(uint256 => Event) public events;
    //Mapping to store ticket holders
    mapping(address => TicketHolder[]) public ticketHolders;
  
    uint256 eventId;
   
    event EventCreated(uint256 indexed eventId);
    event TicketPurchased(uint256 indexed eventId,address indexed buyer);

   //function to retrieve the IPFS CID of the event
   function getIpfsCID(uint256 _eventId)public view returns(string memory){
      require(_eventId>0 &&_eventId <= eventId, "Event does not exist");
        return events[_eventId].eventCID;
   }
   

    //function to create event
    function createEvent(
    string memory _eventCid,
    uint256 _totalTickets,
    uint256 _price
    //string memory _eventImageCid
   
) public onlyOrganizer payable  {
    require(bytes(_eventCid).length > 0, "Event CID should not be empty");
   // require(bytes(_eventImageCid).length > 0, "Event Image CID should not be empty");
    require(_totalTickets > 0, "Total tickets should be greater than 0");
   

    //calculate creation fee and check if enough ether is sent
    uint256 eventCreationFee= (_price*_totalTickets*3)/100;
    require(msg.value>=eventCreationFee,"Not enough ether sent");
    uint256 excessAmount = msg.value - eventCreationFee;
    if (excessAmount > 0) {
        payable(msg.sender).transfer(excessAmount);
    }

    //send fee to owner
    owner.transfer(eventCreationFee);
    eventId++;
    emit EventCreated(eventId);
    
   
    events[eventId] = Event({
       eventCID:_eventCid,
       totalTickets: _totalTickets,
       remTickets: _totalTickets,
       price: _price,
       creator:payable(msg.sender)
       //eventImageCID:_eventImageCid
    }
    );
    
}


 function getAllEvents() public  view returns (Event[] memory) {
    //creates a new dynamic array of type Event with a length equal to the current value of the eventId variable
        Event[] memory allEvents = new Event[](eventId);

        for (uint256 i = 1; i <= eventId; i++) {
            allEvents[i - 1] = events[i];
        }

        return allEvents;
    }

    //funtion to  buy Tickets
    function buyTicket(uint256 _eventId,uint256 _totalAmount, uint256 _totalTickets) public  payable{
        require(_eventId<=eventId,"Event does not exist");
        
        require(_totalAmount>0,"Total tickets should be greater than 0");
        require(events[_eventId].remTickets>=_totalTickets,"Not enough tickets left");
       
        //transfer funds to the event creator
       events[_eventId].creator.transfer(_totalAmount);
       //Update the remaining tickets
       events[_eventId].remTickets-= _totalAmount;
        

       //update the ticket holders mapping

        
        
        TicketHolder[] storage userTickets = ticketHolders[msg.sender];
        userTickets.push(TicketHolder(msg.sender,events[_eventId].eventCID,_eventId,_totalTickets));
        emit TicketPurchased(_eventId,msg.sender);

    }
   
    }
