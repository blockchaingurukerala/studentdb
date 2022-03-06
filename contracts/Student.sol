// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
contract Student {
  uint public totalUsers=0;
  mapping (address=>string) public roles;
  struct user{
    uint id;
    address adr;
    string role;
  }
  mapping (uint=>user) public users;
  address public owner;
  constructor() public {
    owner=msg.sender;
  }
  function registerUser(string memory _role) public {    
      totalUsers++;
      users[totalUsers]=user(totalUsers,msg.sender,_role);
      roles[msg.sender]=_role;      
  }
 
}
