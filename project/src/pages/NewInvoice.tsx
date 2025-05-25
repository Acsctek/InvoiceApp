import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import { useClients } from '../context/ClientContext';
import { useProducts } from '../context/ProductContext';
import { generateInvoiceNumber, createEmptyInvoice } from '../utils/helpers';
import InvoiceForm from '../components/invoices/InvoiceForm';

const NewInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { addInvoice, recalculateInvoice } = useInvoices();
  const { clients } = useClients();
  const { products } = useProducts();
  const [invoice, setInvoice] = useState(createEmptyInvoice());

  useEffect(() => {
    // Generate a new invoice number
    setInvoice({
      ...invoice,
      invoiceNumber: generateInvoiceNumber(),
    });
  }, []);

  const handleSubmit = (formData: any) => {
    const invoiceId = addInvoice(formData);
    navigate(`/invoices/${invoiceId}`);
  };

  const handleCancel = () => {
    navigate('/invoices');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Create New Invoice</h1>
      </div>

      <InvoiceForm
        invoice={invoice}
        clients={clients}
        products={products}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        recalculateInvoice={recalculateInvoice}
      />
    </div>
  );
};

export default NewInvoice;