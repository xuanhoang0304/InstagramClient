import PostPage from "@/features/post";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ commentId: string; parentId: string }>;
}) => {
  const [{ commentId, parentId }, { postId }] = await Promise.all([
    searchParams,
    params,
  ]);
  const urlKey = `${postId}-${commentId}-${parentId}`;
  return <PostPage key={urlKey} postId={postId}></PostPage>;
};

export default page;
