import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";
import { clsx } from "clsx"
import { Skeleton } from "@/components/ui/skeleton";
import styles from './DataTable.module.css';

export function DataTable({
    data,
    columns,
    height = 'full',
    isLoading = false,
    onRowSelect = null,
    onRowUpdate = null,
    onAction = null,
    selectedKeyValue = null,
    getRowActions = null
}) {
    const table = useReactTable({
        data,
        columns: columns(onAction, getRowActions),
        getCoreRowModel: getCoreRowModel(),
    })

    // 각 행의 전체 데이터를 관리
    const [editData, setEditData] = useState({});

    // 데이터 변경시 초기화 작업
    useEffect(() => {
        setSelectedRowId(null);
        setEditData(data.reduce((acc, item, index) => ({ ...acc, [index]: { ...item } }), {}));
    }, [data]);

    // 데이터가 업데이트될 때마다 selectedRowId 상태를 설정
    useEffect(() => {
        if (selectedKeyValue) {
            const selectedIndex = data.findIndex((row) =>
                Object.entries(selectedKeyValue).every(([key, value]) => row[key] === value)
            );

            if (selectedIndex !== -1) {
                setSelectedRowId(selectedIndex);
            } else {
                setSelectedRowId(null);
            }
        }
    }, [selectedKeyValue, data]);

    const handleInputChange = (index, columnId, value) => {
        const updatedRow = { ...editData[index], [columnId]: value };
        setEditData({ ...editData, [index]: updatedRow });
    };

    const handleInputBlur = (index) => {
        if (onRowUpdate && editData[index]) {
            onRowUpdate(editData[index]);
        }
    };

    const tableBodyClass = clsx(
        'overflow-y-auto',
        {
            'h-full': height === 'full',
            [`${height}`]: height !== 'full',
        }
    );

    const [selectedRowId, setSelectedRowId] = useState(null);

    const handleRowClick = (row) => {
        setSelectedRowId(row.id);
        if (onRowSelect) {
            onRowSelect(row.original);
        }
    };

    const renderTableBodyContent = () => {
        if (isLoading) {
            return (
                <>
                    {Array.from({ length: 3 }).map((_, rowIndex) => (
                        <TableRow key={rowIndex} className={styles.fadeEnter}>
                            {Array.from({ length: columns?.length }).map((_, colIndex) => (
                                <TableCell key={colIndex}>
                                    <Skeleton className="h-4 w-full rounded" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </>
            );
        } else if (table.getRowModel().rows?.length === 0) {
            return (
                <TableRow className={styles.fadeEnter}>
                    <TableCell colSpan={columns?.length} className="h-8">
                        결과가 없습니다.
                    </TableCell>
                </TableRow >
            );
        } else {
            return table.getRowModel().rows.map((row, rowIndex) => {
                return (
                    <TableRow
                        key={row.id}
                        className={clsx(
                            "cursor-pointer",
                            styles.fadeEnter,
                            { 'bg-muted': row.id === String(selectedRowId) }
                        )}
                        onClick={() => handleRowClick(row)}
                    >
                        {row.getVisibleCells().map((cell) => {
                            const isEditable = cell.column.columnDef.mod;

                            return (
                                <TableCell key={cell.id}>
                                    {isEditable ?
                                        (
                                            <Input
                                                type="text"
                                                value={(editData[rowIndex] && editData[rowIndex][cell.column.id]) || ""}
                                                onChange={e => handleInputChange(rowIndex, cell.column.id, e.target.value)}
                                                onBlur={() => handleInputBlur(rowIndex)}
                                            />
                                        )
                                        : (
                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                        )
                                    }
                                </TableCell>
                            )
                        })}
                    </TableRow>
                )
            });
        }
    };

    return (
        <div className={`rounded-md border w-full ${tableBodyClass}`}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="whitespace-nowrap">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {renderTableBodyContent()}
                </TableBody>
            </Table>
        </div>
    )
}