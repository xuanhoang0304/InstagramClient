import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

type CancelCreatePostDialogProps = {
    isOpen: boolean;
    onCancelCreatePost: () => void;
    onCloseCancelCreatePost: () => void;
};
const CancelCreatePostDialog = ({
    isOpen,
    onCancelCreatePost,
    onCloseCancelCreatePost,
}: CancelCreatePostDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onCloseCancelCreatePost}>
            <DialogContent
                showclose="false"
                className="sm:max-w-[400px]  dark:!bg-[#262626] focus-visible:outline-none flex p-0 flex-col gap-y-0 border-none outline-none text-sm text-center"
            >
                <DialogHeader className="mt-6">
                    <DialogTitle className="text-center">
                        Bỏ bài viết?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Nếu rời đi, bạn sẽ mất những gì vừa chỉnh sửa.
                    </DialogDescription>
                </DialogHeader>
                <button
                    onClick={onCancelCreatePost}
                    className="px-2 py-[13.6px] mt-6 font-bold text-[#ed4956] border-y dark:border-[#363636] border-solid"
                >
                    Bỏ
                </button>

                <button
                    onClick={onCloseCancelCreatePost}
                    className="px-2 py-[14px]"
                >
                    Hủy
                </button>
            </DialogContent>
        </Dialog>
    );
};

export default CancelCreatePostDialog;
