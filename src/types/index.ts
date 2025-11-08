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

export type ConnectionProps = {
  id: string;
  company: string;
  engine: string;
  server: string;
  user: string;
  password: string;
  dbName: string;
};

export type SaleProps = {
  date: Date;
  customerId: number;
  total: number;
  note: string;
  saleDetails: SaleDetailProps[];
};

export type SaleDetailProps = {
  productId: number;
  quantity: number;
  value: number;
};