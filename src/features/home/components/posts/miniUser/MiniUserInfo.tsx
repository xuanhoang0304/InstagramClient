import { Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import RealUsername from "@/components/layout/RealUsername";
import { User } from "@/types/types";

type MiniUserInfoProps = {
  user: User | undefined;
};
const MiniUserInfo = ({ user }: MiniUserInfoProps) => {
  return (
    <div className="flex gap-x-2 px-4">
      <Link href={`/${user?._id}`}>
        <figure className="size-[66px] shrink-0 rounded-full cursor-pointer">
          <Image
            width={66}
            height={66}
            src={user?.avatar || "/images/default.jpg"}
            alt="post-createdBy-avt"
            className="size-full object-cover rounded-full"
          ></Image>
        </figure>
      </Link>
      <div className="max-w-[200px]">
        <Link href={`/${user?._id}`} className="flex items-center gap-x-1">
          <RealUsername
            username={String(user?.name)}
            isReal={!!user?.isReal}
          ></RealUsername>
        </Link>
        <p className="text-sm text-second-gray">{user?.bio}</p>
        {user?.website && (
          <Link
            href={""}
            className="flex items-center gap-x-1 mt-1 px-2 py-1 rounded-full bg-[#363636]"
          >
            <Link2 className="w-4 h-5" />
            <h4 className="text-xs">{user?.name}</h4>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MiniUserInfo;
