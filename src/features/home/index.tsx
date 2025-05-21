"use client";

import ListPosts from '@/features/home/components/posts/ListPosts';
import SuggesstionWrapper from '@/features/home/components/SuggesstionWrapper';
import SwitchUser from '@/features/home/components/SwitchUser';
import { useMyStore } from '@/store/zustand';

import FollowMoreUser from './components/FollowMoreUser';

const HomePage = () => {
    const { myUser } = useMyStore();
    return (
        <div className=" flex-1 flex justify-center gap-x-[64px] pb-10 lg:px-0 px-3">
            {/* Content */}
            <div className="w-full max-w-[630px]">
                {/* Stories */}
                {/* {myUser?.followings?.length ? (
                    <StoriesWrapper></StoriesWrapper>
                ) : null} */}
                {/* Posts */}
                {myUser &&
                    (myUser.followings.length ? (
                        <ListPosts></ListPosts>
                    ) : (
                        <FollowMoreUser></FollowMoreUser>
                    ))}
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
