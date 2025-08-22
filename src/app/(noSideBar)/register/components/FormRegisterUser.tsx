"use client";

import axios from 'axios';
import { CircleCheck, CircleX, LogIn, OctagonAlert } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import envConfig from '@/configs/envConfig';
import { cn } from '@/lib/utils';
import { RegisterFormData, RegisterShema } from '@/schemas/RegisterSchema';
import { zodResolver } from '@hookform/resolvers/zod';

type FormRegisterUser = {
    email: string;
    onSetStep?: (step: number) => void;
};
export default function FormRegisterUser({
    email,
    onSetStep,
}: FormRegisterUser) {
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
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
                }
            );
            if (response.data) {
                reset();
                setIsLoading(false);
                setIsRegister(true);
                toast.success("Đăng ký thành công:");
                // onSetStep?.(1);
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
                const res = await fetch(
                    `${envConfig.BACKEND_URL}/upload/image`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );
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
        handleRegister(submitData);
    };
    if (!isRegister) {
        return (
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 md:mt-10 w-full lg:w-[80%] mx-auto"
            >
                <div className="flex justify-between gap-x-10 gap-y-6 flex-col md:flex-row">
                    <div className="md:w-1/2 flex flex-col gap-y-3">
                        {/* Name */}
                        <div>
                            <Label className="mb-2" htmlFor="name">
                                Tên hiển thị{" "}
                                <span className="text-xs text-red-500">
                                    ( * )
                                </span>
                            </Label>
                            <Input id="name" {...register("name")} />
                            {errors.name && (
                                <p className="text-sm text-left text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <Label className="mb-2" htmlFor="username">
                                Tên đăng nhập{" "}
                                <span className="text-xs text-red-500">
                                    ( * )
                                </span>
                            </Label>
                            <Input id="username" {...register("username")} />
                            {errors.username && (
                                <p className="text-sm text-left text-red-500">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <Label className="mb-2" htmlFor="password">
                                Mật khẩu{" "}
                                <span className="text-xs text-red-500">
                                    ( * )
                                </span>
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-left text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
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
                                        <SelectTrigger className="!bg-primary-gray">
                                            <SelectValue placeholder="Chọn giới tính" />
                                        </SelectTrigger>
                                        <SelectContent className="!bg-primary-gray">
                                            <SelectItem value="male">
                                                Nam
                                            </SelectItem>
                                            <SelectItem value="female">
                                                Nữ
                                            </SelectItem>
                                            <SelectItem value="N/A">
                                                Không chia sẻ
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.gender && (
                                <p className="text-sm text-left text-red-500">
                                    {errors.gender.message}
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
                                className="!bg-primary-gray"
                                rows={4}
                                {...register("bio")}
                            />
                        </div>
                    </div>

                    <div className="md:w-1/2 flex flex-col gap-y-3">
                        {/* Phone number */}
                        <div>
                            <Label className="mb-2" htmlFor="phoneNumber">
                                Số điện thoại
                            </Label>
                            <Input
                                id="phoneNumber"
                                {...register("phoneNumber")}
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <Label className="mb-2" htmlFor="website">
                                Website
                            </Label>
                            <Input
                                id="website"
                                type="text"
                                {...register("website")}
                            />
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
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const previewUrl =
                                                    URL.createObjectURL(file);
                                                setPreview(previewUrl);
                                            } else {
                                                setPreview("");
                                            }
                                            field.onChange(e.target.files);
                                        }}
                                    />
                                    {errors.avatar && (
                                        <p className="text-sm text-left text-red-500">
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

                <div className="flex items-center justify-center gap-x-3 mt-4">
                    <Button
                        className={cn(
                            "transition-colors min-w-[120px] bg-primary-blue text-primary-white hover:bg-second-blue",
                            isLoading && "pointer-events-none opacity-65"
                        )}
                        type="submit"
                    >
                        Đăng ký
                    </Button>
                    <Button
                        variant={"ghost"}
                        onClick={() => onSetStep?.(1)}
                        className={cn("transition-colors min-w-[120px]")}
                        type="button"
                    >
                        Hủy đăng ký
                    </Button>
                </div>
            </form>
        );
    }
    return (
        <div className="md:w-[50%] mx-auto mt-10 flex flex-col items-center">
            <CircleCheck className="size-[80px]  text-green-500" />
            <h1 className="text-3xl text-center mt-4">Đăng ký thành công</h1>
            <button
                onClick={() => {
                    router.push("/login");
                    setIsRegister(false);
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
}
