import { IPost } from "@/types/types";

import ExploreItem from "./ExploreItem";

interface Props {
  list: IPost[][];
}
const ExploreList = ({ list }: Props) => {
  return (
    <ul className="grid grid-cols-1 gap-0.5 w-full md:w-[90%] lg:w-[80%] mx-auto md:py-10 pb-10">
      {list?.map((item, idx) => (
        <ExploreItem key={item[0]._id} item={item} idx={idx}></ExploreItem>
      ))}
    </ul>
  );
};

export default ExploreList;
