import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ProductProps = {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
};

export type CustomerProps = {
  id: number;
  identification: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
};

export type UserProps = {
  id: number;
  identification: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
};

export type SaleProps = {
  date: Date;
  customerId: number | null;
  total: number;
  note: string;
  saleDetails: SaleDetailProps[];
};

export type SaleDetailProps = {
  productId: number | null;
  quantity: number;
  value: number;
};