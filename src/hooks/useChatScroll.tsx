import React from "react";

function useChatScroll<T>(dep: T): React.MutableRefObject<any> {
    const ref = React.useRef<any>();

    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [dep]);

    return ref;
}

export default useChatScroll;
