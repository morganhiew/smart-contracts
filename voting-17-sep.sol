pragma solidity ^0.4.24;

contract VoteForRecord{
    
    /*misc variables*/
    address membershipLocation;
    uint proposalIdCount = 0;
    
    
    /*variables regarding the vote status of an individual voter*/
    //status of 'voted?' given voter address and given proposalId
    mapping (address => mapping (uint => bool)) Voted;
    //allow membership contract to check this attribute
    //as member that has a voted proposal in progress cannot transfer membership
    mapping (address => uint) LastVoted;
    
    /*variables regarding the proposal*/
    enum status {open, closed, accepted}    
    //link an id to a unique proposal
    mapping (uint => Proposal) ProposalById;
    //things that proposal contains
    struct Proposal {
        //this id duplicates the mapping
        uint proposalId;
        address proposer;
        bytes proposalContent;
        status proposalStatus;
        uint timeEnd;
        uint voteCount;
    }
    
    /*function run at first setup*/
    //setup membership address for checking 
    //whether an address is a voting member etc. 
    constructor (address _membershipLocation) public {
        membershipLocation = _membershipLocation;
    }
    
    /*modifiers*/
    modifier isVotingMember (address _memberAddress) {
        //needs the target membership contract to have 
        //an isMember (or similar )function
        //require (membershipLocation.isMember(_memberAddress));
        _;
    }
    
    modifier hasNotVoted (uint _proposalId, address _hasVotedAddress) {
        require (Voted[_hasVotedAddress][_proposalId] == false);
        _;
    }
    
    modifier proposalNotExpired (uint _expireProposalId) {
        require (now >= ProposalById[_expireProposalId].timeEnd);
        _;
    }
    
    /*functions*/
    function propose (bytes _content) public {
        
        ProposalById[proposalIdCount] = (Proposal
        (proposalIdCount, msg.sender, _content, 
        status.open, block.timestamp + 3 days, 0));
        //increment id for next proposal to use
        proposalIdCount += 1;
        
        //consider put the proposer's vote here too
        //concern is both voting and non-voting members can propose
        //which the increased complexity may lead to higher gas cost
        
    }
    
    
    function vote (uint _voteProposalId) public 
    isVotingMember(msg.sender) hasNotVoted(_voteProposalId,msg.sender) {
        ProposalById[_voteProposalId].voteCount ++;
        //disallow the proposer to vote again
        Voted[msg.sender][proposalIdCount] = true;
        //update the voting time of this member
        LastVoted[msg.sender]= block.timestamp;
        
    }
    
    function closeProposal (uint _closeProposalId) public {
        require (now > ProposalById[_closeProposalId].timeEnd);
        
        /*this function requires the membership contract to contain 
        numberOfmember (or similar) function
        this function calls the member no. counter in membership contract
        if (ProposalById[_closeProposalId].voteCount 
        > membershipLocation.numberOfmember());*/
        
        //the below is for demonstration and testing
        if (ProposalById[_closeProposalId].voteCount > 1){
            ProposalById[_closeProposalId].proposalStatus = status.accepted;
        }
        else {
        ProposalById[_closeProposalId].proposalStatus = status.closed;
        }
        
        
    }
    
    
    /*view functions (not writing the smart contract)*/
    //retrieve info of proposal given id
    function getProposal (uint _getProposalId) public view returns(uint, address, bytes, status, uint, uint) {
        return (ProposalById[_getProposalId].proposalId, 
        ProposalById[_getProposalId].proposer, 
        ProposalById[_getProposalId].proposalContent,
        ProposalById[_getProposalId].proposalStatus,
        ProposalById[_getProposalId].timeEnd, 
        ProposalById[_getProposalId].voteCount);
        
    }
    
}


//questions1: success proposal means >50% of which date