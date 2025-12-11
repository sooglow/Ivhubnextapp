import React from "react";
import ContentLoader from "react-content-loader";

interface ListItemLoaderProps {
    [key: string]: any; // ContentLoader의 모든 props를 허용
}

function ListItemLoader(props: ListItemLoaderProps): React.ReactElement {
    return (
        <>
            <ContentLoader
                speed={2}
                width="100%"
                height={570}
                viewBox="0 0 1146 570"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                {...props}
            >
                {[10, 66, 122, 178, 234, 290, 346, 407, 467, 519].map((y, idx) => {
                    return (
                        <React.Fragment key={idx}>
                            <rect x="8" y={y} rx="4" ry="4" width="100" height="38" />
                            <rect x="128" y={y} rx="4" ry="4" width="500" height="38" />
                            <rect x="645" y={y} rx="4" ry="4" width="160" height="38" />
                            <rect x="820" y={y} rx="4" ry="4" width="230" height="38" />
                            <rect x="1068" y={y} rx="4" ry="4" width="60" height="38" />
                        </React.Fragment>
                    );
                })}
            </ContentLoader>
        </>
    );
}

export default ListItemLoader;
