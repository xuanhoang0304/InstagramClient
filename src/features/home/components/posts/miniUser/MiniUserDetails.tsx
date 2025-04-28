import { formatNumber } from "@/lib/utils";

type MiniUserDetailsProps = {
    quantity: number;
    desc: string;
};
const MiniUserDetails = ({ quantity, desc }: MiniUserDetailsProps) => {
    return (
        <div className="flex flex-col items-center text-sm ">
            <p className="font-bold">{formatNumber(quantity)}</p>
            <p>{desc}</p>
        </div>
    );
};

export default MiniUserDetails;
