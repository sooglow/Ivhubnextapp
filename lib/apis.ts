export function handleResponse(response) {
    if (response.data.result === "OK") {
        return response.data;
    } else {
        throw new Error(response.data.msg || "알 수 없는 오류가 발생했습니다.", { vin11: response.data.vin11 });
    }
}

export function handleError(error) {
    if (error.response) {
        throw new Error(`네트워크 요청 실패: ${error.response.status}, 메시지: ${error.response.data.msg}`);
    } else if (error.request) {
        throw new Error('응답 받지 못함');
    } else {
        throw new Error(`Error: ${error.message}`);
    }
}