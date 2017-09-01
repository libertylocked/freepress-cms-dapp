export const ParsePost = (postRaw: BlogManager.PostRaw): BlogManager.Post => ({
  title: postRaw[0],
  id: postRaw[1],
  bzzHash: postRaw[2],
  timePublished: postRaw[3],
  timeUpdated: postRaw[4],
} as BlogManager.Post);

export const ParseComment = (commentRaw: BlogManager.CommentRaw): BlogManager.Comment => ({
  commenter: commentRaw[0],
  amount: commentRaw[1],
  text: commentRaw[2],
});

export const IsPostValid = (post: BlogManager.Post): boolean => (
  post.bzzHash !== "0x0000000000000000000000000000000000000000000000000000000000000000"
);
