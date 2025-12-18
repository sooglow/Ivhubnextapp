import ContentLoader from "react-content-loader";

const ExpandListItemLoader = () => {
    return (
        <ContentLoader
            speed={2}
            width="100%"
            height={150}
            viewBox="0 0 1200 150"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            {/* 3개 행 렌더링 (PAGE_SIZE=3) */}
            {[...Array(3)].map((_, index) => (
                <g key={index}>
                    <rect x="20" y={20 + index * 50} rx="3" ry="3" width="120" height="15" />
                    <rect x="160" y={20 + index * 50} rx="3" ry="3" width="100" height="15" />
                    <rect x="280" y={20 + index * 50} rx="3" ry="3" width="140" height="15" />
                    <rect x="440" y={20 + index * 50} rx="3" ry="3" width="140" height="15" />
                    <rect x="600" y={20 + index * 50} rx="3" ry="3" width="100" height="15" />
                    <rect x="720" y={20 + index * 50} rx="3" ry="3" width="80" height="15" />
                    <rect x="820" y={20 + index * 50} rx="3" ry="3" width="100" height="15" />
                    <rect x="940" y={20 + index * 50} rx="3" ry="3" width="100" height="15" />
                    <rect x="1060" y={20 + index * 50} rx="3" ry="3" width="120" height="15" />
                </g>
            ))}
        </ContentLoader>
    );
};

export default ExpandListItemLoader;
