import { useEffect, useRef } from "react";

export const useHover = (onMouseOver, onMouseOut) => {
    const element = useRef();

    useEffect(() => {
        const currentElement = element.current;
        if (currentElement) {
            // onMouseOver가 함수인지 확인하고, 함수라면 이벤트 리스너를 추가
            if (typeof onMouseOver === "function") {
                currentElement.addEventListener("mouseover", onMouseOver);
            }

            // onMouseOut가 함수인지 확인하고, 함수라면 이벤트 리스너를 추가
            if (typeof onMouseOut === "function") {
                currentElement.addEventListener("mouseout", onMouseOut);
            }
        }

        // 컴포넌트가 언마운트 될 때 이벤트 리스너를 정리
        return () => {
            if (currentElement) {
                if (typeof onMouseOver === "function") {
                    currentElement.removeEventListener("mouseover", onMouseOver);
                }

                if (typeof onMouseOut === "function") {
                    currentElement.removeEventListener("mouseout", onMouseOut);
                }
            }
        };
    }, [onMouseOver, onMouseOut]); // 의존성 배열에 onMouseOver, onMouseOut 추가

    return element;
};

// 사용 샘플
// import React from "react";
// import { useHover } from "./useHover";

// const App = () => {
//   const handleMouseOver = () => console.log("Mouse is over!");
//   const handleMouseOut = () => console.log("Mouse is out!");
//   const elementRef = useHover(handleMouseOver, handleMouseOut);

//   return (
//     <div>
//       <div ref={elementRef}>Hover over me!</div>
//     </div>
//   );
// };

// export default App;
