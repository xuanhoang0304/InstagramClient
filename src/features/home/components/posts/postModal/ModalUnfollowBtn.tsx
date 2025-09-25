import Image from "next/image";
import { RefObject, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

import { User } from "@/types/types";

type ModalUnfollowBtnProps = {
  user: User | undefined;
  onFollowFunc: (userId: string) => void;
};
const ModalUnfollowBtn = ({ user, onFollowFunc }: ModalUnfollowBtnProps) => {
  const unfolowRef = useRef<HTMLDivElement>(null);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const handleCloseFollowModal = () => {
    setShowFollowModal(false);
  };
  useOnClickOutside(
    unfolowRef as RefObject<HTMLDivElement>,
    handleCloseFollowModal,
  );
  return (
    <>
      <button
        onClick={() => {
          setShowFollowModal(true);
        }}
        className="px-2 py-[13.6px] font-bold text-[#ed4956] border-b dark:border-[#363636] border-solid"
      >
        Bỏ theo dõi
      </button>
      {showFollowModal && (
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
          <div
            ref={unfolowRef}
            className="max-w-[400px] w-full !bg-primary-gray flex flex-col items-center gap-y-0 p-0 rounded-[12px]"
          >
            <div className="py-8">
              <figure className="size-[90px] rounded-full mx-auto">
                <Image
                  width={90}
                  height={90}
                  src={user?.avatar || "/images/default.jpg"}
                  alt="avt"
                  className="size-full rounded-full object-cover"
                ></Image>
              </figure>
              <h3 className="mt-8 text-sm">Bỏ theo dõi @{user?.name}?</h3>
            </div>

            <button
              onClick={() => onFollowFunc(user?._id as string)}
              tabIndex={0}
              className="text-red-500 font-bold py-[12.4px] text-sm border-y border-second-gray w-full"
            >
              Bỏ theo dõi
            </button>

            <button
              onClick={handleCloseFollowModal}
              tabIndex={0}
              type="button"
              className="text-sm py-[14px] w-full"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalUnfollowBtn;
