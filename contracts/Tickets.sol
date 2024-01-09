//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;


//import "./EventOrganizer.sol";
contract Tickets{
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
    //Mapping to store events created by organizer
    mapping(address => uint256[]) public eventsCreated;
     //mapping to store organizer CID
    mapping(address=>string) public organizerCID;

    //bool mapping to check if user is organizer
    mapping(address=>bool) public organizers;
    //State variables
    address payable public owner;
    uint256 eventId;
    constructor(){
    owner = payable(msg.sender);

    }
    
    event OrganizerRegistered(address indexed organizerAddress,string indexed CID);
    event EventCreated(uint256 indexed eventId,address indexed organizer);
    event TicketPurchased(uint256 indexed eventId,uint256 indexed ticketsBought,address indexed buyer);
   
   //function to register organizer and store their CID
    function registerEventOrganizer(string memory _CID)public {
    require(bytes(_CID).length>0,"CID cannot be empty");
    organizerCID[msg.sender]=_CID; 
    organizers[msg.sender]=true;
    emit OrganizerRegistered(msg.sender,_CID);
   }

    //function to get organizer CID by particular address
    function getOrganizerCID(address _organizerAddress)public view returns(string memory){
         require(_organizerAddress!=address(0),"Invalid address");
         require(msg.sender==owner || organizers[msg.sender] ,"Only owner or organizer can call this function");
         return organizerCID[_organizerAddress];
    }
    //function to check if user is organizer
    function isOrganizers(address _organizerAddress)public view returns(bool){
    return organizers[_organizerAddress];
    }
   

    //function to create event
    function createEvent(
    string memory _eventCid,
    uint256 _totalTickets,
    uint256 _price
    //string memory _eventImageCid
   
) public  payable  {
    require(bytes(_eventCid).length > 0, "Event CID should not be empty");
    require(isOrganizers(msg.sender),"Only organizer can create event");
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
    emit EventCreated(eventId, msg.sender);
    
   
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


   //funtion to buy Tickets
function buyTicket(uint256 _eventId, uint256 _totalTicketsToBuy) public payable {
    require(_eventId <= eventId, "Event does not exist");
    require(events[_eventId].remTickets >= _totalTicketsToBuy, "Not enough tickets left");
    uint256 totalPrice = events[_eventId].price * _totalTicketsToBuy;
    require(msg.value >= totalPrice, "Not enough ether sent");

    // Transfer excess amount back to the buyer
    uint256 excessAmount = msg.value - totalPrice;
    if (excessAmount > 0) {
        payable(msg.sender).transfer(excessAmount);
    }

    // Transfer funds to the event creator
    events[_eventId].creator.transfer(totalPrice);

    // Update the remaining tickets
    events[_eventId].remTickets -= _totalTicketsToBuy;

    // Update the ticket holders mapping
    TicketHolder[] storage userTickets = ticketHolders[msg.sender];
    userTickets.push(TicketHolder(msg.sender, events[_eventId].eventCID, _eventId, _totalTicketsToBuy));
    emit TicketPurchased(_eventId, _totalTicketsToBuy, msg.sender);
}

    }
