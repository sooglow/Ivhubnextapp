import React from "react";

export default function MobileListItemLoader() {
    return (
        <>
            {[...Array(10)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                    <td colSpan={6} className="p-4 border rounded-[5px]">
                        <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}
