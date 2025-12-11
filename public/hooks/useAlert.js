export const useAlert = (validations) => {
    const showAlerts = () => {
        for (const { test, message, ref } of validations) {
            if (!test()) {
                alert(message);
                if (ref && ref.current) {
                    ref.current.focus();
                }
                return false; // 검증 실패
            }
        }

        return true;
    };

    return showAlerts;
};

// 사용 샘플
// export default function Form() {
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const nameRef = useRef();
//   const ageRef = useRef();

//   // 모든 유효성 검증 로직
//   const validateAll = useAlert([
//     {
//       test: () => name.length >= 4,
//       message: "이름은 3자 이상 입력해 주세요.",
//       ref: nameRef,
//     },
//     {
//       test: () => !isNaN(age) && age > 0,
//       message: "나이는 양의 숫자로 입력해 주세요.",
//       ref: ageRef,
//     },
//   ]);

//   return (
//     <div>
//       <input
//         ref={nameRef}
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <input
//         ref={ageRef}
//         type="number"
//         value={age}
//         onChange={(e) => setAge(e.target.value)}
//       />
//       <button onClick={validateAll}>저장</button>
//     </div>
//   );
// }
