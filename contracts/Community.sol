// Community is a contract that keeps track of blogs created by independent 
// authors.
pragma solidity 0.4.15;

import "./BlogManager.sol";

contract Community {
    struct BlogListing {
        address owner;
        address blog;
    }
    
    event LogBlogCreated(uint id);
    event LogBlogUnlisted(uint id);
    
    // owner of the blogging community
    address public communityOwner;
    // listing of all the blogs created
    // index is referred to as blog ID
    BlogListing[] public blogs;
    // price to pay to create a blog from community
    uint public fee;
    // blog owner address => blog address
    mapping(address => address) public ownedBlog;
    
    modifier communityOwnerOnly() {
        require(msg.sender == communityOwner);
        _;
    }
    
    // constructor
    function Community(uint price) {
        communityOwner = msg.sender;
        fee = price;
    }
    
    // createBlog deploys a new blog space for the sender, and adds
    // the created blog to the listings
    function createBlog() payable returns (bool) {
        require(msg.value >= fee);
        require(ownedBlog[msg.sender] == 0);
        BlogManager newBlog = new BlogManager();
        newBlog.changeOwner(msg.sender);
        // add the blog to listing
        blogs.length = blogs.push(BlogListing({
            owner: msg.sender,
            blog: newBlog
        }));
        ownedBlog[msg.sender] = newBlog;
        // refund overpaid fees
        if (msg.value > fee) {
            msg.sender.transfer(msg.value - fee);
        }
        LogBlogCreated(blogs.length - 1);
        return true;
    }
    
    // unlist allows community owner to unlist a blog from the community
    function unlist(uint id) communityOwnerOnly() returns (bool) {
        BlogListing storage blogListing = blogs[id];
        require(blogListing.blog != address(0));
        address owner = blogListing.owner;
        // delete from ownedBlog
        delete ownedBlog[owner];
        // delete from blogs
        delete blogs[id];
        LogBlogUnlisted(id);
        return true;
    }
    
    // changeFee allows community owner to change the fee of listing
    // a blog in the community
    function changeFee(uint newPrice) 
        communityOwnerOnly() 
        returns (bool) 
    {
        fee = newPrice;
        return true;
    }
    
    // ====================
    //  constant functions
    // ====================
    
    function getCommunityBlogCount() constant returns (uint) {
        return blogs.length;
    }
}
