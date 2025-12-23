import React from "react";
import ContentLoader from "react-content-loader";

interface ListItemLoaderProps {
    [key: string]: any;
}

function ListItemLoader(props: ListItemLoaderProps): React.ReactElement {
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
                            <rect x="8" y={y} rx="4" ry="4" width="100" height="38" />
                            <rect x="128" y={y} rx="4" ry="4" width="670" height="38" />
                            <rect x="818" y={y} rx="4" ry="4" width="90" height="38" />
                            <rect x="928" y={y} rx="4" ry="4" width="200" height="38" />
                        </React.Fragment>
                    );
                })}
            </ContentLoader>
        </>
    );
}

export default ListItemLoader;
