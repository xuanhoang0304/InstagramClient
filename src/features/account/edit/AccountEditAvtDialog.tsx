import { memo, RefObject, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useOnClickOutside } from "usehooks-ts";

import { Media } from "@/components/layout/SideBar/type";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiClient } from "@/configs/axios";
import envConfig from "@/configs/envConfig";
import {
  handleDeleteMedias,
  handleError,
  handleMutateWithKey,
  handleUploadMediaFile,
} from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { HttpResponse } from "@/types/types";

type Props = {
  trigger: React.ReactNode;
  onSetAvt?: (avtUrl: string) => void;
  onSetLoading?: (loading: boolean) => void;
};

const AccountEditAvtDialog = ({ trigger, onSetAvt, onSetLoading }: Props) => {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState(false);
  const [urlAvt, setUrlAvt] = useState("");
  const { myUser } = useMyStore();
  const ref = useRef<HTMLDivElement>(null);
  const handleUpdateUser = async (newAvtUrl: string) => {
    const response: HttpResponse = await apiClient.fetchApi(
      `/users/${myUser?._id}`,
      {
        method: "PUT",
        data: {
          avatar: newAvtUrl,
        },
      },
    );
    if (response.code === 200) {
      toast.success("Đã cập nhật ảnh đại diện thành công!");
      if (myUser?.avatar) {
        const oldMedia: { paths: Media[] } = {
          paths: [{ path: myUser?.avatar, type: "image" }],
        };
        handleDeleteMedias(oldMedia);
      }
      setUrlAvt("");
      handleMutateWithKey("@me");
    }
  };
  const handleChangeAvt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOpen(false);
      const previewUrl = URL.createObjectURL(file);
      const newFormData = new FormData();
      onSetAvt?.(previewUrl);
      newFormData.append("image", file);
      try {
        onSetLoading?.(true);
        const updateRes = (await handleUploadMediaFile(
          newFormData,
          "image",
        )) as Media;
        setUrlAvt(updateRes.path);
        if (updateRes?.path) {
          await handleUpdateUser(updateRes.path);
        }
      } catch (error) {
        handleError("handleChangeAvt.AccountEditAvtDialog", error);
        onSetAvt?.(myUser?.avatar || "/images/default.jpg");
        setErr(true);
      } finally {
        onSetLoading?.(false);
      }
    }
  };
  const handleDeleteCurAvt = async () => {
    if (!myUser?.avatar || myUser.avatar === envConfig.DEFAULT_IMG_URL) {
      setOpen(false);
      return;
    }
    await handleUpdateUser(
      "https://res.cloudinary.com/dt4ujubla/image/upload/v1761038505/default_tf9pcx.jpg",
    );
    setOpen(false);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  useOnClickOutside(ref as RefObject<HTMLDivElement>, handleCloseDialog);
  useEffect(() => {
    if (urlAvt && err) {
      const medias: {
        paths: Media[];
      } = {
        paths: [
          {
            path: urlAvt,
            type: "image",
          },
        ],
      };
      handleDeleteMedias(medias);
    }
  }, [urlAvt, err]);
  return (
    <Dialog open={open}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        ref={ref}
        tabIndex={-1}
        className="!bg-primary-gray !p-0 rounded-3xl gap-y-0 focus-within:outline-none focus-within:border-none"
      >
        <DialogHeader className="my-6">
          <DialogTitle className="text-center text-xl">
            Thay đổi ảnh đại diện
          </DialogTitle>
        </DialogHeader>
        <ul className="flex flex-col font-bold">
          <input
            type="file"
            className="hidden"
            id="file-upload"
            accept="image/*"
            onChange={handleChangeAvt}
          />
          <label
            htmlFor="file-upload"
            tabIndex={-1}
            className="py-3 bg-transparent hover:bg-second-button-background transition-colors text-sm  text-second-blue border-t-2 text-center border-second-button-background cursor-pointer"
          >
            Tải ảnh lên
          </label>
          <button
            tabIndex={-1}
            onClick={handleDeleteCurAvt}
            className="py-3 bg-transparent hover:bg-second-button-background transition-colors text-sm text-red-500 border-t-2 border-second-button-background"
          >
            Gở ảnh hiện tại
          </button>
          <DialogClose
            onClick={handleCloseDialog}
            tabIndex={-1}
            className="py-3 bg-transparent hover:bg-second-button-background transition-colors text-sm border-t-2 border-second-button-background rounded-b-3xl"
          >
            Hủy
          </DialogClose>
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default memo(AccountEditAvtDialog);
