// 업체 기본 정보
export interface CompanyInfo {
    comCode: string;
    comName: string;
    idno: string;
    boss: string;
    hp: string;
    tel: string;
    address: string;
    vipComMemo: string;
    blackComMemo: string;
    hpSlot01: string;
    hp01: string;
    hpSlot02: string;
    hp02: string;
    hpSlot03: string;
    hp03: string;
    hpSlot04: string;
    hp04: string;
    areaCode: string;
    areaName: string;
    registMan: string;
    homeCode: string;
    homeName: string;
    fax: string;
    lat?: number;
    lon?: number;
}

// BasicInfo 컴포넌트용 Shop 인터페이스
export interface Shop {
    comCode: string;
    comName: string;
    area: string;
    boss: string;
    idno: string;
    tel: string;
    hp: string;
    fax: string;
    email: string;
    areaName: string;
    useYn: string;
    regDate: string;
    address: string;
    memo?: string;
    registMan?: string;
    homeName?: string;
    vipComMemo?: string;
    blackComMemo?: string;
    hp01?: string;
    hp02?: string;
    hp03?: string;
    hp04?: string;
    lat?: string;
    lon?: string;
}

// 영업문의 이력
export interface SalesItem {
    salesSerial: string;
    comName: string;
    comCode: string;
    comMan: string;
    comTel: string;
    hp: string;
    area: string;
    comAddr: string;
    salesPath: string;
    salesType: string;
    prgName: string;
    callMan: string;
    salesDescr: string;
    salesOutDescr: string;
    salesArea: string;
    salesMan: string;
    salesState: string;
    salesStateName: string;
}

// A/S 이력
export interface AsHistItem {
    callDay: string;
    callMan: string;
    outMan: string;
    prgName: string;
    asKind: string;
    asDescr: string;
    asOutDescr: string;
}

// 프로그램 정보
export interface UsedPrgItem {
    comCode: string;
    prgCode: string;
    prgName: string;
    installDay: string;
    userMax: string;
    areaName: string;
    registMan: string;
    tsUserInfo: string;
    memo: string;
    billPrice: number;
    stateName: string;
}

// 전체 상세 정보
export interface ShopViewDetail {
    comInfo: CompanyInfo | null;
    salesItems: SalesItem[];
    asHistItems: AsHistItem[];
    usedPrgItems: UsedPrgItem[];
}

export interface ShopViewResponse {
    result: boolean;
    data: ShopViewDetail | null;
    errMsg: string | null;
    errCode?: string | null;
}

// ============================================
// 컴포넌트 Props 타입들
// ============================================

// BasicInfo 컴포넌트 Props
export interface BasicInfoProps {
    shop: CompanyInfo | null;
    shortInfo?: string;
    aiBtnClick?: () => void;
    listClick?: () => void;
    jmtBtnClick?: () => void;
    saveBtnClick?: (comCode: string, comName: string) => void;
}

// KakaoMap 컴포넌트 Props
export interface KakaoMapProps {
    lat: number;
    lon: number;
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
    showAreaFilter: boolean;
}

// SearchButtons 컴포넌트 Props
export interface SearchButtonsProps {
    onSearch: () => void;
    onReset: () => void;
    loading: boolean;
}

// ShopAskHist 컴포넌트 Props
export interface ShopAskHistProps {
    salesItems: SalesItem[];
}

// AsHist 컴포넌트 Props
export interface AsHistProps {
    asHistItems: AsHistItem[];
}

// UsePrgInfo 컴포넌트 Props
export interface UsePrgInfoProps {
    usedPrgItems: UsedPrgItem[];
}

// ListItemLoader 컴포넌트 Props
export interface ListItemLoaderProps {
    speed?: number;
}

// MobileListItemLoader 컴포넌트 Props
export interface MobileListItemLoaderProps {
    speed?: number;
}
