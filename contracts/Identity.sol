pragma solidity ^0.5.0;

contract Identity {
    struct Member {
        string fname;
        string lname;
        uint age;
        string date;
    }
    bytes32 public uniqueKey;
    // * registered index
    mapping(bytes32 => Member) public members;
    mapping(bytes32 => bool) public subscribed;
    // hash the user details and return bytes32 (UNIQUE STRING)
    function hashIt (string memory fname, uint age, string memory lname) public{
      uniqueKey = keccak256(abi.encode(fname, age, lname));
    }
    // add the details of member to ethereum blockchain
    function addMember(string memory _fname, string memory _lname, uint _age, string memory _date) public returns (bytes32) {
        hashIt(_fname, _age, _lname);
        require(!subscribed[uniqueKey], "Already registered");
        members[uniqueKey].fname = _fname;
        members[uniqueKey].lname = _lname;
        members[uniqueKey].age = _age;
        members[uniqueKey].date = _date;
        subscribed[uniqueKey] = true;
    }
    // get the member details
    function getMember (bytes32 _candidateId) public view returns (string memory, string memory, uint, string memory) {
        return (members[_candidateId].fname, members[_candidateId].lname, members[_candidateId].age, members[_candidateId].date);
    }
}