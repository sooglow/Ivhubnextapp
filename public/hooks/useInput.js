import { useState } from "react";

export const useInput = (initalValue, validator) => {
    const [value, setValue] = useState(initalValue);

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        let willUpdate = true;
        if (typeof validator === "function") {
            willUpdate = validator(value);
        }
        if (willUpdate) {
            setValue(value);
        }
    };

    return { value, setValue, onChange };
};

// 사용 예제
// import React from "react";
// import { useInput } from "./useInput";

// const App = () => {
//   // 입력 값이 10자 이하인 경우에만 입력을 허용하는 검증 함수
//   const maxLen = (value) => value.length <= 10;

//   // useInput 훅 사용, 초기값은 빈 문자열이고 maxLen 함수로 검증
//   const nameInput = useInput("", maxLen);

//   return (
//     <div>
//       <h1>Hello</h1>
//       <input placeholder="Name" {...nameInput} />
//       {/* nameInput에는 value와 onChange가 포함되어 있음 */}
//     </div>
//   );
// };

// export default App;
