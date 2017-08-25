const BlogManager = artifacts.require("./BlogManager.sol");

module.exports = function(deployer) {
  deployer.deploy(BlogManager);
};
