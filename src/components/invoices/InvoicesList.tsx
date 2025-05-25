import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Eye, Download, Pencil, Trash2, Plus, 
  Calendar, Check, Clock, AlertTriangle 
} from 'lucide-react';
import { Invoice, Client } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import EmptyState from '../ui/EmptyState';
import { generateInvoicePDF } from '../../utils/pdfGenerator';

interface InvoicesListProps {
  invoices: Invoice[];
  clients: Client[];
  onDeleteInvoice: (id: string) => void;
  onUpdateInvoiceStatus: (id: string, status: Invoice['status']) => void;
}

const InvoicesList: React.FC<InvoicesListProps> = ({
  invoices,
  clients,
  onDeleteInvoice,
  onUpdateInvoiceStatus,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleDeleteClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      onDeleteInvoice(selectedInvoice.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    generateInvoicePDF(invoice);
  };

  const handleStatusChange = (invoice: Invoice, status: Invoice['status']) => {
    onUpdateInvoiceStatus(invoice.id, status);
  };

  const getClientName = (clientId: string): string => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const statusConfig = {
      draft: {
        color: 'bg-gray-200 text-gray-800',
        icon: <FileText size={14} className="mr-1" />,
      },
      pending: {
        color: 'bg-warning-100 text-warning-700',
        icon: <Clock size={14} className="mr-1" />,
      },
      paid: {
        color: 'bg-success-100 text-success-700',
        icon: <Check size={14} className="mr-1" />,
      },
      overdue: {
        color: 'bg-danger-100 text-danger-700',
        icon: <AlertTriangle size={14} className="mr-1" />,
      },
    };

    const { color, icon } = statusConfig[status];

    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${color}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (invoices.length === 0) {
    return (
      <EmptyState
        title="No invoices yet"
        description="Create your first invoice to get started"
        icon={<FileText size={48} />}
        action={{
          label: "Create Invoice",
          onClick: () => window.location.href = '/invoices/new'
        }}
        className="py-12"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Link to="/invoices/new">
          <Button variant="primary" size="sm" icon={<Plus size={16} />}>
            New Invoice
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card
            key={invoice.id}
            hoverable
            className="transition-all hover:border-primary-300 animate-fade-in"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium mr-3">
                    <Link to={`/invoices/${invoice.id}`} className="hover:text-primary-700 transition-colors">
                      {invoice.invoiceNumber}
                    </Link>
                  </h3>
                  {getStatusBadge(invoice.status)}
                </div>

                <div className="text-gray-700 mb-3">
                  {getClientName(invoice.clientId)}
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4 md:mb-0">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    Issued: {formatDate(invoice.issueDate)} | Due: {formatDate(invoice.dueDate)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-xl font-semibold text-primary-700 mb-2">
                  {formatCurrency(invoice.total)}
                </div>

                <div className="flex space-x-2">
                  <Link to={`/invoices/${invoice.id}`}>
                    <Button variant="outline" size="sm" icon={<Eye size={14} />}>
                      View
                    </Button>
                  </Link>

                  <Link to={`/invoices/edit/${invoice.id}`}>
                    <Button variant="outline" size="sm" icon={<Pencil size={14} />}>
                      Edit
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={<Download size={14} />}
                    onClick={() => handleDownloadPDF(invoice)}
                  >
                    PDF
                  </Button>
                  
                  <div className="relative group">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500"
                    >
                      •••
                    </Button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
                      <div className="py-1">
                        {invoice.status === 'draft' && (
                          <button
                            onClick={() => handleStatusChange(invoice, 'pending')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Clock size={14} className="inline-block mr-2" />
                            Mark as Pending
                          </button>
                        )}
                        
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(invoice, 'paid')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Check size={14} className="inline-block mr-2" />
                            Mark as Paid
                          </button>
                        )}
                        
                        {(invoice.status === 'pending' || invoice.status === 'draft') && (
                          <button
                            onClick={() => handleStatusChange(invoice, 'overdue')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <AlertTriangle size={14} className="inline-block mr-2" />
                            Mark as Overdue
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteClick(invoice)}
                          className="block w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-gray-100"
                        >
                          <Trash2 size={14} className="inline-block mr-2" />
                          Delete Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Invoice"
        size="sm"
      >
        <div className="py-4">
          <p>
            Are you sure you want to delete invoice <strong>{selectedInvoice?.invoiceNumber}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteInvoice}>
            Delete Invoice
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default InvoicesList;