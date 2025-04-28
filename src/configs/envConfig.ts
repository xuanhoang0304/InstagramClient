interface envConfig {
    NEXT_PUBLIC_EXPIRES_ACCESSTOKEN: number;
    NEXT_PUBLIC_EXPIRES_REFRESHTOKEN: number;
}
const envConfig: envConfig = {
    NEXT_PUBLIC_EXPIRES_ACCESSTOKEN:
        Number(process.env.NEXT_PUBLIC_EXPIRES_ACCESSTOKEN) || 15 * 60,
    NEXT_PUBLIC_EXPIRES_REFRESHTOKEN:
        Number(process.env.NEXT_PUBLIC_EXPIRES_REFRESHTOKEN) ||
        7 * 24 * 60 * 60,
};
export default envConfig;
