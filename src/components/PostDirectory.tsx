import * as BigNumber from "bignumber.js";
import * as React from "react";
import { IsPostValid, ParsePost } from "../utils/blogContractUtils";

import PostDirectoryItem from "./PostDirectoryItem";

interface IProps {
  web3: any;
  bzz: any;
  contractInstance: BlogManager.BlogManager;
  isOwner: boolean;
  onDeleteSuccess: (txObj: any) => void;
}

interface IState {
  posts: BlogManager.Post[];
}

class PostDirectory extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      posts: [],
    };
  }

  public async componentWillMount() {
    this.updatePostsState();
  }

  public render() {
    return (
      <div>
        <h1>Published Posts</h1>
        {this.state.posts.map((post) => (
          IsPostValid(post) ?
            <PostDirectoryItem
              key={post.id.toString()}
              web3={this.props.web3}
              bzz={this.props.bzz}
              post={post}
              isOwner={this.props.isOwner}
              onDeleteClick={(id) => { this.deletePost(id, this.props.onDeleteSuccess, this.props.contractInstance); }}
              contractInstance={this.props.contractInstance}
            />
            : null
        ))}
      </div>
    );
  }

  public updatePostsState = async () => {
    const postCount = await this.props.contractInstance.getPostCount();
    const posts = await this.getPosts(new BigNumber(0), postCount.minus(1), this.props.contractInstance);
    // const postComments = await
    this.setState({ posts });
  }

  private getPosts = async (fromID: BigNumber.BigNumber,
                            toID: BigNumber.BigNumber,
                            instance: BlogManager.BlogManager): Promise<BlogManager.Post[]> => {
    // XXX
    let postID = fromID;
    const postIDs = [];
    while (postID.lessThanOrEqualTo(toID)) {
      postIDs.push(postID);
      postID = postID.plus(1);
    }
    return await Promise.all(postIDs.map(async (id) => {
      const bzzHash: string = await instance.posts(id);
      return ParsePost(await instance.postRegistry(bzzHash));
    }));
  }

  private deletePost = async (postID: BigNumber.BigNumber,
                              successCallback: (txObj: any) => void,
                              instance: BlogManager.BlogManager) => {
    try {
      const txObj: any = await instance.unpublish(postID);
      console.log(txObj);
      alert("Your post has been deleted. ID is " + postID);
      this.updatePostsState();
      // invoke callback
      successCallback(txObj);
    } catch (err) {
      alert(err);
    }
  }
}

export default PostDirectory;
