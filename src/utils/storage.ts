import { Product, Client, Invoice, CompanyInfo } from '../types';

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'invoice_app_products',
  CLIENTS: 'invoice_app_clients',
  INVOICES: 'invoice_app_invoices',
  COMPANY: 'invoice_app_company',
};

// Storage functions for Products
export const getProducts = (): Product[] => {
  const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return products ? JSON.parse(products) : [];
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find((product) => product.id === id);
};

// Storage functions for Clients
export const getClients = (): Client[] => {
  const clients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  return clients ? JSON.parse(clients) : [];
};

export const saveClients = (clients: Client[]): void => {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
};

export const getClientById = (id: string): Client | undefined => {
  const clients = getClients();
  return clients.find((client) => client.id === id);
};

// Storage functions for Invoices
export const getInvoices = (): Invoice[] => {
  const invoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
  return invoices ? JSON.parse(invoices) : [];
};

export const saveInvoices = (invoices: Invoice[]): void => {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

export const getInvoiceById = (id: string): Invoice | undefined => {
  const invoices = getInvoices();
  return invoices.find((invoice) => invoice.id === id);
};

// Storage functions for Company Info
export const getCompanyInfo = (): CompanyInfo => {
  const companyInfo = localStorage.getItem(STORAGE_KEYS.COMPANY);
  return companyInfo
    ? JSON.parse(companyInfo)
    : {
        name: 'Your Company',
        address: '123 Business Street, City, Country',
        phone: '+1 (555) 123-4567',
        email: 'contact@yourcompany.com',
      };
};

export const saveCompanyInfo = (companyInfo: CompanyInfo): void => {
  localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(companyInfo));
};

// Initialize with demo data if empty
export const initializeData = (): void => {
  // Only initialize if no data exists
  if (getProducts().length === 0) {
    const demoProducts: Product[] = [
      {
        id: 'prod-1',
        name: 'Web Design Service',
        price: 1500,
        description: 'Professional website design',
        unit: 'project',
      },
      {
        id: 'prod-2',
        name: 'Logo Design',
        price: 500,
        description: 'Custom logo design with revisions',
        unit: 'item',
      },
      {
        id: 'prod-3',
        name: 'Consulting Hour',
        price: 120,
        description: 'Professional consulting service',
        unit: 'hour',
      },
    ];
    saveProducts(demoProducts);
  }

  if (getClients().length === 0) {
    const demoClients: Client[] = [
      {
        id: 'client-1',
        name: 'John Smith',
        email: 'john@example.com',
        address: '123 Main St, Anytown, USA',
        phone: '(555) 123-4567',
        company: 'Smith Enterprises',
      },
      {
        id: 'client-2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        address: '456 Oak Ave, Somewhere, USA',
        phone: '(555) 987-6543',
        company: 'Johnson Industries',
      },
    ];
    saveClients(demoClients);
  }
};