"use client";

import ContentLoader from "react-content-loader";

export default function DashBoardAnalyticsLoader() {
    return (
        <ContentLoader
            speed={2}
            width="100%"
            height={250}
            viewBox="0 0 1148 800"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            {[100].map((y, idx) => {
                return (
                    <rect key={idx} x="8" y={y} rx="4" ry="4" width="1148" height="600" />
                );
            })}
        </ContentLoader>
    );
}
