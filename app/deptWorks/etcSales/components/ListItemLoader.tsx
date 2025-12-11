export default function ListItemLoader() {
    return (
        <div className="animate-pulse">
            {[...Array(10)].map((_, index) => (
                <div key={index} className="flex gap-2 p-4 border-b border-gray-200">
                    <div className="h-10 bg-gray-200 rounded w-[15%]"></div>
                    <div className="h-10 bg-gray-200 rounded w-[15%]"></div>
                    <div className="h-10 bg-gray-200 rounded w-[20%]"></div>
                    <div className="h-10 bg-gray-200 rounded w-[10%]"></div>
                    <div className="h-10 bg-gray-200 rounded w-[10%]"></div>
                    <div className="h-10 bg-gray-200 rounded w-[10%]"></div>
                    <div className="h-10 bg-gray-200 rounded w-[10%]"></div>
                    <div className="h-10 bg-gray-200 rounded w-[10%]"></div>
                </div>
            ))}
        </div>
    );
}
