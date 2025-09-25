// export const dynamic = "force-dynamic";

import { Suspense } from "react";

import LoginGoogleCallBack from "./LoginGoogleCallBack";

const Page = () => {
  return (
    <Suspense>
      <LoginGoogleCallBack />
    </Suspense>
  );
};

export default Page;
