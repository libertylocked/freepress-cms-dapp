import * as React from "react";
import { ParsePost, IsPostValid } from "../utils/blogContractUtils";

import PostDirectoryItem from "./PostDirectoryItem";

interface IProps {
  contractInstance: BlogManager;
  fromID: BigNumber.BigNumber;
  toID: BigNumber.BigNumber;
  onDeleteSuccess: (txObj: any) => void;
}

interface IState {
  posts: Post[];
}

class PostDirectory extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      posts: [],
    };
  }

  public async componentWillMount() {
    const posts = await this.getPosts(this.props.fromID, this.props.toID, this.props.contractInstance);
    this.setState({ posts });
  }

  public async componentWillReceiveProps(nextProps: IProps) {
    if (this.props.fromID !== nextProps.fromID || this.props.toID !== nextProps.toID) {
      const posts = await this.getPosts(nextProps.fromID, nextProps.toID, nextProps.contractInstance);
      this.setState({ posts });
    }
  }

  public render() {
    return (
      <div>
        <h1>Published Posts</h1>
        {this.state.posts.map((post) => (
          IsPostValid(post) ?
            <PostDirectoryItem
              key={post.id.toString()}
              post={post}
              onDeleteClick={(id) => { this.deletePost(id, this.props.onDeleteSuccess, this.props.contractInstance); }}
            />
            : null
        ))}
      </div>
    );
  }

  private getPosts = async (fromID: BigNumber.BigNumber, toID: BigNumber.BigNumber, instance: BlogManager) => {
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
    successCallback: (txObj: any) => void, instance: BlogManager) => {
    try {
      const txObj: any = await instance.unpublish(postID);
      console.log(txObj);
      alert("Your post has been deleted. ID is " + postID);
      // invoke callback
      successCallback(txObj);
    } catch (err) {
      alert(err);
    }
  }
}

export default PostDirectory;
