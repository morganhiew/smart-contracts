pragma solidity ^0.4.24;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/voting.sol";

contract TestProposalSetup {
  //Users/morganhiew/SolidityProject/1/test/Testvoting.sol:11:31: TypeError: Indexed expression has to be a type, mapping or array (is tuple(uint256,address,bytes memory,enum voting.status,uint256,uint256))

    function testProposalUsingDeployedContract() {
    voting meta = voting(DeployedAddresses.voting());

    meta.propose("hello world!");

    enum status {open, closed, accepted}

    uint content_proposalId;
    uint expected_proposalId = 0;

    address content_proposer;
    address expected_proposer = tx.origin;

    bytes memory content_proposalContent;
    bytes memory expected_content = "68656c6c6f20776f726c6421";


    status content_proposalStatus;
    status expected_status = 0;

    uint content_timeEnd;

    uint content_voteCount;
    uint expected_voteCount = 0;

    (content_proposalId,
    content_proposer,
    content_proposalContent,
    content_proposalStatus,
    content_timeEnd,
    content_voteCount)= meta.getProposal(0);

    Assert.equal(content_proposalId, expected_proposalId, "The first contract should have ID = 0");
  }
}
