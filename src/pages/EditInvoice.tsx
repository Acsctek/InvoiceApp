import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import { useClients } from '../context/ClientContext';
import { useProducts } from '../context/ProductContext';
import InvoiceForm from '../components/invoices/InvoiceForm';
import { Invoice } from '../types';

const EditInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, updateInvoice, getInvoiceById, recalculateInvoice } = useInvoices();
  const { clients } = useClients();
  const { products } = useProducts();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundInvoice = getInvoiceById(id);
      if (foundInvoice) {
        setInvoice(foundInvoice);
      } else {
        navigate('/invoices', { replace: true });
      }
    }
    setLoading(false);
  }, [id, getInvoiceById, navigate]);

  const handleSubmit = (formData: Omit<Invoice, 'id' | 'createdAt'>) => {
    if (id && invoice) {
      // Preserve the original createdAt date
      updateInvoice(id, {
        ...formData,
        createdAt: invoice.createdAt
      });
      navigate(`/invoices/${id}`);
    }
  };

  const handleCancel = () => {
    navigate(`/invoices/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Edit Invoice {invoice.invoiceNumber}</h1>
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

export default EditInvoice;