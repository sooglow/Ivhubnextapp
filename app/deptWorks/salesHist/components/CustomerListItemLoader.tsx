import ContentLoader from "react-content-loader";

const CustomerListItemLoader = () => {
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
                    <rect x="440" y={20 + index * 50} rx="3" ry="3" width="160" height="15" />
                    <rect x="620" y={20 + index * 50} rx="3" ry="3" width="120" height="15" />
                    <rect x="760" y={20 + index * 50} rx="3" ry="3" width="100" height="15" />
                    <rect x="880" y={20 + index * 50} rx="3" ry="3" width="100" height="15" />
                    <rect x="1000" y={20 + index * 50} rx="3" ry="3" width="180" height="15" />
                </g>
            ))}
        </ContentLoader>
    );
};

export default CustomerListItemLoader;
