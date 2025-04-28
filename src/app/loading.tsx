"use client";
export default function Loading() {
    return (
        <div className="fixed inset-0  bg-black flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin ease-linear rounded-full border-8 border-t-8 border-b-red-600 border-transparent  h-16 w-16 mb-4"></div>
                <p className="text-gray-400 animate-bounce">Loading...</p>
            </div>
        </div>
    );
}
