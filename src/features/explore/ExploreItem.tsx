import { IPost } from "@/types/types";

import ExploreItemPostList from "./ExploreItemPostList";

interface Props {
  item: IPost[];
  idx: number;
}
const ExploreItem = ({ item, idx }: Props) => {
  return (
    <li key={item[0]._id}>
      <ExploreItemPostList item={item} idx={idx}></ExploreItemPostList>
    </li>
  );
};

export default ExploreItem;
