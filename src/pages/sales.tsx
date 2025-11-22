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
    { productId: null, quantity: 1, value: 0 }
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

  useEffect(() => {
    const total = formData.saleDetails.reduce(
      (acc, item) => acc + (Number(item.quantity) * Number(item.value || 0)),
      0
    );
    setFormData((prev) => ({ ...prev, total }));
  }, [formData.saleDetails]);

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      saleDetails: [
        ...prev.saleDetails,
        { productId: null, quantity: 1, value: 0 },
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

    if (field === "quantity" || field === "value") {
      const quantity = Number(updated[index].quantity) || 0;
      const unitValue = Number(updated[index].value) || 0;
      updated[index].total = quantity * unitValue;
    }

    const total = updated.reduce(
      (acc: any, item: any) => acc + (Number(item.quantity) * Number(item.value || 0)),
      0
    );

    setFormData((prev) => ({ ...prev, saleDetails: updated, total }));
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
              label="Cliente" 
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
              onChange={(e) => setFormData((prev) => ({ ...prev, date: new Date(e.target.value) })) }
            />
            <Input
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
              <h3 className="text-lg font-semibold">Articulos</h3>
              <Button isIconOnly type="button" color="primary" onClick={handleAddItem}>
                <PlusIcon className="w-5 h-5" />
              </Button>
            </div>
            {formData.saleDetails.map((saleDetail: SaleDetailProps, index: number) => (
              <div key={`sale-detail-${index}`} className="rounded-xl mb-4 flex flex-wrap gap-4 items-end">
                <Select 
                  className="min-w-[150px] flex-1" 
                  label="Artículo" 
                  placeholder="Selecciona un artículo"
                  onSelectionChange={(val) => {
                    const selectedId = Number(Array.from(val)[0]);
                    const selectedProduct = products.find(p => p.id === selectedId);
                    setFormData({
                      ...formData,
                      saleDetails: formData.saleDetails.map((item, i) =>
                        i === index ? { ...item, productId: selectedId, value: selectedProduct ? selectedProduct.price : item.value } : item
                      )
                    });
                  }}
                >
                  {products.map((product) => (
                    <SelectItem key={product.id} >{product.name}</SelectItem>
                  ))}
                </Select>
                <Input
                  label="Cantidad"
                  placeholder="Ej: 10"
                  type="number"
                  value={saleDetail.quantity?.toString() ?? ""}
                  onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                  className="max-w-[200px] flex-1"
                />
                <Input
                  label="Valor Unitario"
                  placeholder="Ej: 10"
                  type="number"
                  value={saleDetail.value?.toString() ?? ""}
                  onChange={(e) => handleItemChange(index, "value", Number(e.target.value))}
                  className="max-w-[300px] flex-1"
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
            <div className="flex justify-end w-full mt-4">
              <Input
                label="Total"
                value={formData.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                readOnly
                className="max-w-[400px]"
              />
            </div>
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
