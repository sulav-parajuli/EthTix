//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;


contract AccessControl{



//State variables
address payable public owner;

constructor(){
    owner = payable(msg.sender);

}


}


