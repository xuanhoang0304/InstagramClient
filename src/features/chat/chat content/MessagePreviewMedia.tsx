import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Media } from "@/components/layout/SideBar/type";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import envConfig from "@/configs/envConfig";
import { cn } from "@/lib/utils";

import { MessageMediaPreviewDialog } from "./MessageMediaPreviewDialog";

interface Props {
  files: FileList;
  onSetFiles: (files: FileList) => void;
}

const MessagePreviewMedia = ({ files, onSetFiles }: Props) => {
  const [media, setMedia] = useState<Media[] | []>([]);
  const handleDeleteFile = (fileName: string) => {
    const newFiles = Array.from(files).filter((item) => item.name !== fileName);
    const dataTransfer = new DataTransfer();
    newFiles.forEach((file) => dataTransfer.items.add(file));
    onSetFiles(dataTransfer.files);
  };
  useEffect(() => {
    if (files) {
      const urls: Media[] = Array.from(files).map((file) => {
        const isValid = file.type.includes("image")
          ? file.size < envConfig.IMAGE_SIZE * 1024 * 1024
          : file.size < envConfig.VIDEO_SIZE * 1024 * 1024;
        if (!isValid) {
          toast.error(`Ảnh hoặc video vượt quá kích thước cho phép`, {
            duration: 3000,
          });
        }
        return {
          name: file.name,
          type: file.type.includes("image") ? "image" : "video",
          path: URL.createObjectURL(file),
          isValid,
        };
      });

      setMedia(urls);
      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url.path));
      };
    }
  }, [files]);
  return (
    <div className="flex items-center gap-x-3 mb-3">
      <ul className="flex items-center flex-wrap gap-3">
        {!!media.length &&
          media.map((file) => (
            <li
              key={file.path}
              className={cn(
                "relative border border-second-gray rounded-lg cursor-pointer",
                !file.isValid && "border-red-500 border-2",
              )}
            >
              <MessageMediaPreviewDialog
                file={file}
              ></MessageMediaPreviewDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleDeleteFile(file.name as string)}
                    className="absolute -right-1 -top-1 bg-second-button-background rounded-full"
                  >
                    <CircleX
                      className={cn("size-4", !file.isValid && "fill-red-500")}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className={cn(!file.isValid && "text-red-500")}>
                    {file.isValid
                      ? "Bỏ chọn"
                      : "File có kích thước quá lớn sẽ không được gửi kèm theo"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MessagePreviewMedia;
