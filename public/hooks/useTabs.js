import { useState } from "react";

export const useTabs = (initialTab, allTabs) => {
    const [currentIndex, setCurrentIndex] = useState(initialTab);

    if (!allTabs || !Array.isArray(allTabs)) {
        return;
    }

    return {
        currentItem: allTabs[currentIndex],
        changeItem: setCurrentIndex,
    };
};

// 사용 예제 (useClick과 함께~)
// import React from "react";
// import { useTabs } from "./useTabs";
// import { useClick } from "./useClick";

// const content = [
//   {
//     tab: "Section 1",
//     content: "I'm the content of the Section 1"
//   },
//   {
//     tab: "Section 2",
//     content: "I'm the content of the Section 2"
//   },
//   {
//     tab: "Section 3",
//     content: "I'm the content of the Section 3"
//   }
// ];

// const App = () => {
//   const { currentItem, changeItem } = useTabs(0, content);

//   // 클릭될 때 콘솔에 메시지를 출력하는 함수
//   const logToConsole = (index) => {
//     console.log(`Section ${index + 1} was clicked`);
//     changeItem(index); // 탭 변경
//   };

//   // useClick을 사용하여 각 섹션에 대한 클릭 훅 생성
//   const section1Click = useClick(() => logToConsole(0));
//   const section2Click = useClick(() => logToConsole(1));
//   const section3Click = useClick(() => logToConsole(2));

//   return (
//     <div>
//       <button ref={section1Click}>{content[0].tab}</button>
//       <button ref={section2Click}>{content[1].tab}</button>
//       <button ref={section3Click}>{content[2].tab}</button>
//       <div>{currentItem.content}</div>
//     </div>
//   );
// };

// export default App;
