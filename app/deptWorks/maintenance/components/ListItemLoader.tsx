import React from "react";

export default function ListItemLoader() {
    return (
        <>
            {[...Array(10)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                    <td className="p-4 border-t">
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    <td className="p-4 border-t">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="p-4 border-t">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="p-4 border-t">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                    <td className="p-4 border-t">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="p-4 border-t">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                </tr>
            ))}
        </>
    );
}
