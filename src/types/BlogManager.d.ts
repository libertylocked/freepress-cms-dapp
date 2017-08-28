interface BlogManager {
  address: string;

  owner: () => Promise<string>;
  postRegistry: (hash: string) => Promise<PostRaw>;
  posts: (id: BigNumber.BigNumber | number) => Promise<string>;
  comments: (id: BigNumber.BigNumber | number) => Promise<CommentRaw[]>;
  publish: (bzzHash: string, title: string) => Promise<any>;
  update: (postID: BigNumber.BigNumber, newBzzHash: string, title: string) => Promise<any>;
  unpublish: (postID: BigNumber.BigNumber) => Promise<any>;
  comment: (postID: BigNumber.BigNumber, text: string, opts?: any) => Promise<any>;
  withdraw: () => Promise<any>;
  kill: () => Promise<any>;
  getPostCount: () => Promise<BigNumber.BigNumber>;
  getCommentCount: (postID: BigNumber.BigNumber) => Promise<BigNumber.BigNumber>;
}

interface Post {
  title: string;
  id: BigNumber.BigNumber;
  bzzHash: string;
  timePublished: BigNumber.BigNumber;
  timeUpdated: BigNumber.BigNumber;
}

interface Comment {
  commenter: string;
  amount: BigNumber.BigNumber;
  text: string;
}

type PostRaw = [string, BigNumber.BigNumber, string, BigNumber.BigNumber, BigNumber.BigNumber];
type CommentRaw = [string, BigNumber.BigNumber, string];
