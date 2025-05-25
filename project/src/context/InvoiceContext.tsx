import React, { createContext, useState, useEffect, useContext } from 'react';
import { Invoice, InvoiceItem } from '../types';
import { getInvoices, saveInvoices } from '../utils/storage';
import { generateId, calculateInvoice } from '../utils/helpers';

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => string;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  recalculateInvoice: (items: InvoiceItem[], tax?: number, discount?: number) => {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
  };
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Load invoices from localStorage
    setInvoices(getInvoices());
  }, []);

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...invoice,
    };
    
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    saveInvoices(updatedInvoices);
    
    return newInvoice.id;
  };

  const updateInvoice = (id: string, updatedFields: Partial<Invoice>) => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, ...updatedFields } : invoice
    );
    
    setInvoices(updatedInvoices);
    saveInvoices(updatedInvoices);
  };

  const deleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
    setInvoices(updatedInvoices);
    saveInvoices(updatedInvoices);
  };

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  const recalculateInvoice = (items: InvoiceItem[], tax = 0, discount = 0) => {
    return calculateInvoice(items, tax, discount);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
        recalculateInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};