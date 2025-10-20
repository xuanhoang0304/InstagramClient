import EmojiPicker, { Theme } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { RefObject, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

import { cn } from "@/lib/utils";

type Props = {
  onSetEmoji: (emoji: string) => void;
};

const GroupIdInputEmoji = ({ onSetEmoji }: Props) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const handleClose = () => {
    setShowEmoji(false);
  };
  const handleShowEmoji = () => {
    setShowEmoji(true);
  };
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(emojiPickerRef as RefObject<HTMLDivElement>, handleClose);
  return (
    <div className="relative">
      <div
        onClick={handleShowEmoji}
        className={cn(
          "lg:flex items-center justify-center size-8 shrink-0 cursor-pointer hidden",
          showEmoji && "pointer-events-none",
        )}
      >
        <Smile className="size-full" />
      </div>
      {showEmoji && (
        <div ref={emojiPickerRef}>
          <EmojiPicker
            skinTonesDisabled
            searchDisabled
            theme={Theme.DARK}
            height={400}
            width={400}
            onEmojiClick={(emoji) => {
              onSetEmoji(emoji.emoji);
            }}
            lazyLoadEmojis
            className={`absolute! -top-[405px] left-full  z-100 select-none`}
          />
        </div>
      )}
    </div>
  );
};

export default GroupIdInputEmoji;
