import { User } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

interface ISuggestionItem {
    item: User;
}
const SuggestionItem = ({ item }: ISuggestionItem) => {
    return (
        <li className=" flex justify-between items-center">
            <div className=" flex items-center gap-x-2">
                <Link href={""}>
                    <figure className="size-11 rounded-full">
                        <Image
                            src={item?.avatar || "/images/default.jpg"}
                            alt="Profile-avt"
                            width={44}
                            height={44}
                            className="rounded-full size-full object-cover"
                        ></Image>
                    </figure>
                </Link>
                <div className="flex flex-col">
                    <Link
                        href={""}
                        className=" text-sm leading-[18px] font-semibold max-w-[150px] line-clamp-1"
                    >
                        {item?.name}
                    </Link>
                    <p className="text-second-gray text-sm leading-[18px]">
                        {item?.bio ? item.bio : "Gợi ý cho bạn"}
                    </p>
                </div>
            </div>
            <button className="text-primary-blue font-semibold text-xs hover:text-primary-blue-hover">
                Theo dõi
            </button>
        </li>
    );
};

export default SuggestionItem;
