import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import { useClients } from '../context/ClientContext';
import { useProducts } from '../context/ProductContext';
import InvoiceDetail from '../components/invoices/InvoiceDetail';
import { Invoice, Client } from '../types';

const ViewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, updateInvoice, deleteInvoice, getInvoiceById } = useInvoices();
  const { clients, getClientById } = useClients();
  const { products } = useProducts();
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundInvoice = getInvoiceById(id);
      
      if (foundInvoice) {
        setInvoice(foundInvoice);
        
        const foundClient = getClientById(foundInvoice.clientId);
        if (foundClient) {
          setClient(foundClient);
        }
      } else {
        navigate('/invoices', { replace: true });
      }
    }
    setLoading(false);
  }, [id, invoices, clients]);

  const handleUpdateStatus = (id: string, status: Invoice['status']) => {
    updateInvoice(id, { status });
    
    // Refresh the invoice after status update
    const updatedInvoice = getInvoiceById(id);
    if (updatedInvoice) {
      setInvoice(updatedInvoice);
    }
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    navigate('/invoices');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!invoice || !client) {
    return <div>Invoice not found</div>;
  }

  return (
    <div>
      <InvoiceDetail
        invoice={invoice}
        client={client}
        products={products}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ViewInvoice;