import ContentLoader from "react-content-loader";

const ListItemLoader = () => {
    return (
        <ContentLoader
            speed={2}
            width="100%"
            height={400}
            viewBox="0 0 1200 400"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            {/* 10개 행 렌더링 */}
            {[...Array(10)].map((_, index) => (
                <g key={index}>
                    <rect
                        x="20"
                        y={20 + index * 40}
                        rx="3"
                        ry="3"
                        width="150"
                        height="15"
                    />
                    <rect
                        x="200"
                        y={20 + index * 40}
                        rx="3"
                        ry="3"
                        width="150"
                        height="15"
                    />
                    <rect
                        x="380"
                        y={20 + index * 40}
                        rx="3"
                        ry="3"
                        width="150"
                        height="15"
                    />
                    <rect
                        x="560"
                        y={20 + index * 40}
                        rx="3"
                        ry="3"
                        width="150"
                        height="15"
                    />
                    <rect
                        x="740"
                        y={20 + index * 40}
                        rx="3"
                        ry="3"
                        width="100"
                        height="15"
                    />
                    <rect
                        x="870"
                        y={20 + index * 40}
                        rx="3"
                        ry="3"
                        width="100"
                        height="15"
                    />
                    <rect
                        x="1000"
                        y={20 + index * 40}
                        rx="3"
                        ry="3"
                        width="100"
                        height="15"
                    />
                    <rect
                        x="1120"
                        y={20 + index * 40}
                        rx="3"
                        ry="3"
                        width="60"
                        height="15"
                    />
                </g>
            ))}
        </ContentLoader>
    );
};

export default ListItemLoader;
