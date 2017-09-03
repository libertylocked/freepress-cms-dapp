import * as Marked from "marked";
import * as React from "react";
import { bin2String } from "../utils/strUtils";

interface IProps {
  bzz: any;
  postHash: string;
}

interface IState {
  content: any;
}

class ViewPost extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      content: "",
    };
  }

  public componentWillMount() {
    const postBzzAddress = this.props.postHash.startsWith("0x") ? this.props.postHash.slice(2) : this.props.postHash;
    this.props.bzz.download(postBzzAddress)
      .then((result: any) => {
        const mdText = bin2String(result["post.md"].data);
        this.setState({
          content: Marked(mdText),
        });
      });
  }

  public render() {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: this.state.content,
        }}
      />
    );
  }
}

export default ViewPost;
