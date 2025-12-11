import { useEffect, useState } from "react";

export const useTitle = (initialTitle) => {
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => {
        const htmlTitle = document.querySelector("title");
        htmlTitle.innerText = title;
    }, [title]);

    return setTitle;
};

// 사용 예제
// import React from "react";
// import { useTitle } from "./useTitle";

// const Contact = () => {
//   useTitle("IVOfficeHub - 업체관리");

//   return <h1>업체관리 메뉴</h1>;
// };

// export default Contact;
