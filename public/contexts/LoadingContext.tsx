// public/contexts/LoadingContext.tsx
"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface LoadingState {
    isLoading: boolean;
}

interface LoadingAction {
    type: "SET_LOADING";
    payload: boolean;
}

interface LoadingContextType {
    state: LoadingState;
    dispatch: React.Dispatch<LoadingAction>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

const loadingReducer = (state: LoadingState, action: LoadingAction): LoadingState => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};

interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [state, dispatch] = useReducer(loadingReducer, { isLoading: false });

    return (
        <LoadingContext.Provider value={{ state, dispatch }}>
            {children}
            <div className={`loading-container ${state.isLoading ? "fadeIn" : "fadeOut"}`}>
                <div className="loader"></div>
            </div>
        </LoadingContext.Provider>
    );
};
