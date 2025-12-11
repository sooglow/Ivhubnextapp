import { NextRequest, NextResponse } from "next/server";
import { SolutionProcedures } from "@/public/procedures/solutionInfo";
import { SolutionInfoUpdateRequest } from "@/app/info/solutionInfo/types/Edit";

// 솔루션 공지사항 상세 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ num: string }> }) {
  try {
    const resolvedParams = await params;
    const num = resolvedParams.num;

    if (!num) {
      return NextResponse.json(
        {
          result: false,
          data: null,
          errMsg: "Num 파라미터가 필요합니다.",
          errCode: "MISSING_PARAMETER",
        },
        { status: 400 }
      );
    }

    const result = await SolutionProcedures.getSolutionInfoDetail(num);

    if (result.success && result.data && result.data.length > 0) {
      return NextResponse.json({
        result: true,
        data: result.data[0],
        errMsg: null,
        errCode: null,
      });
    } else {
      return NextResponse.json(
        {
          result: false,
          data: null,
          errMsg: result.error || "데이터를 찾을 수 없습니다.",
          errCode: "NOT_FOUND",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("SolutionInfo Detail API Error:", error);
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

// PUT - 솔루션 정보 수정
export async function PUT(request: NextRequest) {
  try {
    const solutionInfoListData: SolutionInfoUpdateRequest = await request.json();

    const result = await SolutionProcedures.updateSolutionInfo(solutionInfoListData);

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
          errMsg: result.error || "수정에 실패했습니다.",
          errCode: "UPDATE_FAILED",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("SolutionInfo Update API Error:", error);
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

// DELETE - 솔루션 정보 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ num: string }> }
) {
  try {
    const resolvedParams = await params;
    const num = resolvedParams.num;

    if (!num) {
      return NextResponse.json(
        {
          result: false,
          errMsg: "Num 파라미터가 필요합니다.",
          errCode: "MISSING_PARAMETER",
        },
        { status: 400 }
      );
    }

    const result = await SolutionProcedures.deleteSolutionInfo(num);

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
          errMsg: result.error || "삭제에 실패했습니다.",
          errCode: "DELETE_FAILED",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("SolutionInfo Delete API Error:", error);
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
