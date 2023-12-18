//SPDX-License-Identifier:MIT
pragma solidity ^0.8.18;
contract Tickets{
    struct Event{
        string eventName;
        uint256 price; // Price is in Wei
        uint256 timestamp;
        uint256 totalTickets;
        uint256 remTickets;
        string location;
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
    //event mapping address
    //State variables
    uint256 eventId;
    address payable public owner;
    event EventCreated(uint256 indexed eventId);
    event TicketPurchased(uint256 indexed eventId,uint256 indexed ticketsBought,address indexed buyer);


    constructor(){
        owner = payable(msg.sender);
    }

    //function to create event
    function createEvent(
    string memory _eventName,
    uint256 _price,
    uint256 _timestamp,
    uint256 _totalTickets,
    string memory _location
) public payable  {
    require(_totalTickets > 0, "Total tickets should be greater than 0");
    require(bytes(_eventName).length > 0, "Event name should not be empty");
    require(bytes(_location).length > 0, "Location should not be empty");
    require(_timestamp > block.timestamp, "Invalid Timestamp");

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
    
   
    events[eventId] = Event(
        _eventName,
        _price,
        _timestamp,
        _totalTickets,
        _totalTickets,
        _location,
        payable(msg.sender)
    );
    
}

function getEvent(uint256 _eventId) public view returns (
    string memory eventName,
    uint256 price,
    uint256 timestamp,
    uint256 totalTickets,
    uint256 remTickets,
    string memory location,
    address payable creator
) {
    require(_eventId>0 &&_eventId <= eventId, "Event does not exist");
    
    Event storage retrievedEvent = events[_eventId];
    return (
        retrievedEvent.eventName,
        retrievedEvent.price,
        retrievedEvent.timestamp,
        retrievedEvent.totalTickets,
        retrievedEvent.remTickets,
        retrievedEvent.location,
        retrievedEvent.creator
    );
}


    //funtion to  buy Tickets
    function buyTicket(uint256 _eventId,uint256 _totalTicketsToBuy) public payable{
        require(_eventId<=eventId,"Event does not exist");
        require(_totalTicketsToBuy>0,"Total tickets should be greater than 0");
        require(events[_eventId].remTickets>=_totalTicketsToBuy,"Not enough tickets available");
        require(events[_eventId].timestamp>block.timestamp,"Event has already expired");
        uint256 totalPrice =(events[_eventId].price*_totalTicketsToBuy);
        require(msg.value>=totalPrice,"Not enough ether sent");
        uint256 excessAmount = msg.value - totalPrice;
        if (excessAmount > 0) {
        payable(msg.sender).transfer(excessAmount);
        }
        events[_eventId].remTickets-= _totalTicketsToBuy;

        events[_eventId].creator.transfer(totalPrice);
        
        
        TicketHolder[] storage userTickets = ticketHolders[msg.sender];
        userTickets.push(TicketHolder(msg.sender,events[_eventId].eventName,_eventId,_totalTicketsToBuy));
        emit TicketPurchased(_eventId,_totalTicketsToBuy,msg.sender);

    }
   
    }
