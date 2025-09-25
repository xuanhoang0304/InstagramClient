"use client";

import ListPosts from "@/features/home/components/posts/ListPosts";
import SuggesstionWrapper from "@/features/home/components/SuggesstionWrapper";
import SwitchUser from "@/features/home/components/SwitchUser";

const HomePage = () => {
  return (
    <div className=" flex-1 w-full flex justify-center gap-x-[64px] pb-10 lg:px-0  md:pt-0 pt-[57px]">
      <div className="w-full md:max-w-[630px]">
        <ListPosts></ListPosts>
      </div>
      <div className="w-full max-w-[320px] hidden lg:block">
        <div className=" sticky top-9 px-4">
          <SwitchUser></SwitchUser>
          <SuggesstionWrapper></SuggesstionWrapper>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
