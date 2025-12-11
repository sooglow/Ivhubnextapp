// 영업문의 리스트 아이템
export interface SalesItem {
    RowNumber: number;
    salesSerial: string;
    callDay: string;
    area: string;
    comName: string;
    salesMan: string;
    salesType: string;
    salesState: string;
    salesStateName: string;
    comCode: string;
    salesArea: string;
    comMan?: string;
    comTel?: string;
    hp?: string;
    comAddr?: string;
    salesPath?: string;
    prgName?: string;
    callMan?: string;
    salesDescr?: string;
    salesOutDescr?: string;
    TotalCount: number;
}

// 영업문의 리스트 응답
export interface SalesListResponse {
    result: boolean;
    data: {
        items: SalesItem[];
        totalCount: number;
    } | null;
    errMsg: string | null;
    errCode: string | null;
}

// SearchSection 컴포넌트 Props
export interface SearchSectionProps {
    keywordRef: React.RefObject<HTMLInputElement | null>;
    keywordValue: string;
    onKeywordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    onReset: () => void;
    loading: boolean;
    isMobile: boolean;
    prgCode: string;
    onPrgCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    prgItems: Array<{ code: string; codename: string }>;
    areaCode: string;
    onAreaCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    areaItems: Array<{ code: string; codename: string }>;
    salesMan: string;
    onSalesManChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    manItems: Array<{ code: string; codename: string }>;
    state: number;
    onStateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    showAreaFilter: boolean;
}

// SearchButtons 컴포넌트 Props
export interface SearchButtonsProps {
    onSearch: () => void;
    onReset: () => void;
    onExcel: () => void;
    loading: boolean;
}

// ListItemLoader 컴포넌트 Props
export interface ListItemLoaderProps {
    speed?: number;
}

// MobileListItemLoader 컴포넌트 Props
export interface MobileListItemLoaderProps {
    speed?: number;
}
