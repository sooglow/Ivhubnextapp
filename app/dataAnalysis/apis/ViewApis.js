import axios from "axios";
import { handleError, handleResponse } from "@/lib/apis";

// 차대번호 분석 결과 조회
export const fetchVinList = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "vininfo",
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

// EPC 옵션 및 소모품 조회
export const fetchEpcExpList = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "optinfo",
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

// 차대번호 샘플
export const fetchSampleVin17List = async (userId, value) => {
    try {
        const response = await axios.post(
            process.env.REACT_APP_VIN_API_URL,
            {
                servicename: "sampleVinNumber",
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
