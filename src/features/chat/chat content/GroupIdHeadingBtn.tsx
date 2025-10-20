import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { IGroup } from "../type";
import GroupChatManagerContainer from "./GroupChatManager/GroupChatManagerContainer";

interface GroupIdHeadingBtnProps {
  group: IGroup;
}
export function GroupIdHeadingBtn({ group }: GroupIdHeadingBtnProps) {
  const router = useRouter();
  const [step, setStep] = useState("");
  const handleChange = () => {
    setStep("");
    router.push(`/chats/${group._id}`);
  };
  const handleSetStep = (step: string) => {
    setStep(step);
  };
  return (
    <Sheet onOpenChange={handleChange}>
      <SheetTrigger asChild>
        <button className="size-10 flex items-center justify-center">
          <CircleAlert className="hover:fill-primary-white transition-colors hover:text-primary-gray" />
        </button>
      </SheetTrigger>
      <GroupChatManagerContainer
        group={group}
        step={step}
        onSetStep={handleSetStep}
      />
    </Sheet>
  );
}
