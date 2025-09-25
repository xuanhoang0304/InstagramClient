import { cn, formatNumber } from "@/lib/utils";

type MiniUserDetailsProps = {
  quantity: number;
  desc: string;
  className?: string;
};
const MiniUserDetails = ({
  quantity,
  desc,
  className,
}: MiniUserDetailsProps) => {
  return (
    <div className={cn("flex flex-col items-center text-sm ", className)}>
      <p className="font-bold">{formatNumber(quantity)}</p>
      <p className="text-nowrap">{desc}</p>
    </div>
  );
};

export default MiniUserDetails;
