import { PlusSquare } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';

import CancelCreatePostDialog from './CancelCreatePostDialog';
import FormCreatePost from './FormCreatePost';
import PreviewPost from './PreviewPost';
import { Media } from './type';

const UploadFile = dynamic(() => import("./UploadFile"), { ssr: false });
export function CreatePost() {
    const [step, setStep] = useState(0);
    const [files, setFiles] = useState<FileList | null>(null);
    const [imageUrls, setImageUrls] = useState<Media[] | []>([]);
    const [open, setOpen] = useState(false);
    const [showCloseDialog, setShowCloseDialog] = useState(false);

    const handleSetFiles = (files: FileList | null) => {
        setFiles(files);
    };
    const handleSetStep = (step: number) => {
        setStep(step);
    };
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            if (!files?.length || !imageUrls.length) {
                setShowCloseDialog(false);
                setFiles(null);
                setImageUrls([]);
                setStep(0);
                return;
            }
            setShowCloseDialog(true);
            setOpen(true);
        }
    };
    const handleCancelCreatePost = () => {
        setShowCloseDialog(false);
        setFiles(null);
        setImageUrls([]);
        setOpen(false);
        setStep(0);
    };
    const handleCloseCancelCreatePost = () => {
        setShowCloseDialog(false);
    };
    const validateMedia = (urls: Media[]): boolean => {
        if (urls.length === 0) return true;
        const allImages = urls.every((url) => url.type === "image");
        return (allImages && urls.length < 10) || urls.length === 1;
    };

    useEffect(() => {
        if (files) {
            const invalidFile = Array.from(files).find(
                (file) =>
                    (file.type.includes("image") &&
                        file.size > 1024 * 1024 * 2) ||
                    (file.type.includes("video") && file.size > 1024 * 1024 * 5)
            );

            const urls: Media[] = Array.from(files).map((file) => ({
                type: file.type.includes("image") ? "image" : "video",
                path: URL.createObjectURL(file),
            }));

            setImageUrls(validateMedia(urls) && !invalidFile ? urls : []);

            return () => {
                urls.forEach((url) => URL.revokeObjectURL(url.path));
            };
        }
    }, [files]);

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <button className="flex items-center p-3 gap-x-2 w-full">
                        <PlusSquare />
                        <p className="line-clamp-1 hidden lg:block">Tạo</p>
                    </button>
                </DialogTrigger>
                <DialogContent className="!bg-primary-gray !max-w-fit">
                    <DialogTitle className="hidden"></DialogTitle>
                    {step === 0 && (
                        <UploadFile
                            step={step}
                            onSetFile={handleSetFiles}
                            onSetStep={handleSetStep}
                        />
                    )}
                    {step === 1 && (
                        <PreviewPost
                            step={step}
                            imageUrls={imageUrls}
                            onSetStep={handleSetStep}
                            onSetFiles={handleSetFiles}
                        ></PreviewPost>
                    )}
                    {step === 2 && (
                        <FormCreatePost
                            step={step}
                            files={files}
                            imageUrls={imageUrls}
                            onSetStep={handleSetStep}
                            onCloseModal={handleCancelCreatePost}
                        ></FormCreatePost>
                    )}
                </DialogContent>
            </Dialog>
            {showCloseDialog && (
                <CancelCreatePostDialog
                    isOpen={showCloseDialog}
                    onCancelCreatePost={handleCancelCreatePost}
                    onCloseCancelCreatePost={handleCloseCancelCreatePost}
                />
            )}
        </>
    );
}

export default CreatePost;
