//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

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
   
     //mapping to store organizer CID
    mapping(address=>string) public organizerCID;

    //bool mapping to check if user is organizer
    mapping(address=>bool) public organizers;
    //State variables
    address payable public owner;
    //Array to store all organizers
    address[] public allOrganizers;
    //Array to store Events
    Event[] public allEvents;
    //Array of organizer cid
    string[] public allOrganizerCid;
    //array to store all ticket holders address 
    address[] public allTicketHolders;

    uint256 eventId;

    //Constructor
    constructor(){
    owner = payable(msg.sender);

    }
    
    event OrganizerRegistered(address indexed organizerAddress,string CID,uint256 registerTime);
    event EventCreated(uint256 eventId,address indexed organizer, string eventCid , uint256 creationTime);
    event TicketPurchased(uint256 eventId,uint256 ticketsBought,address indexed buyer , uint256 purchaseTime);
   
   //function to register organizer and store their CID
    function registerEventOrganizer(string memory _CID)public {
    require(bytes(_CID).length>0,"CID cannot be empty");
    organizerCID[msg.sender]=_CID; 
    organizers[msg.sender]=true;
    allOrganizers.push(msg.sender);
    allOrganizerCid.push(_CID);
    emit OrganizerRegistered(msg.sender,_CID,block.timestamp);
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
     ) public  payable  {
    require(bytes(_eventCid).length > 0, "Event CID should not be empty");
    require(isOrganizers(msg.sender),"Only organizer can create event");
   // require(bytes(_eventImageCid).length > 0, "Event Image CID should not be empty");
    require(_totalTickets > 0, "Total tickets should be greater than 0");
    require(!isOwner(),"Owner cannot create event");
    //calculate creation fee and check if enough ether is sent
    uint256 eventCreationFee= (_price*_totalTickets*3)/100;
    require(msg.value>=eventCreationFee,"Not enough ether sent");
    //send fee to owner
    owner.transfer(eventCreationFee);
    //send excess ether back to organizer
    uint256 excessAmount = msg.value - eventCreationFee;
    if (excessAmount > 0) {
        payable(msg.sender).transfer(excessAmount);
    }
    
    eventId++;
    emit EventCreated(eventId, msg.sender, _eventCid, block.timestamp);
    events[eventId] = Event({
       eventCID:_eventCid,
       totalTickets: _totalTickets,
       remTickets: _totalTickets,
       price: _price,
    creator:payable(msg.sender)
       
    }
   
    );
     allEvents.push(events[eventId]);
}
    //function to check if user is owner
    function isOwner() public view returns(bool){
    return msg.sender==owner;
    }


    function getAllEvents() public  view returns (Event[] memory) {

        return allEvents;
    }

    // Function to get all organizers
    function getAllOrganizers() public view returns (address[] memory) {
        require(isOwner(), "Only owner can view all organizers");
        return allOrganizers;
    }
    function getAllOrganizerCID()public view returns(string[]memory)
    {
        return allOrganizerCid;
    }


   //funtion to buy Tickets
    function buyTicket(uint256 _eventId, uint256 _totalTicketsToBuy) public payable {
    require(_eventId <= eventId, "Event does not exist");
    require(events[_eventId].remTickets >= _totalTicketsToBuy, "Not enough tickets left");
    require(!isOrganizers(msg.sender), "Organizer cannot buy tickets for their own event");
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

    //update allEvents array
    allEvents[_eventId-1].remTickets=events[_eventId].remTickets;

    // Update the ticket holders mapping
    TicketHolder[] storage userTickets = ticketHolders[msg.sender];
    userTickets.push(TicketHolder(msg.sender, events[_eventId].eventCID, _eventId, _totalTicketsToBuy));
    allTicketHolders.push(msg.sender);
    emit TicketPurchased(_eventId, _totalTicketsToBuy, msg.sender, block.timestamp);
}
   //function to return ticket of particular user
    function getTicket()public view returns(TicketHolder[] memory){
    return ticketHolders[msg.sender];

    }
    function ticketHolderAddress()public view returns(address[] memory){
    return allTicketHolders;
    }
}
