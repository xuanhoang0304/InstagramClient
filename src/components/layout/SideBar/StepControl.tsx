import { ArrowLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';

type StepControlProps = {
    step: number;
    title: string;
    onSetStep: (step: number) => void;
    onSubmit?: () => void;
    onSetFiles?: (files: FileList | null) => void;
};
const StepControl = ({
    step,
    title,
    onSetStep,
    onSubmit,
    onSetFiles,
}: StepControlProps) => {
    return (
        <div
            className={cn(
                "flex justify-between px-4 mb-4",
                !step && "justify-center"
            )}
        >
            <button
                onClick={() => {
                    if (step == 1) {
                        onSetFiles?.(null);
                    }
                    onSetStep(step - 1);
                }}
                className={cn("hover:fill-primary-white", step == 0 && "hidden")}
            >
               <ArrowLeft />
            </button>
            <DialogTitle>{title}</DialogTitle>
            <button
                onClick={() => {
                    onSetStep(step + 1);
                }}
                className={cn("hover:text-primary-blue text-second-blue font-semibold transition-colors", (step == 0 || step == 2) && "hidden")}
            >
                Tiếp
            </button>
            <button
                type="submit"
                onClick={onSubmit}
                className={cn("hidden", step == 2 && "block text-primary-blue hover:text-second-blue font-semibold transition-colors")}
            >
                Chia sẻ
            </button>
        </div>
    );
};

export default StepControl;
