import * as BigNumber from "bignumber.js";
import * as React from "react";
import { ParseComment } from "../utils/blogContractUtils";

interface IProps {
  contractInstance: BlogManager.BlogManager;
  postID: BigNumber.BigNumber;
}

interface IState {
  commentCount: BigNumber.BigNumber;
}

class ShowComments extends React.Component<IProps, IState> {
  private commentIndexInput: HTMLInputElement | null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      commentCount: new BigNumber(0),
    };
  }

  public componentWillMount() {
    this.updateCommentCount();
  }

  public render() {
    return (
      <div>
        <p>{`${this.state.commentCount.toString()} comments`}</p>
        <button onClick={this.handleGetCommentClick}>Get comment at index</button>
        <input type="number" ref={(r) => { this.commentIndexInput = r; }} />
      </div>
    );
  }

  public async updateCommentCount() {
    const commentCount = await this.props.contractInstance.getCommentCount(this.props.postID);
    this.setState({
      commentCount,
    });
  }

  private handleGetCommentClick = async () => {
    if (!this.commentIndexInput || isNaN(this.commentIndexInput.valueAsNumber)) {
      return;
    }
    try {
      const index = this.commentIndexInput.valueAsNumber;
      const commentRaw = await this.props.contractInstance.comments(this.props.postID, index);
      const comment = ParseComment(commentRaw);
      alert(JSON.stringify(comment));
    } catch (err) {
      console.error(err);
    }
  }
}

export default ShowComments;
