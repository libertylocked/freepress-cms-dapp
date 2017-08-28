export const ParsePost = (postRaw: PostRaw): Post => ({
  title: postRaw[0],
  id: postRaw[1],
  bzzHash: postRaw[2],
  timePublished: postRaw[3],
  timeUpdated: postRaw[4],
} as Post);
