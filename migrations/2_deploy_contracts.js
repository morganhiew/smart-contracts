var voting = artifacts.require("voting");
var membershipAddr = '0x0';

module.exports = function(deployer) {
  deployer.deploy(voting, membershipAddr);
};
