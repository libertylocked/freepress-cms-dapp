import * as React from "react";
import ShowComment from "./ShowComment";
import UploadComment from "./UploadComment";

interface IProps {
  post: BlogManager.Post;
  isOwner: boolean;
  contractInstance: BlogManager.BlogManager;
  onDeleteClick: (id: BigNumber.BigNumber) => void;
}

const PostDirectoryItem: React.StatelessComponent<IProps> = (props) => (
  <div>
    <h3>{props.post.title}<sub> (ID: {props.post.id.toString()})</sub></h3>
    <div>{props.post.bzzHash}</div>
    <div>Published {props.post.timePublished.toString()} Updated {props.post.timeUpdated.toString()}</div>
    <button onClick={() => { props.onDeleteClick(props.post.id); }} hidden={!props.isOwner}>Delete</button>
    <ShowComment postID={props.post.id} contractInstance={props.contractInstance} />
    <UploadComment postID={props.post.id} contractInstance={props.contractInstance} />
  </div>
);

export default PostDirectoryItem;
