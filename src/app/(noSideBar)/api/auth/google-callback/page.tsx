import { Suspense } from 'react';

import LoginGoogleCallBack from './LoginGoogleCallBack';

const page = () => {
    return (
        <Suspense>
            <LoginGoogleCallBack></LoginGoogleCallBack>
        </Suspense>
    );
};

export default page;
