import axios from "axios";
import { handleResponse, handleError } from "@/lib/apis";

// 차종필터
export const fetchVinData = async (userId) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "vinCarcode2",
                userid: userId,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// 자동완성 데이터
export const fetchCarcode = async (userId) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "selectCarcode2",
                userid: userId,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// 차종 리스트
export const fetchCarData = async (userId, selectedSearchValue) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "selectCodeinfoVin14",
                userid: userId,
                vin14: selectedSearchValue?.vin4?.length > 3 ? selectedSearchValue?.vin4 : "",
                iv_carcode: selectedSearchValue?.iv_carcode ? selectedSearchValue.iv_carcode : "",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// 신규 차종 등록
export const addVin1to4 = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "insertCodeinfoAddItem",
                userid: userId,
                ...value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// 차대번호 5~11 코드
export const fetchVin5to11 = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "selectCodeinfoListGroupOther",
                userid: userId,
                ...value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// 차대번호 5~11 코드 수정
export const updateVin5to11 = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "updateCodeinfoAddItem",
                userid: userId,
                ...value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// 선택 차종코드 복사
export const copyVin5to11 = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "insertCodeCopy",
                userid: userId,
                ...value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// 선택 차종코드 초기화
export const initVin5to11 = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "deleteOtherCode",
                userid: userId,
                ...value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// 선택 차종 차대번호 5~11 코드 추가
export const addVin5to11 = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "insertCodeinfoAddItem",
                userid: userId,
                ...value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// 차종 삭제
export const deleteVinCode = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "deleteCodeinfoVin14",
                userid: userId,
                ...value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

// 5~11자리 코드 삭제
export const deleteVin5to11Code = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "deleteCodeinfoOther",
                userid: userId,
                ...value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};
