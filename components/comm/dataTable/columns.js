import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// 차대번호 데이터 분석툴_코드_기본차종리스트 Column
export const getBasicCarModelColumns = (onAction) => [
    {
        accessorKey: "code",
        header: "앞4자리",
    },
    {
        accessorKey: "code_text",
        header: "차종"
    },
    {
        accessorKey: "iv_carcode",
        header: "iv차량코드"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <i className="fa-regular fa-ellipsis" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => onAction('delete', row.original)}>삭제</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu >
            )
        }
    }
]

export const getBasicCarModelNotContextColumns = () => [
    {
        accessorKey: "code",
        header: "앞4자리",
    },
    {
        accessorKey: "code_text",
        header: "차종"
    },
    {
        accessorKey: "iv_carcode",
        header: "iv차량코드"
    },
];

// 코드 기본 Column
export const getBasicVinCodeColumns = (onAction = null) => [
    {
        accessorKey: "code",
        header: "코드"
    },
    {
        accessorKey: "code_text",
        header: "코드명"
    },
]

// EPC 코드 기본 Column
export const getBasicEpcCodeColumns01 = (onAction = null) => [
    {
        accessorKey: "opt1",
        header: "코드명"
    }
]

export const getBasicEpcCodeColumns02 = (onAction = null) => [
    {
        accessorKey: "opt2",
        header: "코드명"
    }
]

export const getBasicEpcCodeColumns03 = (onAction = null) => [
    {
        accessorKey: "opt3",
        header: "코드명"
    }
]

export const getBasicEpcCodeColumns04 = (onAction = null) => [
    {
        accessorKey: "opt4",
        header: "코드명"
    }
]

export const getBasicEpcCodeColumns05 = (onAction = null) => [
    {
        accessorKey: "opt5",
        header: "코드명"
    }
]

export const getBasicEpcCodeColumns06 = (onAction = null) => [
    {
        accessorKey: "opt6",
        header: "코드명"
    }
]

export const getBasicEpcCodeColumns07 = (onAction = null) => [
    {
        accessorKey: "opt7",
        header: "코드명"
    }
]

