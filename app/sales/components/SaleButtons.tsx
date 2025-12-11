interface SaleButtonsProps {
    listClick: () => void;
    editBtnClick: () => void;
    deleteBtnClick: () => void;
}

export default function SaleButtons({
    listClick,
    editBtnClick,
    deleteBtnClick,
}: SaleButtonsProps) {
    return (
        <li className="flex justify-between pb-4">
            <button
                className="w-[33%] h-[40px] ml-2 text-white rounded-md bg-[#A50A2E] cursor-pointer"
                onClick={listClick}
            >
                목록으로
            </button>
            <button
                className="w-[33%] h-[40px] ml-2 text-white rounded-md bg-[#77829B] cursor-pointer"
                onClick={deleteBtnClick}
            >
                삭제하기
            </button>
            <button
                className="w-[33%] h-[40px] ml-2 text-white rounded-md bg-[#77829B] cursor-pointer"
                onClick={editBtnClick}
            >
                저장하기
            </button>
        </li>
    );
}
