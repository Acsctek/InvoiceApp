import { nanoid } from 'nanoid';
import { Invoice, InvoiceItem } from '../types';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Calculate invoice totals
export const calculateInvoice = (items: InvoiceItem[], tax = 0, discount = 0): {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
} => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * tax) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  return {
    subtotal,
    taxAmount,
    discountAmount,
    total,
  };
};

// Generate invoice number
export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `INV-${year}${month}-${random}`;
};

// Generate unique ID
export const generateId = (): string => {
  return nanoid();
};

// Get due date (30 days from issue date by default)
export const getDueDate = (issueDate: string, days = 30): string => {
  const date = new Date(issueDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Create empty invoice template
export const createEmptyInvoice = (): Invoice => {
  const today = new Date().toISOString().split('T')[0];
  return {
    id: generateId(),
    invoiceNumber: generateInvoiceNumber(),
    clientId: '',
    issueDate: today,
    dueDate: getDueDate(today),
    items: [],
    tax: 0,
    discount: 0,
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 0,
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
};

// Create empty invoice item
export const createEmptyInvoiceItem = (productId = '', price = 0): InvoiceItem => {
  return {
    id: generateId(),
    productId,
    description: '',
    quantity: 1,
    price,
    total: price,
  };
};