// src/components/ui/table.tsx
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { useState } from 'react';
import type { Defect } from '@/types/defect';

interface DefectsTableProps {
  data: Defect[];
  onEdit: (defect: Defect) => void;
}

export const DefectsTable = ({ data, onEdit }: DefectsTableProps) => {
  const [sorting, setSorting] = useState([]);

  const columns: ColumnDef<Defect>[] = [
    {
      accessorKey: 'S.No',
      header: 'S.No',
    },
    {
      accessorKey: 'Vessel Name',
      header: 'Vessel Name',
    },
    {
      accessorKey: 'Equipments',
      header: 'Equipments',
    },
    {
      accessorKey: 'Description',
      header: 'Description',
    },
    {
      accessorKey: 'Criticality',
      header: 'Criticality',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
          row.original.Criticality === 'High' 
            ? 'bg-red-500/10 text-red-500'
            : row.original.Criticality === 'Medium'
            ? 'bg-yellow-500/10 text-yellow-500'
            : 'bg-green-500/10 text-green-500'
        }`}>
          {row.original.Criticality}
        </span>
      ),
    },
    {
      accessorKey: 'Status (Vessel)',
      header: 'Status',
      cell: ({ row }) => (
        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 text-xs font-medium">
          {row.original['Status (Vessel)']}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <button
          onClick={() => onEdit(row.original)}
          className="px-3 py-1 rounded-md bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border border-gray-700 bg-gray-900/50">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-300 bg-gray-800/50"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 text-sm text-gray-300"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
