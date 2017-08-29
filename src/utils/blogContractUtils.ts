export const ParsePost = (postRaw: BlogManager.PostRaw): BlogManager.Post => ({
  title: postRaw[0],
  id: postRaw[1],
  bzzHash: postRaw[2],
  timePublished: postRaw[3],
  timeUpdated: postRaw[4],
} as BlogManager.Post);

export const IsPostValid = (post: BlogManager.Post): boolean => (
  post.bzzHash !== "0x0000000000000000000000000000000000000000000000000000000000000000"
);
