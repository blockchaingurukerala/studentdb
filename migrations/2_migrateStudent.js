var Migrations = artifacts.require("./Student.sol");
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
