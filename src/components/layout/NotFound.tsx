import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center flex-1">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-6xl sm:text-8xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          404
        </h1>
        <p className="mt-4 text-xl sm:text-2xl font-medium text-gray-600 dark:text-gray-300">
          Ôi không! Trang không tồn tại.
        </p>
        <p className="mt-2 text-base sm:text-lg text-gray-500 dark:text-gray-400">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa!
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
