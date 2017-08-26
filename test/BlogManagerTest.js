const BlogManager = artifacts.require("./BlogManager.sol");

/**
 * Asserts that the error message is invalid opcode
 * @param {Error} err
 */
const assertInvalidOpCode = (err) => {
  assert.equal(err.message, "VM Exception while processing transaction: invalid opcode");
}

const POSTS = [{
  bzzHash: "0x4bfc3b3028fd33f2a4ef180935029f95fb867b3628acd782dc0e9fcc1a8bcc5b",
  title: "welcome",
}, {
  bzzHash: "0x38d83ab4c4e28b9be0e5133dcf917f9b2e79dc91a63c8e0a42a20917e0b7d3fc",
  title: "website-ideas",
}];

contract("BlogManager", (accounts) => {
  describe("constructor", () => {
    it("should have the correct owner set", () => {
      return BlogManager.deployed()
      .then((instance) => instance.owner())
      .then((owner) => {
        assert.equal(owner, accounts[0]);
      })
    })
  });

  describe("publish", () => {
    it("should save the post published", () => {
      let instance;
      let postID, blockPublished;

      return BlogManager.deployed()
      .then((_instance) => {
        instance = _instance;
        return instance.publish(POSTS[0].bzzHash, POSTS[0].title);
      })
      .then((txObject) => {
        // get the post ID from log
        assert.equal(txObject.logs[0].event, "LogPostPublished");
        blockPublished = txObject.receipt.blockNumber;
        postID = txObject.logs[0].args.id.toNumber();
        return instance.posts(postID);
      })
      .then((postBzzHash) => {
        // check if post is added to post arr
        assert.equal(postBzzHash, POSTS[0].bzzHash);
        return instance.postRegistry(postBzzHash);
      })
      .then((postMetadata) => {
        // check if metadata is stored in post registry
        assert.equal(postMetadata[0], POSTS[0].title);
        assert.equal(postMetadata[1], postID);
        assert.equal(postMetadata[2], POSTS[0].bzzHash);
        assert.equal(postMetadata[3], blockPublished); // time published
        assert.equal(postMetadata[4], blockPublished); // time updated
      })
    })

    it("should reject publish request from non-owners", (done) => {
      BlogManager.deployed()
      .then((instance) => instance.publish(POSTS[0].bzzHash, POSTS[0].title, { from: accounts[1] }))
      .then((txObject) => {
        done(new Error("Non-owner published a post"));
      })
      .catch((err) => {
        assertInvalidOpCode(err);
        done();
      })
    })
  });

});
