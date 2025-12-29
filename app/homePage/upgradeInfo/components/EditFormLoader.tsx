import React from "react";
import ContentLoader from "react-content-loader";

interface EditFormLoaderProps {
    [key: string]: any;
}

function EditFormLoader(props: EditFormLoaderProps): React.ReactElement {
    return (
        <>
            <ContentLoader
                speed={2}
                width="100%"
                height={400}
                viewBox="0 0 1000 400"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                {...props}
            >
                {/* 솔루션 필드 */}
                <rect x="0" y="20" rx="4" ry="4" width="80" height="20" />
                <rect x="120" y="15" rx="4" ry="4" width="150" height="44" />

                {/* 제목 필드 */}
                <rect x="0" y="90" rx="4" ry="4" width="80" height="20" />
                <rect x="120" y="85" rx="4" ry="4" width="850" height="44" />

                {/* 내용 필드 */}
                <rect x="0" y="160" rx="4" ry="4" width="80" height="20" />
                <rect x="120" y="155" rx="4" ry="4" width="850" height="80" />

                {/* 링크 필드 */}
                <rect x="0" y="270" rx="4" ry="4" width="80" height="20" />
                <rect x="120" y="265" rx="4" ry="4" width="850" height="44" />

                {/* 버튼들 */}
                <rect x="380" y="340" rx="4" ry="4" width="110" height="40" />
                <rect x="500" y="340" rx="4" ry="4" width="110" height="40" />
            </ContentLoader>
        </>
    );
}

export default EditFormLoader;
