import { ChangeEvent } from "react";

import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UploadFileProps = {
  step: number;
  onSetFile: (file: FileList) => void;
  onSetStep: (step: number) => void;
};
const UploadFile = ({ step, onSetFile, onSetStep }: UploadFileProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onSetFile(e.target.files);
      onSetStep(step + 1);
    }
  };
  return (
    <>
      <DialogTitle className="text-center">Tạo bài viết mới</DialogTitle>
      <DialogDescription className="text-sm text-second-gray italic max-w-[500px]">
        Mỗi bài đăng chỉ được tối đa 1 video hoặc 10 ảnh. Kích thước mỗi file
        ảnh không được lớn hơn 2MB. Kích thước mỗi file video không được lớn hơn
        5MB.
      </DialogDescription>
      <Label
        htmlFor="input-file"
        className="cursor-pointer text-sm  px-4 py-2 mx-auto rounded-lg bg-primary-blue hover:bg-second-blue inline-block text-center"
      >
        Chọn file từ máy
      </Label>
      <Input
        onChange={handleInputChange}
        type="file"
        multiple
        accept="image/*,video/*"
        id="input-file"
        name="input-file"
        className="hidden"
      />
    </>
  );
};

export default UploadFile;
