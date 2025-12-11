// /shared/contexts/Context.tsx
"use client";

import { InfoViewItem } from "@/app/info/info/types/View";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface ContextType {
    currentInfoSerial: number | null;
    setCurrentInfoSerial: (serial: number) => void;
    currentInfoData: InfoViewItem | null;
    setCurrentInfoData: (data: InfoViewItem | null) => void;
}

const defaultContextValue: ContextType = {
    currentInfoSerial: null,
    setCurrentInfoSerial: () => {},
    currentInfoData: null,
    setCurrentInfoData: () => {},
};

const AppContext = createContext<ContextType>(defaultContextValue);

interface ContextProviderProps {
    children: ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [currentInfoSerial, setCurrentInfoSerial] = useState<number | null>(null);
    const [currentInfoData, setCurrentInfoData] = useState<InfoViewItem | null>(null);

    return (
        <AppContext.Provider
            value={{
                currentInfoSerial,
                setCurrentInfoSerial,
                currentInfoData,
                setCurrentInfoData,
                // 필요한 다른 상태들도 여기에 추가
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// Context를 사용하기 위한 Custom Hook
export const useAppContext = () => useContext(AppContext);
