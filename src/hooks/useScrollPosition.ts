import { useCallback, useState } from 'react';

import { useDebounce } from './useDebounce';

export const useScrollPosition = (delay: number = 500) => {
    const [scrollY, setScrollY] = useState(0);
    const debouncedScrollY = useDebounce(scrollY, delay);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollY(e.currentTarget.scrollTop);
    }, []);

    return {
        scrollY,
        debouncedScrollY,
        handleScroll,
    };
};
