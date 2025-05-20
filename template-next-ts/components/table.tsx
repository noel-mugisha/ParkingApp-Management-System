import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Table as TremorTable,
} from '@tremor/react';
import Papa from 'papaparse';
import FormSearch from './Button/FormSearch';
import ExportButton from './Button/ExportButton';

export interface ITableProps<T> {
    columns: {
        key: string,
        label: string
    }[],
    data: T[],
    exportable?: boolean,
    exportData?: T[],
    title?: string,
    paginate?: boolean,
    noHeader?: boolean,
    additionalButton?: React.ReactNode,
}

export interface IRow { [key: string]: string }

export function Table<T>({
    columns,
    data,
    exportData,
    exportable,
    title,
    paginate = false,
    noHeader = false,
    additionalButton,
}: ITableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: string }>({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = paginate ? 12 : data.length;

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const rowValues = columns.map((column) =>
                String((row as IRow)[column.key] ?? '')
            ).join(' ').toLowerCase();

            setCurrentPage(1)
            return rowValues.includes(searchQuery.toLowerCase());
        });
    }, [data, columns, searchQuery]);
    

    const sortedData = useMemo(() => {
        if (sortConfig.key != null && sortConfig.direction != undefined) {
            return [...filteredData].sort((a: any, b: any) => {
                if (a[(sortConfig.key as string)] < b[(sortConfig.key as string)]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[(sortConfig.key as string)] > b[(sortConfig.key as string)]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredData;
    }, [filteredData, sortConfig]);

    const exportToCSV = () => {
        const csv = Papa.unparse(exportData || filteredData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', title + '.csv' || 'table_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSort = (columnKey: string) => {
        let direction = 'ascending';
        if (sortConfig.key === columnKey && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key: columnKey, direction });
    };

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(startIndex, startIndex + rowsPerPage);
    }, [currentPage, rowsPerPage, sortedData]);

    return (
        <div className="w-full overflow-hidden">
            <div className='text-xl font-semibold text-center py-5 text-primary'>{title}</div>
            <div className="flex justify-between items-center mb-4">
                <FormSearch value={searchQuery} handleChange={(e) => setSearchQuery(e.target.value)} />
                <div className="flex items-center space-x-2">
                    {exportable && <ExportButton handleClick={exportToCSV} />}
                    {additionalButton}
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <TremorTable>
                    <TableHead className={`${noHeader ? 'hidden' : 'bg-subprimary text-primary'}`}>
                        <TableRow>
                            <TableHeaderCell className="py-3 px-4">#</TableHeaderCell>
                            {columns.map((column) => (
                                <TableHeaderCell
                                    key={column.key}
                                    className="py-3 px-4 cursor-pointer whitespace-nowrap"
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-black text-sm font-medium">{column.label}</span>
                                        <Icon icon="ic:outline-unfold-more" className="w-4 h-4" />
                                    </div>
                                </TableHeaderCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.map((row, rowIndex) => (
                            <TableRow key={rowIndex} className="hover:bg-gray-50">
                                <TableCell className="py-3 px-4 border-b border-b-subprimary text-gray-500">
                                    {(currentPage - 1) * rowsPerPage + rowIndex + 1}
                                </TableCell>

                                {columns.map((column) => (
                                    <TableCell
                                        key={column.key}
                                        className="py-3 px-4 border-b border-b-subprimary whitespace-nowrap text-start font-normal max-w-[5rem] text-ellipsis overflow-hidden"
                                        title={(row as IRow)[column.key]}
                                    >
                                        <span className="text-sm text-gray-500">{(row as IRow)[column.key]}</span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </TremorTable>
            </div>

            {paginate && filteredData.length > 0 && (
                <div className="flex items-center justify-center gap-4 mt-4 py-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        <Icon icon="heroicons:arrow-left" className="w-5 h-5" />
                    </button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        <Icon icon="heroicons:arrow-right" className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}