import { RefObject, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

type ConfirmDeleteProps = {
    isOpen: boolean;
    action: string;
    actionTitle: string;
    actionDescription: string;
    trigger?: React.ReactNode | string;
    inModal?: boolean;
    onDelete: () => void;
    onCancel: () => void;
    onOpenChange: () => void;
};
const ConfirmDelete = ({
    isOpen,
    action,
    actionTitle,
    actionDescription,
    trigger,
    inModal,
    onDelete,
    onCancel,
    onOpenChange,
}: ConfirmDeleteProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const handleClose = () => {
        onCancel();
    };
    useOnClickOutside(ref as RefObject<HTMLElement>, handleClose);

    return (
        <>
            {trigger && (
                <button
                    onClick={onOpenChange}
                    className="px-2 py-[13.6px] font-bold text-[#ed4956] border-b dark:border-[#363636] border-solid"
                >
                    {trigger}
                </button>
            )}

            {isOpen && inModal ? (
                <div className="bg-black/50 fixed inset-0 z-[50] flex items-center justify-center">
                    <div
                        ref={ref}
                        className="sm:max-w-[400px] px-2  dark:!bg-[#262626] focus-visible:outline-none flex rounded-lg flex-col gap-y-0 border-none outline-none text-sm text-center"
                    >
                        <div className="mt-6">
                            <h3 className="text-xl font-bold dark:text-white">
                                {actionTitle}
                            </h3>
                            <p className="text-sm text-second-gray mt-1">
                                {actionDescription}
                            </p>
                        </div>
                        <button
                            onClick={onDelete}
                            className="px-2 py-[13.6px] mt-6 font-bold text-[#ed4956] border-y dark:border-[#363636] border-solid"
                        >
                            {action}
                        </button>

                        <button onClick={onCancel} className="px-2 py-[14px]">
                            Hủy
                        </button>
                    </div>
                </div>
            ) : (
                <Dialog open={isOpen} onOpenChange={onOpenChange}>
                    <DialogContent
                        showclose="false"
                        className="sm:max-w-[400px]  dark:!bg-[#262626] focus-visible:outline-none flex p-0 flex-col gap-y-0 border-none outline-none text-sm text-center"
                    >
                        <DialogHeader className="mt-6">
                            <DialogTitle className="text-center">
                                {actionTitle}
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                {actionDescription}
                            </DialogDescription>
                        </DialogHeader>
                        <button
                            onClick={onDelete}
                            className="px-2 py-[13.6px] mt-6 font-bold text-[#ed4956] border-y dark:border-[#363636] border-solid"
                        >
                            {action}
                        </button>

                        <button onClick={onCancel} className="px-2 py-[14px]">
                            Hủy
                        </button>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default ConfirmDelete;
