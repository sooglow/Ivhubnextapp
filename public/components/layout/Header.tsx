//public/components/layout/Header.tsx
import React from "react";
import { useEffect, useState } from "react";
import { useAxios } from "@/public/hooks/useAxios";
import Nav from "@/public/components/layout/Nav";

const Header = (): React.ReactElement => {
    const [menuItems, setMenuItems] = useState<HeaderMenuItem[]>([]);

    const requestMenuConfig = {
        url: process.env.NEXT_PUBLIC_API_URL + "/Code/Menu",
        requiresAuth: true,
    };

    const { res, error, refetch: reqMenu } = useAxios(requestMenuConfig);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedMenu = localStorage.getItem("menu");
            if (storedMenu) {
                setMenuItems(JSON.parse(storedMenu));
            }
        }
    }, []);

    useEffect(() => {
        if (error) {
            alert("Network error: " + error.message);
        }

        if (res) {
            const _res = res.data;
            if (!_res.result) {
                return;
            }

            if (typeof window !== "undefined") {
                localStorage.setItem("menu", JSON.stringify(_res.data.items));
                setMenuItems(_res.data.items);
            }
        }
    }, [res, error]);

    useEffect(() => {
        if (typeof window !== "undefined" && !localStorage.getItem("menu")) {
            reqMenu();
        }
    }, []);

    return (
        <header className="md:w-full h-12 bg-[#282729] md:text-white pt-2 sticky top-0 z-10 md:relative md:top-auto md:z-auto">
            <div className="max-w-6xl mx-auto px-4 flex justify-between ">
                <Nav menuItems={menuItems} />
            </div>
        </header>
    );
};

export default Header;
