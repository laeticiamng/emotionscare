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

export function UsersTableWithInfiniteScroll() {
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
      id: "728ed52g",
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
      id: "728ed52h",
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
      id: "728ed52i",
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
      id: "728ed52j",
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
  ]);

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
      accessorKey: "created_at",
      header: "Created At",
    },
  ]

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
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
