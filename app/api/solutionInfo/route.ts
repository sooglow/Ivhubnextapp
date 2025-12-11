import { NextRequest, NextResponse } from "next/server";
import { SolutionProcedures } from "@/public/procedures/solutionInfo";
import { SolutionInfoCreateRequest } from "@/app/info/solutionInfo/types/Create";

// 솔루션 공지사항 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword") || null;
    const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const result = await SolutionProcedures.getSolutionInfoList(keyword, pageNumber, pageSize);

    if (result.success && result.data) {
      const items = Array.isArray(result.data) ? result.data : [result.data];
      const totalCount = items.length > 0 ? (items[0] as any).TotalCount || items.length : 0;

      const transformedItems = items.map((item: any) => {
        const { preview_url, ...rest } = item;
        return {
          ...rest,
          preViewUrl: preview_url || "",
        };
      });

      return NextResponse.json({
        result: true,
        data: {
          items: transformedItems,
          totalCount,
        },
        errMsg: null,
        errCode: null,
      });
    } else {
      return NextResponse.json(
        {
          result: false,
          data: null,
          errMsg: result.error || "데이터 조회에 실패했습니다.",
          errCode: "QUERY_FAILED",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        result: false,
        data: null,
        errMsg: "서버 오류가 발생했습니다.",
        errCode: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

// 솔루션 공지사항 생성
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const sday = formData.get("Sday") as string;
    const eday = formData.get("Eday") as string;
    const subject = formData.get("Subject") as string;
    const solutions = formData.get("Solutions") as string;
    const memo = formData.get("Memo") as string;

    const files = formData.getAll("files") as File[];
    const xlsFile = formData.get("xlsFile") as File | null;

    const createData: SolutionInfoCreateRequest = {
      sday,
      eday,
      subject,
      filename: null,
      solutions,
      memo,
      files,
      xlsFile,
    };

    const result = await SolutionProcedures.createSolutionInfo(createData);

    if (result.success) {
      return NextResponse.json({
        result: true,
        errMsg: null,
        errCode: null,
      });
    } else {
      return NextResponse.json(
        {
          result: false,
          errMsg: result.error || "솔루션 정보 생성에 실패했습니다.",
          errCode: "CREATE_FAILED",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        result: false,
        errMsg: "서버 오류가 발생했습니다.",
        errCode: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
