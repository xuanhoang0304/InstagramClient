"use client";

import axios from "axios";
import { CircleCheck, CircleX, LogIn, OctagonAlert } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import envConfig from "@/configs/envConfig";
import { cn } from "@/lib/utils";
import { RegisterFormData, RegisterShema } from "@/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type FormRegisterUser = {
  step: number;
  email: string;
  onSetStep?: (step: number) => void;
};
const FormRegisterUser = ({ step, email, onSetStep }: FormRegisterUser) => {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterShema()),
    defaultValues: {
      email,
      name: "",
      username: "",
      password: "",
      gender: "N/A",
      phoneNumber: "",
      website: "",
      bio: "",
      avatar: "",
    },
  });
  const handleRegister = async (data: RegisterFormData) => {
    try {
      const response = await axios.post(
        `${envConfig.BACKEND_URL}/api/users/`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.data) {
        reset();
        setIsLoading(false);

        toast.success("Đăng ký thành công:");
        onSetStep?.(4);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response?.data?.errors) {
          toast.custom((t) => (
            <div className=" px-2 py-3 rounded relative  border border-gray-300 bg-red-300 ">
              <div className="flex items-center gap-x-2">
                <OctagonAlert className="text-red-600 size-4" />
                <h1 className="text-red-600 text-sm">
                  {error.response?.data?.message}
                </h1>
              </div>
              <button
                className="absolute top-[-6px] left-[-6px] z-10 "
                onClick={() => toast.dismiss(t)}
              >
                <CircleX className=" text-red-300 fill-white" />
              </button>
            </div>
          ));
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          return;
        } else {
          toast.warning(error.response?.data?.message, {
            duration: 3000,
          });
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    }
  };
  const onSubmit = async (data: RegisterFormData) => {
    let avatarUrl = "";
    setIsLoading(true);
    if (data.avatar?.[0]) {
      const formData = new FormData();
      formData.append("image", data.avatar[0]);
      try {
        const res = await fetch(`${envConfig.BACKEND_URL}/api/upload/image`, {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        if (result?.data) {
          avatarUrl = result.data.path;
        }
      } catch (error) {
        console.error("Upload avatar failed:", error);
      }
    }
    const submitData = {
      ...data,
      avatar: avatarUrl,
    };
    await handleRegister(submitData);
  };
  if (step === 3) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="w-full py-6">
        <div className="flex justify-between gap-x-10 gap-y-6 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col gap-y-6">
            {/* Name */}
            <div>
              <Label className="mb-2" htmlFor="name">
                Tên hiển thị <span className=" text-red-500">*</span>
              </Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs mt-1.5 text-left text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <Label className="mb-2" htmlFor="username">
                Tên đăng nhập <span className=" text-red-500">*</span>
              </Label>
              <Input id="username" {...register("username")} />
              {errors.username && (
                <p className="text-xs mt-1.5 text-left text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label className="mb-2" htmlFor="password">
                Mật khẩu <span className=" text-red-500">*</span>
              </Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-xs mt-1.5 text-left text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <Label className="mb-2" htmlFor="bio">
                Bio
              </Label>
              <Textarea
                id="bio"
                className="bg-primary-gray! resize-none max-h-[100px]"
                rows={10}
                {...register("bio")}
              />
            </div>

            {/* Gender */}
            <div>
              <Label className="mb-2">Giới tính</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-primary-gray! w-full">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent className="bg-primary-gray!">
                      <SelectItem
                        className="hover:bg-second-button-background! focus:bg-second-button-background!"
                        value="male"
                      >
                        Nam
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-second-button-background! focus:bg-second-button-background!"
                        value="female"
                      >
                        Nữ
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-second-button-background! focus:bg-second-button-background!"
                        value="N/A"
                      >
                        Không chia sẻ
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-xs mt-1.5 text-left text-red-500">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-y-6">
            {/* Phone number */}
            <div>
              <Label className="mb-2" htmlFor="phoneNumber">
                Số điện thoại
              </Label>
              <Input id="phoneNumber" {...register("phoneNumber")} />
            </div>

            {/* Website */}
            <div>
              <Label className="mb-2" htmlFor="website">
                Website
              </Label>
              <Input id="website" type="text" {...register("website")} />
            </div>

            {/* Avatar */}

            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="mb-2" htmlFor="avatar">
                    Avatar
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setPreview(previewUrl);
                      } else {
                        setPreview("");
                      }
                      field.onChange(e.target.files);
                    }}
                  />
                  {errors.avatar && (
                    <p className="text-xs mt-1.5 text-left text-red-500">
                      {errors.avatar.message as string}
                    </p>
                  )}
                  {preview && (
                    <Image
                      src={preview}
                      alt="Avatar preview"
                      className="mt-2 w-32 h-32 object-cover rounded-full"
                      width={100}
                      height={100}
                    />
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex w-full flex-col lg:flex-row items-center gap-y-3 justify-end gap-x-3 lg:mt-4 mt-6">
          <Button
            className={cn(
              "transition-colors w-full min-w-[120px] flex-1 lg:max-w-[200px] bg-primary-blue text-primary-white hover:bg-second-blue",
              isLoading && "pointer-events-none opacity-65",
            )}
            type="submit"
          >
            {isLoading && (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            )}
            Đăng ký
          </Button>
          <Button
            variant={"default"}
            onClick={() => onSetStep?.(1)}
            className={cn(
              "transition-colors flex-1 w-full lg:max-w-[200px] min-w-[120px]",
            )}
            type="button"
          >
            Hủy đăng ký
          </Button>
        </div>
      </form>
    );
  }
  return (
    <div className=" mx-auto mt-10 flex flex-col items-center">
      <CircleCheck className="size-[80px]  text-green-500" />
      <h1 className="text-3xl text-center mt-4">Đăng ký thành công</h1>
      <button
        onClick={() => {
          router.push("/login");
        }}
        className="flex text-white items-center gap-x-2 px-4 py-2 rounded-lg mt-4 bg-green-500 hover:bg-green-300 transition-colors group"
      >
        <LogIn className="group-hover:text-black transition-colors w-4" />
        <p className="group-hover:text-black transition-colors">
          Đăng nhập ngay
        </p>
      </button>
    </div>
  );
};
export default memo(FormRegisterUser);
