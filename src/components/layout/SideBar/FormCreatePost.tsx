import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import Loading from "@/components/layout/loading";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/configs/axios";
import {
  handleError,
  handleMutateWithKey,
  handleUploadMediaFile,
} from "@/lib/utils";
import { usePostStore } from "@/store/postStore";
import { HttpResponse, IPost } from "@/types/types";

import { PreviewMediaPost } from "./PreviewMediaPost";
import StepControl from "./StepControl";
import { Media } from "./type";

type FormCreatePostProps = {
  step: number;
  imageUrls: Media[];
  files: FileList | null;
  onSetStep: (step: number) => void;
  onCloseModal: () => void;
};
type FormCreatePost = {
  caption: string;
  isReel: boolean;
  media: Media[];
};

type CreatedPostResponse = {
  data: IPost;
} & HttpResponse;
const FormCreatePost = ({
  imageUrls,
  files,
  step,
  onSetStep,
  onCloseModal,
}: FormCreatePostProps) => {
  const { setTargetPost } = usePostStore();
  const [isLoading, setLoading] = useState(false);

  const { handleSubmit, control, watch } = useForm<FormCreatePost>({
    defaultValues: {
      caption: "",
      isReel: files && files[0].type.includes("video") ? true : false,
      media: [],
    },
  });
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

  const handleCreatPost = async (data: FormCreatePost) => {
    const media = await handleUploadMedia();
    if (!media.length) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh hoặc video");
      return;
    }
    const postData = {
      ...data,
      media,
    };
    try {
      const response: CreatedPostResponse = await apiClient.fetchApi("posts", {
        method: "POST",
        data: postData,
      });
      if (response.code === 201) {
        toast.success("Tạo bài đăng thành công");
        handleMutateWithKey(`posts/?filters={"createdBy`);
        onCloseModal();
        setTargetPost({ post: response.data, action: "create" });
      }
    } catch (error) {
      handleError("handleCreatPost", error);
    } finally {
      setLoading(false);
    }
  };
  const contentWatch = watch("caption");
  return (
    <>
      {isLoading && (
        <Loading className="bg-black/60" text="Đang tạo bài biết..."></Loading>
      )}
      <StepControl
        step={step}
        title="Tạo bài biết mới"
        onSetStep={onSetStep}
        onSubmit={handleSubmit(handleCreatPost)}
      ></StepControl>
      <div className="flex flex-col lg:flex-row gap-4 w-full  md:max-w-fit">
        <div className="w-full lg:max-w-[400px] mx-auto">
          <PreviewMediaPost
            imageUrls={imageUrls}
            onSetStep={onSetStep}
          ></PreviewMediaPost>
        </div>
        <form
          onSubmit={handleSubmit(handleCreatPost)}
          className="md:w-[500px] overflow-y-auto lg:px-2    "
        >
          <Controller
            name="caption"
            control={control}
            render={({ field }) => (
              <div className="relative border border-secondary-gray rounded-lg">
                <Textarea
                  placeholder="Nhập suy nghĩ của bạn..."
                  className="resize-none !bg-inherit border-none max-h-[150px]"
                  {...field}
                />
                <p className="absolute bottom-2 right-6 text-sm text-second-gray">
                  {contentWatch.length}/2000
                </p>
              </div>
            )}
          />
        </form>
      </div>
    </>
  );
};

export default FormCreatePost;
