//app/layout.tsx
import React from "react";
import "@/app/globals.css";
import AuthProvider from "@/public/providers/AuthProvider";
import QueryProvider from "@/public/providers/QueryProvider";
import { LoadingProvider } from "@/public/contexts/LoadingContext";
import { ContextProvider } from "@/public/contexts/Context";
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://hangeul.pstatic.net/hangeul_static/css/nanum-square-neo.css"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                    integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </head>
            <body className="antialiased">
                <QueryProvider>
                    <LoadingProvider>
                        <AuthProvider>
                            <ContextProvider>{children}</ContextProvider>
                        </AuthProvider>
                    </LoadingProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
