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
  Switch,
  SelectItem,
  Modal,
  ModalContent, 
  ModalHeader, 
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
} from "@/components/icons";
import axiosClient from "../../axios";
import { CustomerProps } from "@/types";

const initialFormData = {
  id: 0,
  identification: "",
  name: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  isActive: true,
};

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Identificación", uid: "identification" },
  { name: "Nombre", uid: "name" },
  { name: "Teléfono", uid: "phone", },
  { name: "Email", uid: "email", },
  { name: "Dirección", uid: "address", },
  { name: "Estado", uid: "isActive" },
  { name: "Acciones", uid: "actions" },
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const visibleColumns = ["identification", "name", "phone", "email", "address", "isActive", "actions"];

export default function CustomersPage() {
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<any>({
    column: "order",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<CustomerProps[]>([]);
  const [formData, setFormData] = useState<CustomerProps>(initialFormData);
  const isEditing = formData.id !== 0;
  const hasSearchFilter = Boolean(filterValue);

  const fetchCustomers = async () => {
    try {
      const response = await axiosClient.get("/customers");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredCustomers = [...data];

    if (hasSearchFilter) {
      filteredCustomers = filteredCustomers.filter((customer) =>
        customer.identification.toLowerCase().includes(filterValue.toLowerCase()) ||
        customer.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredCustomers;
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

  const openNewFormModal = () => {
    setFormData(initialFormData);
    setIsModalOpen(true);
  };
  
  const openEditFormModal = (rowData: CustomerProps) => {
    setFormData(rowData);
    setIsModalOpen(true);
  };

  const onSubmit = async () => {
    setIsLoading(true);

    try {      
      isEditing
        ? await axiosClient.put(`/customers/${formData.id}`, formData)
        : await axiosClient.post("/customers", formData);

      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCell = useCallback((row: any, columnKey: any) => {
    const cellValue = row[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" }}
            description={row.lastName}
            name={cellValue}
          >
            {row.name}
          </User>
        );
      case "isActive":
        return (
          <Chip
            className="capitalize"
            color={row.isActive ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {row.isActive ? "Activo" : "Inactivo"}
          </Chip>
        );
      case "actions":
        return (
            <div className="flex items-center justify-end space-x-1">
            <Button
              isIconOnly
              variant="light"
              size="md"
              color="primary"
              onPress={() => openEditFormModal(row)}
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
          <div className="flex gap-3">
            <Button color="primary" endContent={<PlusIcon />} onPress={openNewFormModal}>
              Nuevo
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.length} clientes
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
          <h1 className="title-text">CLIENTES</h1>
        </div>
        <Table
          isHeaderSticky
          aria-label="Customers table"
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
        <Modal isOpen={isModalOpen} size="5xl" onOpenChange={setIsModalOpen}>
          <ModalContent>
            <ModalHeader>{isEditing ? "Editar Cliente" : "Nuevo Cliente"}</ModalHeader>
            <ModalBody className="h-[50vh] overflow-y-auto px-1">
              <div className="flex flex-col space-y-4">
                <div className="flex gap-4">
                  <div className="w-[50%]">
                    <Input
                      label="identificación"
                      value={formData.identification}
                      onValueChange={(val) => setFormData({ ...formData, identification: val })}
                    />
                  </div>
                  <div className="w-[50%]">
                    <Input
                      label="Nombre"
                      value={formData.name}
                      onValueChange={(val) => setFormData({ ...formData, name: val })}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-[50%]">
                    <Input
                      label="Apellido"
                      value={formData.lastName}
                      onValueChange={(val) => setFormData({ ...formData, lastName: val })}
                    />
                  </div>
                  <div className="w-[50%]">
                    <Input
                      label="Telefono"
                      value={formData.phone}
                      onValueChange={(val) => setFormData({ ...formData, phone: val })}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-[50%]">
                    <Input
                      label="Email"
                      value={formData.email}
                      onValueChange={(val) => setFormData({ ...formData, email: val })}
                    />
                  </div>
                  <div className="w-[50%]">
                    <Input
                      label="Dirección"
                      value={formData.address}
                      onValueChange={(val) => setFormData({ ...formData, address: val })}
                    />
                  </div>
                </div>
                <Switch
                  isSelected={formData.isActive}
                  onValueChange={(val) => setFormData({ ...formData, isActive: val })}
                >
                  {formData.isActive ? "Activo" : "Inactivo"}
                </Switch>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button color="primary" onPress={onSubmit} isDisabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span>Procesando...</span>
                  </div>
                ) : (
                  isEditing ? "Actualizar" : "Crear"
                )}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </section>
    </DefaultLayout>
  );
}
