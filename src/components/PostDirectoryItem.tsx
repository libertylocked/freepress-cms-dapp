import * as React from "react";

interface IProps {
  post: Post;
}

const PostDirectoryItem: React.StatelessComponent<IProps> = (props) => (
  <div>
    <h3>{props.post.title}<sub> (ID: {props.post.id.toString()})</sub></h3>
    <div>{props.post.bzzHash}</div>
    <div>Published {props.post.timePublished.toString()} Updated {props.post.timeUpdated.toString()}</div>
  </div>
);

export default PostDirectoryItem;
