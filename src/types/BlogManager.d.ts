declare module BlogManager {
  class BlogManager {
    address: string;

    owner: () => Promise<string>;
    postRegistry: (hash: string) => Promise<PostRaw>;
    posts: (id: BigNumber.BigNumber | number) => Promise<string>;
    comments: (id: BigNumber.BigNumber | number, commentIndex: BigNumber.BigNumber | number) => Promise<CommentRaw>;
    getPostCount: () => Promise<BigNumber.BigNumber>;
    getCommentCount: (postID: BigNumber.BigNumber) => Promise<BigNumber.BigNumber>;
    publish: (bzzHash: string, title: string, opts?: any) => Promise<any>;
    update: (postID: BigNumber.BigNumber, newBzzHash: string, title: string, opts?: any) => Promise<any>;
    unpublish: (postID: BigNumber.BigNumber, opts?: any) => Promise<any>;
    comment: (postID: BigNumber.BigNumber, text: string, opts?: any) => Promise<any>;
    withdraw: (opts?: any) => Promise<any>;
    kill: (opts?: any) => Promise<any>;
  }

  class Post {
    title: string;
    id: BigNumber.BigNumber;
    bzzHash: string;
    timePublished: BigNumber.BigNumber;
    timeUpdated: BigNumber.BigNumber;
  }

  class Comment {
    commenter: string;
    amount: BigNumber.BigNumber;
    text: string;
  }

  type PostRaw = [string, BigNumber.BigNumber, string, BigNumber.BigNumber, BigNumber.BigNumber];
  type CommentRaw = [string, BigNumber.BigNumber, string];
}
