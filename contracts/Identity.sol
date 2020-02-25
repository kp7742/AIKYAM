pragma solidity ^0.5.0;

contract Identity {
    struct HealthRec {
		bool exists;
        string date;
        string desc;
        string imghash;
    }
    struct Person {
		bool exists;
        string fullname;
        string dob;
        string addr;
        string gender;
        string bloodgroup;
        uint mobile;
        string imghash;
        HealthRec[] healthdata;
    }
    bytes32 public uniqueKey;
    mapping(bytes32 => Person) public members;

    function hashIt (string memory name, string memory dob, string memory gender) private{
        uniqueKey = keccak256(abi.encode(name, dob, gender));
    }

    function addHealthData(bytes32 _uniqueKey, string memory _date, string memory _desc, string memory _imghash) public{
        require(members[_uniqueKey].exists, "No User Found");
        members[_uniqueKey].healthdata.push(HealthRec({exists: true, date: _date, desc: _desc, imghash: _imghash}));
    }

    function fetchHealthData(bytes32 _uniqueKey, uint index) public view returns (string memory) {
        require(members[_uniqueKey].exists, "No User Found");
        require(members[_uniqueKey].healthdata[index].exists, "No Health Record Found");
        return (members[_uniqueKey].healthdata[index].desc);
    }
    function addPersonDetails(string memory _name, string memory _dob, string memory _addr, string memory _gender,
        string memory _bloodgroup, uint _mobile, string memory _imghash) public returns (bytes32) {
        hashIt(_name, _dob, _gender);
        require(!members[uniqueKey].exists, "Already registered");
        members[uniqueKey].exists = true;
        members[uniqueKey].fullname = _name;
        members[uniqueKey].dob = _dob;
        members[uniqueKey].addr = _addr;
        members[uniqueKey].gender = _gender;
        members[uniqueKey].bloodgroup = _bloodgroup;
        members[uniqueKey].mobile = _mobile;
        members[uniqueKey].imghash = _imghash;
    }
    function getPersonDetails(bytes32 _candidateId) public view returns (string memory, string memory, string memory,
    string memory, string memory, uint, string memory) {
        require(members[_candidateId].exists, "No User Found");
        return (members[_candidateId].fullname, members[_candidateId].dob,
        members[_candidateId].addr, members[_candidateId].gender, members[_candidateId].bloodgroup,
        members[_candidateId].mobile, members[_candidateId].imghash);
    }
}