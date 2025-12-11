export default function MobileListItemLoader() {
    return (
        <div className="animate-pulse space-y-4 p-4">
            {[...Array(2)].map((_, index) => (
                <div key={index} className="h-[400px] bg-gray-200 rounded w-full"></div>
            ))}
        </div>
    );
}
