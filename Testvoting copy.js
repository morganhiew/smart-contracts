var voting = artifacts.require("voting");

contract('voting', function(accounts) {
    it("should display the proposal correctly", function () {
      var meta;

      var acc1 = accounts[0];
      var acc2 = accounts[1];

      var content_proposalId;
      var content_proposer;
      var content_proposalContent;
      var content_proposalStatus;
      var content_timeEnd;
      var content_voteCount;

      return voting.deployed('0x0').then(function(instance){
        meta = instance;
        return meta.propose ('hello world!', {from: acc1});
      }).then(function(){
        return meta.getProposal.call(0);
      }).then(function(proposalId,proposer,proposalContent,
        proposalStatus,timeEnd,voteCount){
        content_proposalId = proposalId.toNumber();
        content_proposer = proposer;
        content_proposalContent = proposalContent;
        content_proposalStatus = proposalStatus.toNumber();
        content_timeEnd = timeEnd;
        content_voteCount = voteCount.toNumber();

        assert.equal(content_proposalId = 1,'proposal id incorrect');
        assert.equal(content_proposer = acc1, 'proposer address incorrect');
        assert.equal(content_proposalContent = '68656c6c6f20776f726c6421', 'content incorrect');
        assert.equal(content_proposalStatus = 0, 'proposal status incorrect');
        assert.equal(content_voteCount = 0, 'vote number incorrect');
      });
    });




/*  it("should put 10000 MetaCoin in the first account", function() {
    return MetaCoin.deployed().then(function(instance) {
      return instance.getBalance.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
  });
  it("should call a function that depends on a linked library", function() {
    var meta;
    var metaCoinBalance;
    var metaCoinEthBalance;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(accounts[0]);
    }).then(function(outCoinBalance) {
      metaCoinBalance = outCoinBalance.toNumber();
      return meta.getBalanceInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      metaCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpected function, linkage may be broken");
    });
  });
  it("should send coin correctly", function() {
    var meta;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return meta.sendCoin(account_two, amount, {from: account_one});
    }).then(function() {
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });*/
});
