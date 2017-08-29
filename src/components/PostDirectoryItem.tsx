import * as React from "react";

interface IProps {
  post: BlogManager.Post;
  isOwner: boolean;
  onDeleteClick: (id: BigNumber.BigNumber) => void;
}

const PostDirectoryItem: React.StatelessComponent<IProps> = (props) => (
  <div>
    <h3>{props.post.title}<sub> (ID: {props.post.id.toString()})</sub></h3>
    <div>{props.post.bzzHash}</div>
    <div>Published {props.post.timePublished.toString()} Updated {props.post.timeUpdated.toString()}</div>
    <button onClick={() => { props.onDeleteClick(props.post.id); }} hidden={!props.isOwner}>Delete</button>
  </div>
);

export default PostDirectoryItem;
