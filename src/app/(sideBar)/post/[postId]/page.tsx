import PostPage from '@/features/PostPage';

const page = async ({ params }: { params: Promise<{ postId: string }> }) => {
    const { postId } = await params
    return <PostPage postId={postId}></PostPage>;
};

export default page;
