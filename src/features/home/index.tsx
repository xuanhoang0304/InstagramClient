"use client";

import ListPosts from '@/features/home/components/posts/ListPosts';
import SuggesstionWrapper from '@/features/home/components/SuggesstionWrapper';
import SwitchUser from '@/features/home/components/SwitchUser';

const HomePage = () => {
    return (
        <div className=" flex-1 w-full flex justify-center gap-x-[64px] pb-10 lg:px-0 px-3 md:pt-0 pt-[57px]">
            {/* Content */}
            <div className="w-full md:max-w-[630px]">
                {/* Stories */}
                {/* {myUser?.followings?.length ? (
                            <StoriesWrapper></StoriesWrapper>
                        ) : null} */}
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
