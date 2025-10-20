"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";

export default function Loading({
  className,
  text,
  spinneClassname,
}: {
  className?: string;
  text?: string;
  spinneClassname?: string;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div
      className={cn(
        "fixed inset-0  bg-black flex items-center justify-center z-50",
        className,
      )}
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "animate-spin ease-linear rounded-full border-8 border-t-8 !border-b-red-600 border-transparent size-16 ",
            spinneClassname,
          )}
        ></div>
        <p className="text-gray-400 animate-bounce">{text || "Loading..."}</p>
      </div>
    </div>
  );
}
