import { useEffect, useRef } from "react";

export const useClick = (onClick) => {
    const element = useRef();

    useEffect(() => {
        if (typeof onClick !== "function") {
            return;
        }
        const currentElement = element.current;
        if (currentElement) {
            currentElement.addEventListener("click", onClick);
        }

        return () => {
            if (currentElement) {
                currentElement.removeEventListener("click", onClick);
            }
        };
    }, [onClick]); // 의존성 배열에 onClick 추가

    return element;
};
