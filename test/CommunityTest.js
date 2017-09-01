const Community = artifacts.require("./Community.sol");
const BlogManager = artifacts.require("./BlogManager.sol");
const assertInvalidOpCode = require("./helpers.js").assertInvalidOpCode;

const FEE = web3.toWei(0.001, "ether");

contract("Community", (accounts) => {
  describe("constructor", () => {
    it("should have the correct owner and fee set", () => {
      let instance;
      return Community.new(FEE)
        .then((_instance) => {
          instance = _instance;
          return instance.communityOwner();
        })
        .then((owner) => {
          assert.equal(owner, accounts[0]);
          return instance.fee();
        })
        .then((fee) => {
          assert.equal(fee.toString(), FEE);
        })
    })
  });

  describe("createBlog", () => {
    it("should save the blog with correct owner, if author doesn't have a blog and pays fee", () => {
      let instance;
      let blogListing;

      return Community.new(FEE)
        .then((_instance) => {
          instance = _instance;
          return instance.createBlog({
            from: accounts[1],
            value: FEE,
          });
        })
        .then((txObj) => {
          assert.equal(txObj.logs[0].event, "LogBlogCreated");
          createdBlogID = txObj.logs[0].args.id;
          return instance.blogs(createdBlogID);
        })
        .then((_blogListing) => {
          blogListing = _blogListing;
          // check if the blog is in the listing
          assert.equal(blogListing[0].toString(), accounts[1]);
          return instance.ownedBlog(accounts[1]);
        })
        .then((createdBlogAddress) => {
          // check if the listing has the correct address
          assert.equal(blogListing[1].toString(), createdBlogAddress);
          return BlogManager.at(createdBlogAddress);
        })
        .then((blogInstance) => {
          return blogInstance.owner();
        })
        .then((owner) => {
          // check if the created blog has the correct owner set
          assert.equal(owner.toString(), accounts[1]);
        })
    });

    it("should fail if fee is not paid in full", (done) => {
      Community.new(FEE)
        .then((instance) => {
          return instance.createBlog({
            from: accounts[1],
            value: 0,
          });
        })
        .then((txObject) => {
          done(new Error("Create did not throw error when fee is not paid in full"));
        })
        .catch((err) => {
          assertInvalidOpCode(err);
          done();
        })
    })
  });

});
