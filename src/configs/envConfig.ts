interface envConfig {
  NEXT_PUBLIC_EXPIRES_ACCESSTOKEN: number;
  NEXT_PUBLIC_EXPIRES_REFRESHTOKEN: number;
  BACKEND_URL: string;
  FRONTEND_URL: string;
  MINUTE_GROUP_MESSAGE: number;
  JWT_SECRET: string;
  IMAGE_SIZE: number;
  VIDEO_SIZE: number;
  DEFAULT_IMG_URL: string;
}
const envConfig: envConfig = {
  NEXT_PUBLIC_EXPIRES_ACCESSTOKEN:
    Number(process.env.NEXT_PUBLIC_EXPIRES_ACCESSTOKEN) || 15 * 60,
  NEXT_PUBLIC_EXPIRES_REFRESHTOKEN:
    Number(process.env.NEXT_PUBLIC_EXPIRES_REFRESHTOKEN) || 7 * 24 * 60 * 60,
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  MINUTE_GROUP_MESSAGE:
    Number(process.env.NEXT_PUBLIC_MINUTE_GROUP_MESSAGE) || 15,
  JWT_SECRET: String(process.env.NEXT_PUBLIC_JWT_SECRET),
  IMAGE_SIZE: Number(process.env.NEXT_PUBLIC_IMAGE_SIZE || 0),
  VIDEO_SIZE: Number(process.env.NEXT_PUBLIC_VIDEO_SIZE || 0),
  DEFAULT_IMG_URL: String(process.env.NEXT_PUBLIC_VIDEO_SIZE || ""),
};

export default envConfig;
