import axios from "axios";
import { handleResponse, handleError } from "@/lib/apis";

// 차대번호 1~4 자리 분석 및 분석결과 조회
export const fetchCarTypeData = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "selectListGroupCarType",
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

// 차대번호 5~11자리 코드 데이터 조회
export const fetchVin5to11Data = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "selectListGroupOther",
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

// EPC 코드 및 소모품 정보
export const fetchEpcExpData = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "selectListGroupEpcCode",
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

// 차대번호 분석 결과 저장
export const insertVinAnalysisData = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "insertDataV2",
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

// 신규 차대번호 브랜드별 Count
export const getNewVinCountTypeBrand = async (userId) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "newVinMakerKind",
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

// 신규 차대번호 List
export const fetchNewVinList = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "newVinList",
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

// 신규 차대번호 분석
export const updateNewVinAnaysis = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "newVinWorkCheckIn",
                userid: userId,
                ...value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const analysisResult = {
            ...response,
            data: {
                ...response.data,
                ...value,
            },
        };

        return handleResponse(analysisResult);
    } catch (error) {
        handleError(error);
    }
};

// 신규 차대번호 작업 예외 처리
export const deleteNewVin = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "newVinWorkRemove",
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

// 차대번호 기초코드 추가
export const addVinCode = async (userId, value) => {
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

// EPC옵션 및 소모품 정보 삭제
export const removeVinData = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "vinDelete",
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
