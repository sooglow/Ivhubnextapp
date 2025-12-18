import ContentLoader from "react-content-loader";

const MobileListItemLoader = () => {
    return (
        <ContentLoader
            speed={2}
            width="100%"
            height={200}
            viewBox="0 0 400 200"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            {/* 2개 카드 */}
            {[0, 1].map((index) => (
                <g key={index}>
                    <rect
                        x="10"
                        y={10 + index * 100}
                        rx="5"
                        ry="5"
                        width="380"
                        height="85"
                    />
                </g>
            ))}
        </ContentLoader>
    );
};

export default MobileListItemLoader;
