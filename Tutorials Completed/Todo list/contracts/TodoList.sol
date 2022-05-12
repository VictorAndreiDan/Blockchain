// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract TodoList{
    uint public taskCount   = 0;

    struct Task{
        uint    id;
        string  content;
        bool    completed;
    }

    mapping(uint => Task) public tasks;

    function createTask(string memory _content) public{
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);

    }

    constructor() public{
        createTask("First task created!");
    }
}