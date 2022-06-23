//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    string public name = "token name";
    string public symbol = "TN";
    uint public totalSupply = 350;
    address public owner;
    mapping(address => uint) balances;

    constructor(){
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }
    //transfer tokens
    function transfer(address to, uint amount) external{
        require(balances[msg.sender] >= amount, 'Not enough tokens');
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
    //check the balance of an account
    function balanceOf(address account) external view returns(uint){
        return balances[account];
    }
}