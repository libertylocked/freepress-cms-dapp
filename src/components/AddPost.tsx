import * as React from "react";
import * as Web3 from "web3";

interface IProps {
  web3: Web3;
  isOwner: boolean;
  contractInstance: BlogManager;
  onSubmit: (txObject: any) => void;
}

class AddPost extends React.Component<IProps, {}> {
  private bzzHashInput: HTMLInputElement | null;
  private postTitleInput: HTMLInputElement | null;

  public render() {
    if (!this.props.isOwner) {
      return null;
    }
    return (
      <div>
        <h1>Add a post</h1>
        <form>
          <div>
            <label>bzz hash of the post: </label>
            <input type="text" ref={(ref) => this.bzzHashInput = ref} />
          </div>
          <div>
            <label>title of the post: </label>
            <input type="text" ref={(ref) => this.postTitleInput = ref} />
          </div>
          <button type="submit" onClick={this.handleFormSubmit}>Add Post</button>
        </form>
      </div>
    );
  }

  private handleFormSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!this.bzzHashInput || !this.postTitleInput) {
      return;
    }

    const bzzHash = this.bzzHashInput.value;
    const postTitle = this.postTitleInput.value;
    try {
      const txObj: any = await this.props.contractInstance.publish(bzzHash, postTitle);
      console.log(txObj);
      const postID = txObj.logs[0].args.id.toString();
      alert("Your post has been published. ID is " + postID);
      this.bzzHashInput.value = "";
      this.postTitleInput.value = "";
      // invoke callback
      this.props.onSubmit(txObj);
    } catch (err) {
      alert(err);
    }
  }
}

export default AddPost;
