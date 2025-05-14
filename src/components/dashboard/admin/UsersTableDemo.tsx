import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { UserData } from "@/types/types"

const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
]

export function UsersTableDemo() {
  const [users] = useState<UserData[]>([
    {
      id: "728ed52f",
      name: "John Doe",
      email: "john@example.com",
      role: 'b2b_user',
      status: "pending",
      location: "Paris, FR",
      preferences: {
        privacy: "public",
        notifications_enabled: true
      },
      created_at: "2023-01-10",
      createdAt: "2023-01-10"
    },
    {
      id: "728ed52a",
      name: "Jane Smith",
      email: "jane@example.com",
      role: 'b2b_user',
      status: "active",
      location: "London, UK",
      preferences: {
        privacy: "private",
        notifications_enabled: false
      },
      created_at: "2023-02-15",
      createdAt: "2023-02-15"
    },
    {
      id: "728ed52b",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: 'b2b_user',
      status: "active",
      location: "New York, US",
      preferences: {
        privacy: "team",
        notifications_enabled: true
      },
      created_at: "2023-03-20",
      createdAt: "2023-03-20"
    },
    {
      id: "728ed52c",
      name: "Bob Williams",
      email: "bob@example.com",
      role: 'b2b_user',
      status: "pending",
      location: "Sydney, AU",
      preferences: {
        privacy: "public",
        notifications_enabled: false
      },
      created_at: "2023-04-25",
      createdAt: "2023-04-25"
    },
    {
      id: "728ed52d",
      name: "Emily Brown",
      email: "emily@example.com",
      role: 'b2b_user',
      status: "active",
      location: "Berlin, DE",
      preferences: {
        privacy: "private",
        notifications_enabled: true
      },
      created_at: "2023-05-30",
      createdAt: "2023-05-30"
    },
  ])

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-row={JSON.stringify(row.original)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
