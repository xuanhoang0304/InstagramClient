import { Images, Mic } from "lucide-react";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import Loading from "@/components/layout/loading";
import { Media } from "@/components/layout/SideBar/type";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { socket } from "@/configs/socket";
import { cn, handleError, handleUploadMediaFile } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useMyStore } from "@/store/zustand";

import { useMessageStore } from "../MessageStore";
import { IMessageFE } from "../type";
import GroupIdInputEmoji from "./GroupIdInputEmoji";
import GroupIdInputReplyWrapper from "./GroupIdInputReplyWrapper";
import MessagePreviewMedia from "./MessagePreviewMedia";

interface CreateMessData {
  groupId: string;
  text: string;
  images?: string[];
  videos?: string[];
  parentMessage?: string;
}
interface Props {
  onSetInputWrapperHeight: (height: number) => void;
}
const GroupIdInput = ({ onSetInputWrapperHeight }: Props) => {
  const { setMessageList } = useMessageStore();
  const [isLoading, setLoading] = useState(false);
  const [searchTxt, setSearchTxt] = useState("");
  const [files, setFiles] = useState<FileList | null>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { myUser } = useMyStore();
  const { setIsNewMessage, targetMessage, setTargetMessage } =
    useMessageStore();
  const { setNewMessage } = useChatStore();
  const { groupId } = useParams();
  const ref = useRef<HTMLDivElement>(null);
  // Func
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSearchTxt(e.target.value);
    if (ref.current) {
      onSetInputWrapperHeight(ref.current.offsetHeight);
    }
  };
  const handleChoseMedia = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };
  const handleSetFiles = (files: FileList) => {
    setFiles(files);
  };
  const handleUploadMedia = async () => {
    const uploadedMedia: Media[] = [];
    setLoading(true);
    if (files && files.length) {
      const uploadPromises = Array.from(files).map(async (file) => {
        const type = file.type.includes("video") ? "video" : "image";
        const formData = new FormData();
        formData.append(type, file);
        const result = await handleUploadMediaFile(formData, type);
        return result;
      });

      const results = await Promise.all(uploadPromises);

      uploadedMedia.push(...(results.filter(Boolean) as Media[]));
    }
    return uploadedMedia;
  };
  const handleCreateMessage = async (data: CreateMessData) => {
    const media: Media[] = await handleUploadMedia();
    if (!media.length && !data.text) {
      toast.error("Vui lòng nhập nội dung tin nhắn hoặc chọn lại file phù hợp");
      setLoading(false);
      return;
    }
    const images = media.filter((item) => item.type === "image");
    const videos = media.filter((item) => item.type === "video");
    const newData = media.length
      ? { ...data, images, videos }
      : (data as CreateMessData);
    try {
      const finalData = targetMessage
        ? { ...newData, parentMessage: targetMessage._id }
        : (newData as CreateMessData);
      socket.emit("createMessage", {
        data: finalData,
        curUserId: myUser?._id,
      });
    } catch (error) {
      handleError("handleCreateMessage", error);
    } finally {
      textareaRef.current?.focus();
      setLoading(false);
    }
  };
  const handleSetEmoji = (emoji: string) => {
    setSearchTxt(searchTxt + emoji);
  };

  // Func
  useEffect(() => {
    if (ref.current) {
      onSetInputWrapperHeight(ref.current.offsetHeight);
    }
  }, [ref.current?.offsetHeight, files?.length]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef.current, files?.length, targetMessage?._id]);

  useEffect(() => {
    socket.on("newMessage", (newMessage: IMessageFE) => {
      setMessageList((prev) => [newMessage, ...prev]);
      setSearchTxt("");
      setFiles(null);
      setIsNewMessage(true);
      setTargetMessage(null);
      setNewMessage(newMessage);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);
  return (
    <>
      <div
        ref={ref}
        className={cn(
          "w-full bg-black p-4 absolute bottom-0 left-0 right-0 z-10",
          targetMessage && "border-t border-primary-gray",
        )}
      >
        {targetMessage && <GroupIdInputReplyWrapper></GroupIdInputReplyWrapper>}
        {!!files?.length && (
          <MessagePreviewMedia
            files={files}
            onSetFiles={handleSetFiles}
          ></MessagePreviewMedia>
        )}
        <div className="flex items-center px-3 py-2 rounded-full border-2 border-primary-gray">
          <div className="flex items-center gap-x-2 w-full max-w-[calc(100%-40px)]!">
            <GroupIdInputEmoji onSetEmoji={handleSetEmoji}></GroupIdInputEmoji>

            <Textarea
              ref={textareaRef}
              className={cn(
                "max-h-8! min-h-auto!  rounded-none py-1 resize-none bg-transparent! focus-visible:ring-0 border-none! outline-none!",
                searchTxt && "max-h-[100px]!",
              )}
              placeholder="Nhắn tin..."
              value={searchTxt}
              name="Input chat"
              onChange={handleChange}
            ></Textarea>
          </div>
          {(files?.length || searchTxt) && (
            <button
              onClick={() =>
                handleCreateMessage({
                  groupId: String(groupId),
                  text: searchTxt,
                })
              }
              className={cn(
                " ml-3 font-semibold text-primary-blue hover:text-primary-blue-hover transition-colors ",
                !searchTxt &&
                  !files?.length &&
                  "text-second-button-background pointer-events-none",
              )}
            >
              Send
            </button>
          )}
          {!files?.length && !searchTxt && (
            <div className="flex items-center gap-x-3 ml-3">
              <button>
                <Mic />
              </button>

              <Label htmlFor="input-file" className="cursor-pointer">
                <Images />
              </Label>
              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                id="input-file"
                name="input-file"
                className="hidden"
                onChange={handleChoseMedia}
              ></Input>
            </div>
          )}
        </div>
      </div>
      {isLoading && (
        <Loading className="bg-black/60" text="Đang gửi tin nhắn..."></Loading>
      )}
    </>
  );
};

export default GroupIdInput;
