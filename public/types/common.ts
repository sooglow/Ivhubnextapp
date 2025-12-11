/**
 * 헤더 네비게이션 메뉴 아이템 인터페이스
 * @property {string} name - 메뉴 이름
 * @property {object[]} [subMenus] - 서브메뉴 배열 (옵션)
 * @property {string} subMenus.name - 서브메뉴 이름
 * @property {string} subMenus.url - 서브메뉴 링크 URL
 */
interface HeaderMenuItem {
    name: string;
    subMenus?: {
        name: string;
        url: string;
    }[];
}
