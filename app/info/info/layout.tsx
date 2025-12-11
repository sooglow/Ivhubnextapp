// app/info/layout.tsx
"use client";

import { LoadingProvider } from "@/public/contexts/LoadingContext";
import QueryProvider from "@/public/providers/QueryProvider";

export default function InfoLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <LoadingProvider>{children}</LoadingProvider>
        </QueryProvider>
    );
}
