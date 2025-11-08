import { useEffect, useState, useCallback, useMemo } from "react";
import DefaultLayout from "@/layouts/default";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  User,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  SearchIcon,
  EditIcon,
  TrashIcon,
} from "@/components/icons";
import axiosClient from "../../axios";
import { CustomerProps } from "@/types";

export const columns = [
  { name: "Fecha", uid: "date", sortable: true },
  { name: "Cliente", uid: "customer" },
  { name: "Total", uid: "total" },
  { name: "Acciones", uid: "actions" },
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const visibleColumns = ["date", "customer", "total", "actions"];

export default function AgentsPage() {
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<any>({
    column: "order",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const hasSearchFilter = Boolean(filterValue);
  
  const fetchSales = async () => {
    try {
      const response = await axiosClient.get("/sales");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredSales = [...data];

    if (hasSearchFilter) {
      filteredSales = filteredSales.filter((sale) =>
        sale.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredSales;
  }, [data, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);


  const renderCell = useCallback((row: any, columnKey: any) => {
    const cellValue = row[columnKey];

    switch (columnKey) {
      case "date":
        return new Date(cellValue).toLocaleDateString();
      case "customer":
        return (
          <User
            avatarProps={{ radius: "lg", src: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" }}
            description={row.customer}
            name={row.customer}
            className="max-w-[200px]"
          >
            {row.customer}
          </User>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={row.status ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {row.status ? "Activo" : "Inactivo"}
          </Chip>
        );
      case "total":
        return `$${cellValue.toFixed(2)}`;
      case "actions":
        return (
            <div className="flex items-center justify-end space-x-1">
            <Button
              isIconOnly
              variant="light"
              size="md"
              color="primary"
              // onPress={() => openEditFormModal(row)}
            >
              <EditIcon />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="md"
              color="danger"
              onPress={() => console.log("Delete", row.id)}
            >
              <TrashIcon />
            </Button>
            </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.length} ventas
          </span>
          <div className="flex gap-2 items-center">
            <span className="text-default-400 text-small">
              Registros por página
            </span>
            <Select
              className="w-[70px]"
              aria-label="rows per page"
              defaultSelectedKeys={["5"]}
              onChange={onRowsPerPageChange}
            >
              <SelectItem key="5">5</SelectItem>
              <SelectItem key="10">10</SelectItem>
              <SelectItem key="20">20</SelectItem>
            </Select>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    data.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [items.length, page, pages, hasSearchFilter]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="title-container">
          <h1 className="title-text">REPORTE DE VENTAS</h1>
        </div>
        <Table
          isHeaderSticky
          aria-label="Reports table"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{wrapper: "max-h-[382px]"}}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No se encontraron registros."} items={sortedItems}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </DefaultLayout>
  );
}
