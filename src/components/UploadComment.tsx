import * as React from "react";

interface IProps {
  contractInstance: BlogManager.BlogManager;
  postID: BigNumber.BigNumber;
}

const UploadComment: React.StatelessComponent<IProps> = (props) => {
  let textInput: HTMLInputElement | null;
  const handleUploadClick = async () => {
    if (textInput) {
      const txObject = await props.contractInstance.comment(props.postID, textInput.value);
      alert("Your comment ID for this post is " + txObject.logs[0].args.commentIndex.toString());
    }
  };
  return (
    <div>
      <p>Compose a comment</p>
      <input type="text" ref={(r) => { textInput = r; }} />
      <button onClick={handleUploadClick}>Submit</button>
    </div>
  );
};

export default UploadComment;
