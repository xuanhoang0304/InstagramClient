"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/configs/axios";
import { cn, handleError, handleMutateWithKey } from "@/lib/utils";
import {
  AccountEditInfoFormData,
  AccountEditInfoFormSchema,
} from "@/schemas/AccountEditInfoFormSchema";
import { useMyStore } from "@/store/zustand";
import { HttpResponse, User } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";

const AccountEditInfoForm = () => {
  const { setMyUser } = useMyStore();
  const [isLoading, setIsLoading] = useState(false);
  const myUser = useMyStore.getState().myUser;
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<AccountEditInfoFormData>({
    resolver: zodResolver(AccountEditInfoFormSchema()),
    defaultValues: {
      bio: myUser?.bio,
      name: myUser?.name,
      gender: myUser?.gender,
    },
  });
  const handleEditInfo = async (data: AccountEditInfoFormData) => {
    try {
      setIsLoading(true);
      const response: HttpResponse & { data: User } = await apiClient.fetchApi(
        `/users/${myUser?._id}`,
        {
          method: "PUT",
          data,
        },
      );

      if (response.code === 200) {
        toast.success("Cập nhật thành công");
        reset({
          bio: response.data.bio,
          name: response.data.name,
          gender: response.data.gender,
        });
        handleMutateWithKey(`@me`);
        setMyUser(response.data);
      }
    } catch (error) {
      handleError("handleEditInfo.AccountEditInfoForm", error);
    } finally {
      setIsLoading(false);
    }
  };
  const curInfo = watch();
  const oldInfo = {
    bio: myUser?.bio,
    name: myUser?.name,
    gender: myUser?.gender,
  };
  const isChange = JSON.stringify(curInfo) === JSON.stringify(oldInfo);
  return (
    <form
      onSubmit={handleSubmit(handleEditInfo)}
      className="mt-8 mb-15 flex flex-col gap-y-6"
    >
      <Controller
        name="name"
        control={control}
        defaultValue={myUser?.name}
        render={({ field }) => (
          <div>
            <label htmlFor="input-name" className="font-bold">
              Tên hiển thị
            </label>
            <input
              id="input-name"
              autoComplete="off"
              type="text"
              {...field}
              className="mt-3 p-3  outline-none border border-second-gray/50 rounded-lg w-full"
            ></input>
            <span className="text-red-500 text-xs font-semibold">
              {errors.name?.message}
            </span>
          </div>
        )}
      />
      <Controller
        name="bio"
        control={control}
        defaultValue={myUser?.bio}
        render={({ field }) => (
          <div className="relative">
            <label htmlFor="input-bio" className="font-bold">
              Tiểu sử
            </label>
            <textarea
              id="input-bio"
              placeholder="Thêm tiểu sử..."
              {...field}
              className="mt-3 p-3 pr-8 h-[150px] outline-none border resize-none border-second-gray/50 rounded-lg w-full"
            ></textarea>
            <span
              className={cn(
                "absolute bottom-4 right-4 text-xs font-semibold text-second-gray",
                errors.bio?.message && "bottom-10",
              )}
            >
              {field.value.length}/150
            </span>
            <span className="text-red-500 text-xs font-semibold">
              {errors.bio?.message}
            </span>
          </div>
        )}
      />
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor="input-gender" className="font-bold">
              Giới tính
            </label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className=" !bg-primary-gray !w-full mt-3 !border-second-gray/50">
                <SelectValue
                  placeholder={
                    myUser?.gender === "N/A"
                      ? "Không muốn tiết lộ"
                      : myUser?.gender === "male"
                        ? "Nam"
                        : "Nữ"
                  }
                />
              </SelectTrigger>
              <SelectContent className="!w-full !bg-primary-gray !border-second-gray/50">
                <SelectItem
                  className="hover:!bg-second-button-background"
                  value="male"
                >
                  Nam
                </SelectItem>
                <SelectItem
                  className="hover:!bg-second-button-background"
                  value="female"
                >
                  Nữ
                </SelectItem>
                <SelectItem
                  className="hover:!bg-second-button-background"
                  value="N/A"
                >
                  Không muốn tiết lộ
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      />
      <Button
        type="submit"
        disabled={isChange || isLoading}
        className="mt-3 bg-second-blue hover:bg-primary-blue text-primary-white md:max-w-[200px] w-full mx-auto"
      >
        Cập nhật
      </Button>
    </form>
  );
};

export default AccountEditInfoForm;
