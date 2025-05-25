export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  unit?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
  company?: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  tax: number;
  discount: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes?: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}