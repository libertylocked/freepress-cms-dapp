import * as React from "react";
import { ParseComment } from "../utils/blogContractUtils";

interface IProps {
  contractInstance: BlogManager.BlogManager;
  postID: BigNumber.BigNumber;
}

class ShowComment extends React.Component<IProps, {}> {
  private commentIndexInput: HTMLInputElement | null;

  public render() {
    return (
      <div>
        <button onClick={this.handleGetCommentClick}>Get comment at index</button>
        <input type="number" ref={(r) => { this.commentIndexInput = r; }} />
      </div>
    );
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

export default ShowComment;
