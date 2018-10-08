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



contract('general sunny-day cases', accounts => {
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

    it('another account should be able to vote a proposal', async () => {
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

    it('should fail and close a vote with <= 1 votecounts after 3 days', async () => {
      const meta = await voting.new('0x1', {from: acc1});
      await meta.propose ('hello world!', {from: acc1});
      await meta.vote('0', {from: acc1});
      //function timetravel is defined above
      await timeTravel(86400*3+1);
      await meta.closeProposal('0', {from: acc1});
      var [a, b, c, content_proposalStatus, e, f] = await meta.getProposal('0');
      assert.equal (content_proposalStatus, 1, 'The vote is not failed');
    })


})

contract('increment checks', accounts => {
  const acc1 = accounts[0];
  const acc2 = accounts[1];
  const acc3 = accounts[2];

  it('proposal ID should correctly increment', async () => {
    const meta = await voting.new('0x1', {from: acc1});
    await meta.propose ('hello world!', {from: acc1});
    await meta.propose ('bello world!', {from: acc2});
    await meta.propose ('rello world!', {from: acc2});
    var [id0, b, c, d, e, f] = await meta.getProposal('0');
    var [id1, h, i, j, k, l] = await meta.getProposal('1');
    var [id2, n, o, p, q, r] = await meta.getProposal('2');
    assert.equal (id0, 0, 'the proposal id increment is incorrect');
    assert.equal (id1, 1, 'the proposal id increment is incorrect');
    assert.equal (id2, 2, 'the proposal id increment is incorrect');
  })

  it('vote count should correctly increment', async () => {
    const meta = await voting.new('0x1', {from: acc1});
    await meta.propose ('hello world!', {from: acc1});
    await meta.vote('0', {from: acc1});
    await meta.vote('0', {from: acc2});
    await meta.vote('0', {from: acc3});
    var [a, b, c, d, e, content_voteCount] = await meta.getProposal('0')
    assert.equal (content_voteCount, 3, 'The vote increment is incorrect')
  })


})

contract('rainy-day cases', accounts => {
  const acc1 = accounts[0];
  const acc2 = accounts[1];
  const acc3 = accounts[2];

    //path testing
    it('proposal content should NOT be empty', async () => {
      const meta = await voting.new('', {from: acc1});
      let err = null
      try {
        await meta.propose ('', {from: acc1});
      } catch (error) {
        err = error;
      }
      assert.ok(err instanceof Error);
    })

    it('should NOT pass and close a vote with 0 votecounts before 3 day voting period', async () => {
      const meta = await voting.new('0x1', {from: acc1});
      await meta.propose ('hello world!', {from: acc1});
      //function timetravel is defined above
      await timeTravel(86400*3);
      let err = null
      try {
        await meta.closeProposal('0', {from: acc1});
      } catch (error) {
        err = error;
      }
      assert.ok(err instanceof Error);
    })

    it('a person should NOT vote on the same proposal again', async() => {
      const meta = await voting.new('0x1', {from: acc1});
      await meta.propose ('hello world!', {from: acc1});
      await meta.vote('0', {from: acc1});
      let err = null
      try{
        await meta.vote('0', {from: acc1});
      } catch (error) {
        err = error;
      }
      assert.ok(err instanceof Error);
    })


})

//cases not yet doable:
//check non voting member cannot vote
//check the total number of members
