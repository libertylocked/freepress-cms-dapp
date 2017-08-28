import * as React from "react";
import { ParsePost } from "../utils/blogContractUtils";

import PostDirectoryItem from "./PostDirectoryItem";

interface IProps {
  contractInstance: BlogManager;
  fromID: BigNumber.BigNumber;
  toID: BigNumber.BigNumber;
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
    let postID = this.props.fromID;
    const postIDs = [];
    while (postID.lessThanOrEqualTo(this.props.toID)) {
      postIDs.push(postID);
      postID = postID.plus(1);
    }

    const posts = await Promise.all(postIDs.map(async (id) => {
      const bzzHash: string = await this.props.contractInstance.posts(id);
      return ParsePost(await this.props.contractInstance.postRegistry(bzzHash));
    }));

    this.setState({ posts });
  }

  public render() {
    return (
      <div>
        <h1>Published Posts</h1>
        {this.state.posts.map((post) => (
          <PostDirectoryItem post={post} />
        ))}
      </div>
    );
  }
}

export default PostDirectory;
