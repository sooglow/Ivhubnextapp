import React from "react";
import ContentLoader from "react-content-loader";

export default function ListItemLoader(props: any) {
    return (
        <>
            <ContentLoader
                speed={2}
                width="100%"
                height={568}
                viewBox="0 0 1146 568"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                {...props}
            >
                {[10, 66, 122, 178, 234, 290, 346, 402, 468, 524].map((y, idx) => {
                    return (
                        <React.Fragment key={idx}>
                            <rect x="8" y={y} rx="4" ry="4" width="110" height="38" />
                            <rect x="130" y={y} rx="4" ry="4" width="155" height="38" />
                            <rect x="300" y={y} rx="4" ry="4" width="100" height="38" />
                            <rect x="415" y={y} rx="4" ry="4" width="445" height="38" />
                            <rect x="875" y={y} rx="4" ry="4" width="160" height="38" />
                            <rect x="1050" y={y} rx="4" ry="4" width="85" height="38" />
                        </React.Fragment>
                    );
                })}
            </ContentLoader>
        </>
    );
}
