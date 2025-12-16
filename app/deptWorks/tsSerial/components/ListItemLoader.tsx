import React from "react";
import ContentLoader from "react-content-loader";

function ListItemLoader(props: any) {
    return (
        <>
            <ContentLoader
                speed={2}
                width="100%"
                height={626}
                viewBox="0 0 1146 626"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                {...props}
            >
                {[16, 77, 138, 199, 260, 321, 382, 443, 504, 565].map((y, idx) => {
                    return (
                        <React.Fragment key={idx}>
                            <rect x="8" y={y} rx="4" ry="4" width="114" height="38" />
                            <rect x="135" y={y} rx="4" ry="4" width="343" height="38" />
                            <rect x="491" y={y} rx="4" ry="4" width="286" height="38" />
                            <rect x="790" y={y} rx="4" ry="4" width="171" height="38" />
                            <rect x="974" y={y} rx="4" ry="4" width="114" height="38" />
                            <rect x="1101" y={y} rx="4" ry="4" width="114" height="38" />
                        </React.Fragment>
                    );
                })}
            </ContentLoader>
        </>
    );
}

export default ListItemLoader;
