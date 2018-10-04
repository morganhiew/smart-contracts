const voting = artifacts.require("voting");

const timeTravel = function (time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time], // 86400 is num seconds in day
      id: new Date().getTime()
    }, (err, result) => {
      if(err){ return reject(err) }
      return resolve(result)
    });
  })
}



contract('voting', accounts => {
  const acc1 = accounts[0];
  const acc2 = accounts[1];
  const acc3 = accounts[2];

  //positive test cases
  it('should set up correct membership address', async () => {
    const meta = await voting.new('0x2', {from: acc1});
    var membership = await meta.showMembership();
    assert.equal (membership, '0x0000000000000000000000000000000000000002', membership)
  })

  it('should correctly setup a proposal', async () => {
      const meta = await voting.new('0x1', {from: acc1});
      await meta.propose ('hello world!', {from: acc1});
      var [content_proposalId, content_proposer, content_proposalContent,
        content_proposalStatus, content_timeEnd,
        content_voteCount] = await meta.getProposal('0')
      assert.equal(content_proposalId, '0', 'Id number is incorrect');
      assert.equal(content_proposer, acc1, 'Proposer is incorrect');
      assert.equal(content_proposalContent, '0x68656c6c6f20776f726c6421', 'Content is incorrect');
      assert.equal(content_proposalStatus, '0', 'ProposalStatus is incorrect');
      //the difference is not exactly 3 days (i set to 3 days -100 seconds) due to time difference between content_timeEnd and Date.now()
      assert.equal(content_timeEnd >= Date.now()/1000 + 259100, true, 'Time end setup is incorrect');
      assert.equal(content_voteCount, '0', 'Vote count is incorrect');
    })

    it('acc2 should be able to vote a proposal', async () => {
        const meta = await voting.new('0x1', {from: acc1});
        await meta.propose ('hello world!', {from: acc1});
        await meta.vote('0', {from: acc2});
        var [a, b, c, d, e, content_voteCount] = await meta.getProposal('0');
        assert.equal (content_voteCount, 1, 'The vote is not successful');
      })

    it('should pass and close a vote with >1 votecounts after 3 days', async () => {
      const meta = await voting.new('0x1', {from: acc1});
      await meta.propose ('hello world!', {from: acc1});
      await meta.vote('0', {from: acc1});
      await meta.vote('0', {from: acc2});
      //function timetravel is defined above
      await timeTravel(86400*3+1);
      await meta.closeProposal('0', {from: acc1});
      var [a, b, c, content_proposalStatus, e, f] = await meta.getProposal('0')
      assert.equal (content_proposalStatus, 2, 'The vote is not passed')
    })

    //path testing
    it('membership set up should not be empty', async () => {
      const meta = await voting.new('', {from: acc1});
      var membership = await meta.showMembership();
      assert.equal (membership, '0x0000000000000000000000000000000000000000', membership)
    })








})
