// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

contract Factory{
    mapping(string => address) public deployedElections;
    uint public electionsCount;

    function createElection(uint cnt, string memory eid) public { 
        address cont = address(new Election(msg.sender, cnt, eid));
        electionsCount++;
        deployedElections[eid] = cont;
    }
}

contract Election {
    struct Candidate {
        uint id;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;

    string public eid;
    address public ORGANIZER;

    constructor (address _org, uint cnt, string memory _eid) {
        ORGANIZER = _org;
        eid = _eid;
        for(uint i = 0; i<cnt; i++){
            addCandidate();
        }
    }

    function addCandidate() private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, 0);
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;
    }
}