// 차대번호 데이터 분석툴_코드_5~11번째 자리 Column
export const getVin5to11Columns = (onAction) => [
    {
        accessorKey: "code",
        header: "코드"
    },
    {
        accessorKey: "code_text",
        header: "코드명",
        mod: true,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <i className="fa-regular fa-ellipsis" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => onAction('delete', row.original)}>삭제</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

// 입력데이터 조회_차대번호 분석 Column
export const getVinCodeListColumns = (onAction = null) => [
    {
        accessorKey: "vin",
        header: "차대번호 11자리"
    },
    {
        accessorKey: "vin14_text",
        header: "차종구분"
    },
    {
        accessorKey: "vin5_text",
        header: "세부"
    },
    {
        accessorKey: "vin6_text",
        header: "차체"
    },
    {
        accessorKey: "vin7_text",
        header: "장비"
    },
    {
        accessorKey: "vin8_text",
        header: "엔진"
    },
    {
        accessorKey: "vin9_text",
        header: "기타"
    },
    {
        accessorKey: "vin10_text",
        header: "연도"
    },
    {
        accessorKey: "vin11_text",
        header: "공장"
    },
    {
        accessorKey: "update_dt",
        header: "입력일시"
    },
    {
        accessorKey: "update_id",
        header: "입력자"
    },
]

// 입력데이터 조회_EPC 옵션 Column
export const getEpcCodeListColumns = (onAction = null) => [
    {
        accessorKey: "epc_code",
        header: "EPC차량코드"
    },
    {
        accessorKey: "seqno",
        header: "세부코드"
    },
    {
        accessorKey: "opt1",
        header: "옵션1"
    },
    {
        accessorKey: "opt2",
        header: "옵션2"
    },
    {
        accessorKey: "opt3",
        header: "옵션3"
    },
    {
        accessorKey: "opt4",
        header: "옵션4"
    },
    {
        accessorKey: "opt5",
        header: "옵션5"
    },
    {
        accessorKey: "opt6",
        header: "EPC차량명"
    },
    {
        accessorKey: "opt7",
        header: "연식"
    },
    {
        accessorKey: "update_dt",
        header: "입력일시"
    },
    {
        accessorKey: "update_id",
        header: "입력자"
    },
]

// 입력데이터 조회_소모품 정보 Column
export const getExpDataListColumns = (onAction = null) => [
    {
        accessorKey: "epc_code",
        header: "EPC차량코드"
    },
    {
        accessorKey: "seqno",
        header: "세부코드"
    },
    {
        accessorKey: "tire_size",
        header: "타이어규격"
    },
    {
        accessorKey: "battery",
        header: "배터리"
    },
    {
        accessorKey: "aircon_gas1",
        header: "에어컨가스R-134a"
    },
    {
        accessorKey: "aircon_gas2",
        header: "에어컨가스R-1234yf"
    },
    {
        accessorKey: "wiper",
        header: "와이퍼"
    },
    {
        accessorKey: "fuel_tank",
        header: "연료탱크"
    },
    {
        accessorKey: "engine_oil",
        header: "엔진오일"
    },
    {
        accessorKey: "mission_oil",
        header: "미션오일"
    },
    {
        accessorKey: "break_oil",
        header: "브레이크오일"
    },
    {
        accessorKey: "steering_oil",
        header: "파워스티어링오일"
    },
    {
        accessorKey: "cooling_water",
        header: "냉각수"
    },
    {
        accessorKey: "inv_cooling_water",
        header: "인버터냉각수"
    },
    {
        accessorKey: "front_diff",
        header: "프런트디퍼런셜"
    },
    {
        accessorKey: "rear_diff",
        header: "리어디퍼런셜"
    },
    {
        accessorKey: "trans_oil",
        header: "트랜스퍼케이스오일"
    },
    {
        accessorKey: "diesel_water",
        header: "요소수"
    },
    {
        accessorKey: "refrigerant_oil",
        header: "냉매오일량"
    },
    {
        accessorKey: "refrigerant_oil_kind",
        header: "냉매오일종류"
    },
    {
        accessorKey: "update_dt",
        header: "입력일시"
    },
    {
        accessorKey: "update_id",
        header: "입력자"
    },
]

// 신규차대번호_미작업건 Column
export const getNewVinListColumns = (onAction, isCode) => [
    {
        accessorKey: "rownum",
        header: "번호"
    },
    {
        accessorKey: "carname",
        header: "차량명",
    },
    {
        accessorKey: "vin11",
        header: "차대번호11자리",
        cell: ({ cell, row }) => {
            return row.original.fullVin?.length > 0
                ? (
                    <Button variant="link" onClick={async (e) => {
                        try {
                            await navigator.clipboard.writeText(cell.getValue());
                            alert('클립보드에 링크가 복사되었습니다.');
                        } catch (e) {
                            alert('복사에 실패하였습니다');
                        }
                    }}>{cell.getValue()}</Button>
                )
                : <Button Button variant="link" onClick={async (e) => {
                    try {
                        await navigator.clipboard.writeText(cell.getValue());
                        alert('클립보드에 링크가 복사되었습니다.');
                    } catch (e) {
                        alert('복사에 실패하였습니다');
                    }
                }}>{cell.getValue()}</Button>
        }
    },
    {
        accessorKey: "log_dt",
        header: "조회일시",
    },
    {
        accessorKey: "state",
        header: "상태",
        cell: ({ cell }) => cell.getValue() === "2" ? "작업중" : "대기"
    },
    {
        accessorKey: "actions",
        header: "작업",
        cell: ({ row }) => {
            return (
                (isCode(row.original) === 'analyze')
                    ? <Button onClick={() => onAction('analyze', row.original)} className="h-8 text-xs">분석</Button>
                    : <Button onClick={() => onAction('basicCode', row.original)} className="h-8 text-xs">기초코드</Button>
            )
        }
    },
    {
        accessorKey: "exception",
        header: "제외",
        cell: ({ row }) => {
            return (
                <Button onClick={() => onAction('exclude', row.original)} className="h-8 text-xs">작업제외</Button>
            )
        }
    },
]