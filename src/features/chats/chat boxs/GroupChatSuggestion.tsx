import { User } from '@/types/types';

type GroupChatSuggestionProps = {
    list: User[] | [];
};
const GroupChatSuggestion = ({ list }: GroupChatSuggestionProps) => {
  if(list.length === 0) {
    return <p className='pl-2  text-second-gray text-sm font-semibold mt-2'>Không tìm thấy tài khoản nào</p>
  }
    return <div>{list.length}</div>;
};

export default GroupChatSuggestion;
