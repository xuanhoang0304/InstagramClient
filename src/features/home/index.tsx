"use client";
import StoriesWrapper from "@/features/home/components/StoriesWrapper";
import SwitchUser from "@/features/home/components/SwitchUser";
import SuggesstionWrapper from "@/features/home/components/SuggesstionWrapper";
import ListPosts from "@/features/home/components/posts/ListPosts";
const HomePage = () => {
    return (
        <div className=" flex-1 flex justify-center gap-x-[64px] pb-10">
            {/* Content */}
            <div className="w-full max-w-[630px]">
                {/* Stories */}
                <StoriesWrapper></StoriesWrapper>
                {/* Posts */}
                <ListPosts></ListPosts>
            </div>
            {/* Suggestion */}
            <div className="w-full max-w-[320px] hidden lg:block">
                <div className=" sticky top-9 px-4">
                    {/* Switch User */}
                    <SwitchUser></SwitchUser>
                    {/* Suggestion Wrapper */}
                    <SuggesstionWrapper></SuggesstionWrapper>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
