pragma solidity 0.4.15;

contract BlogManager {
    struct Post {
        string title;
        uint id; // index of the post in the posts arr
        bytes32 bzzHash;
        uint timePublished;
        uint timeUpdated;
    }

    struct Comment {
        address commenter;
        uint amount;
        string text;
    }

    event LogPostPublished(uint id);
    event LogPostUnpublished(uint id);
    event LogCommented(uint id, uint commentIndex);
    event LogWithdrawn(uint amount);
    event LogKilled();

    address public owner;
    mapping(bytes32 => Post) public postRegistry;
    bytes32[] public posts; // bzz hashes of the posts
    mapping(uint => Comment[]) public comments;

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    // constructor
    function BlogManager() {
        owner = msg.sender;
    }

    // publish allows owner to publish a post to post registry
    // returns the id of the published post
    function publish(bytes32 bzzHash, string title) ownerOnly()
        public returns (bool, uint)
    {
        // the post must be new
        require(postRegistry[bzzHash].timePublished == 0);
        uint id = posts.length;
        Post memory newPost = Post({
            title: title,
            id: id,
            bzzHash: bzzHash,
            timePublished: block.number,
            timeUpdated: block.number
        });
        // add to registry and posts arr
        postRegistry[bzzHash] = newPost;
        posts.length = posts.push(bzzHash);
        LogPostPublished(id);
        return (true, id);
    }

    // update lets owner update an existing post
    function update(uint id, bytes32 bzzHash, string title) returns (bool) {
        require(posts[id] != 0);
        Post storage oldPost = postRegistry[posts[id]];
        postRegistry[bzzHash] = Post({ // add the updated post
            title: title, // update post title
            id: oldPost.id, // retain the post ID
            bzzHash: bzzHash, // update post bzz hash
            timePublished: oldPost.timePublished, // keep original publish time
            timeUpdated: block.number // update time updated
        });
        // delete the old post in registry
        delete postRegistry[bzzHash];
        return true;
    }

    // unpublish removes a post from post registry
    // only zeros out the metadatas
    // obviously it cannot remove the post from Swarm
    function unpublish(uint id) ownerOnly() public returns (bool) {
        require(posts[id] != 0);
        bytes32 bzzHash = posts[id];
        // delete the post from registry and posts arr
        delete postRegistry[bzzHash];
        delete posts[id];
        LogPostUnpublished(id);
        return true;
    }

    // comment allows someone to comment on a post
    // payable, because they can optionally donate and support the blog owner
    function comment(uint id, string text) payable returns (bool) {
        require(posts[id] != 0); // post must exist
        comments[id].length = comments[id].push(Comment({
            commenter: msg.sender,
            amount: msg.value,
            text: text
        }));
        LogCommented(id, comments[id].length - 1);
        return true;
    }

    // withdraw allows owner to withdraw donations from contract
    function withdraw() ownerOnly() returns (bool) {
        uint amount = this.balance;
        owner.transfer(this.balance);
        LogWithdrawn(amount);
        return true;
    }

    // kill shuts down the blog
    function kill() ownerOnly() returns (bool) {
        selfdestruct(owner);
        LogKilled();
        return true;
    }

    // getPostCount returns the total number of posts created
    // note that it also counts unpublished posts
    function getPostCount() constant returns (uint) {
        return posts.length;
    }

    // getCommentCount returns the total number of comments of a post
    function getCommentCount(uint id) constant returns (uint) {
        return comments[id].length;
    }
}
