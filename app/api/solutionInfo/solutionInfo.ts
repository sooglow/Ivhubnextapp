import axios from "axios";
import { SolutionInfoListResponse } from "@/app/info/solutionInfo/types/List";

// 솔루션 목록 조회
export async function getSolutionInfoList(
  keyword: string,
  pageNumber: number,
  pageSize: number
): Promise<SolutionInfoListResponse> {
  try {
    const response = await axios.get<SolutionInfoListResponse>("/api/solutionInfo", {
      params: {
        keyword: keyword || "",
        pageNumber,
        pageSize,
      },
    });

    return response.data;
  } catch (error) {
    console.error("getSolutionInfoList 오류:", error);
    return {
      result: false,
      data: null,
      errMsg: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      errCode: null,
    };
  }
}
