//public/components/layout/Nav.tsx
import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseJWT } from "@/public/utils/utils";
import styles from "@/public/components/layout/Nav.module.css";

interface SubMenuItem {
    subName: string;
    url: string;
    externaLink?: boolean;
}

interface MenuItem {
    menuName: string;
    url?: string;
    externaLink?: boolean;
    subItems?: SubMenuItem[];
}

interface NavProps {
    menuItems: MenuItem[];
}

const Nav = ({ menuItems }: NavProps): React.ReactElement => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [openSubMenus, setOpenSubMenus] = useState<Record<number, boolean>>({});
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const delay = 500;
    let mouseLeaveTimer: NodeJS.Timeout;

    const toggleSubMenu = (index: number) => {
        setOpenSubMenus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleMouseEnter = (index: number) => {
        if (mouseLeaveTimer) {
            clearTimeout(mouseLeaveTimer);
        }
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        mouseLeaveTimer = setTimeout(() => {
            setActiveIndex(null);
        }, delay);
    };

    const handleMenuClick = (item: MenuItem) => {
        if (item.externaLink) {
            if (item.menuName === "SMS발송" && item.url) {
                const token =
                    typeof window !== "undefined"
                        ? JSON.parse(localStorage.getItem("atKey") || "{}")?.token
                        : null;

                if (token) {
                    const payload = parseJWT(token);
                    window.open(
                        item.url +
                            `?userid=${payload?.userId}&userpower=${payload?.userPower}&areacode=${payload?.areaCode}&deptcode=${payload?.deptCode}`
                    );
                }
            } else if (item.url) {
                window.open(item.url, "_blank");
            }
        } else if (item.url) {
            router.push(item.url);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Desktop menu
    const renderMenuItems = (items: MenuItem[]) => {
        return items.map((item, index) => (
            <li key={index} className="relative inline-block text-left">
                <div
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                >
                    <div
                        onClick={() => handleMenuClick(item)}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                    >
                        {item.menuName}
                    </div>
                    {item.subItems && item.subItems.length > 0 && activeIndex === index && (
                        <div
                            className={`absolute z-10 mt-2 w-56 origin-top-right bg-[#282729] divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${styles.submenuEnterActive}`}
                            onMouseEnter={() => handleMouseEnter(index)}
                        >
                            <div className="p-1">
                                {item.subItems.map((subItem, subIndex) =>
                                    subItem.externaLink ? (
                                        <a
                                            key={subIndex}
                                            href={subItem.url}
                                            className="text-gray-300 hover:bg-white hover:text-black group flex items-center px-4 py-2 text-sm rounded-md"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {subItem.subName}
                                        </a>
                                    ) : (
                                        <Link
                                            key={subIndex}
                                            href={subItem.url}
                                            className="text-gray-300 hover:bg-white hover:text-black group flex items-center px-4 py-2 text-sm rounded-md"
                                        >
                                            {subItem.subName}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </li>
        ));
    };

    // Mobile menu
    const renderMobileMenuItems = (items: MenuItem[]) => {
        return items.map((item, index) => (
            <div key={index}>
                <button
                    onClick={() => (item.url ? handleMenuClick(item) : toggleSubMenu(index))}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                    {item.menuName}
                </button>
                <div
                    className={`transition-height duration-300 ease-in-out overflow-hidden ${
                        openSubMenus[index] ? "max-h-96" : "max-h-0"
                    }`}
                >
                    {item.subItems &&
                        item.subItems.map((subItem, subIndex) =>
                            subItem.externaLink ? (
                                <a
                                    key={subIndex}
                                    href={subItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:bg-slate-700 hover:text-white block px-5 py-2 rounded-md text-sm"
                                >
                                    {subItem.subName}
                                </a>
                            ) : (
                                <Link
                                    key={subIndex}
                                    href={subItem.url}
                                    className="text-gray-300 hover:bg-slate-700 hover:text-white block px-5 py-2 rounded-md text-sm"
                                >
                                    {subItem.subName}
                                </Link>
                            )
                        )}
                </div>
            </div>
        ));
    };

    return (
        <nav className="w-full">
            <div className="w-full flex items-center h-8">
                <div className="w-full flex justify-between items-center">
                    <Link href="/" className="md:hidden">
                        <img src={"/images/logo_ivoh.png"} alt="IV Office Hub" />
                    </Link>
                    <div className="flex md:hidden">
                        <Link href="/accountInfo" className="">
                            <img src={"/images/icon_human.png"} alt="userInfo" />
                        </Link>
                        <a
                            onClick={() => {
                                if (typeof window !== "undefined") {
                                    localStorage.removeItem("atKey");
                                    localStorage.removeItem("menu");
                                    router.push("/login");
                                }
                            }}
                            className="cursor-pointer"
                        >
                            <img src={"/images/icon_logout.png"} alt="logout" />
                        </a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-[100px] flex justify-between items-baseline space-x-12">
                            <ul className="flex space-x-12">{renderMenuItems(menuItems)}</ul>
                        </div>
                    </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="bg-[#282729] inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {!isOpen ? (
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    className="md:hidden bg-[#282729] rounded-md mt-2"
                    id="mobile-menu"
                    ref={menuRef}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {renderMobileMenuItems(menuItems)}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Nav;
