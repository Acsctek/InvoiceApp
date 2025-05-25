import React from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { useClients } from '../context/ClientContext';
import InvoicesList from '../components/invoices/InvoicesList';

const Invoices: React.FC = () => {
  const { invoices, deleteInvoice, updateInvoice } = useInvoices();
  const { clients } = useClients();

  const handleUpdateStatus = (id: string, status: string) => {
    updateInvoice(id, { status });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Invoices</h1>
      </div>

      <InvoicesList
        invoices={invoices}
        clients={clients}
        onDeleteInvoice={deleteInvoice}
        onUpdateInvoiceStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default Invoices;