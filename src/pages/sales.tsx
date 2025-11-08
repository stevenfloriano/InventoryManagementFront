import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import { 
  addToast,
  ButtonGroup,
  Button,
  Input,
  Form,
  Select, 
  SelectItem,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@heroui/react";
import { PlusIcon, TrashIcon } from "@/components/icons";
import axiosClient from "../../axios";
import { CustomerProps, ProductProps, SaleProps, SaleDetailProps } from "@/types";

const initialSaleData = {
  date: new Date(),
  customerId: null,
  total: 0,
  note: "",
  saleDetails: [
    { productId: null, quantity: 1, value: 0}
  ]
}

export default function SalesPage() {
  const [customers, setCustomers] = useState<CustomerProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [formData, setFormData] = useState<SaleProps>(initialSaleData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIndexToDelete, setSelectedIndexToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          axiosClient.get("/customers"),
          axiosClient.get("/products"),
        ]);

        setCustomers(customersResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      saleDetails: [
        { productId: 0, quantity: 1, value: 0 },
        ...prev.saleDetails,
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...formData.saleDetails];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, saleDetails: updated }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated: any = [...formData.saleDetails];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, saleDetails: updated }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axiosClient.post("/sales", formData);
      addToast({
        title: "Venta guardada exitosamente",
        color: "success",
      })
      setFormData(initialSaleData);
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="title-container">
          <h1 className="title-text">NUEVA VENTA</h1>
        </div>
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Eliminar artículo</ModalHeader>
            <ModalBody> ¿Está seguro que desea eliminar este artículo? </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                color="danger"
                onClick={() => {
                  if (selectedIndexToDelete !== null) {
                    handleRemoveItem(selectedIndexToDelete);
                  }
                  setIsDeleteModalOpen(false);
                }}
              >
                Eliminar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Form className="w-full max-w-7xl" onSubmit={onSubmit}>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Select 
              className="min-w-[300px] flex-1" 
              label="cliente" 
              placeholder="Selecciona un cliente"
              onSelectionChange={(val) => setFormData({ ...formData, customerId: Number(Array.from(val)[0]) })}
            >
              {customers.map((customer) => (
                <SelectItem key={customer.id} >{customer.name}</SelectItem>
              ))}
            </Select> 
            <Input
              isRequired
              labelPlacement="inside"
              label="Fecha"
              name="date"
              placeholder="Ingresa la fecha"
              type="date"
              errorMessage="Ingresa la fecha"
              value={new Date(formData.date).toISOString().split('T')[0]}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            />
            <Input
              isRequired
              labelPlacement="inside"
              label="Observaciones"
              name="note"
              placeholder="Ingresa una nota"
              type="text"
              errorMessage="Ingresa una nota"
              value={formData.note}
              onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
            />
          </div>
          
          <div style={{width: '100%'}}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Conexiones BD</h3>
              <Button isIconOnly type="button" color="primary" onClick={handleAddItem}>
                <PlusIcon className="w-5 h-5" />
              </Button>
            </div>
            {formData.saleDetails.map((saleDetail: SaleDetailProps, index: number) => (
              <div className="rounded-xl mb-4 flex flex-wrap gap-4 items-end">
                <Select 
                  className="min-w-[150px] flex-1" 
                  label="Artículo" 
                  placeholder="Selecciona un artículo"
                  onSelectionChange={(val) => setFormData({ ...formData, saleDetails: formData.saleDetails.map((item, i) => i === index ? { ...item, productId: Number(Array.from(val)[0]) } : item) })}
                >
                  {products.map((product) => (
                    <SelectItem key={product.id} >{product.name}</SelectItem>
                  ))}
                </Select>
                <Input
                  label="Cantidad"
                  placeholder="Ej: 10"
                  value={saleDetail.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  className="min-w-[150px] flex-1"
                />
                <Input
                  label="Valor"
                  placeholder="Ej: 10"
                  value={saleDetail.value}
                  onChange={(e) => handleItemChange(index, "value", e.target.value)}
                  className="min-w-[150px] flex-1"
                />
                <ButtonGroup>
                  { saleDetail.productId && (
                  <Button
                    isIconOnly
                    color="danger"
                    variant="solid"
                    onClick={() => {
                      setSelectedIndexToDelete(index);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                  )}
                </ButtonGroup>
              </div>
            ))}

          </div >
          
          <div className="w-full">
            <Button className="w-full" color="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </section>
    </DefaultLayout>
  );
}
