import React, { useState } from 'react';
import { Invoice, Client, Product } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { 
  Download, Send, Check, Clock, FileText, AlertTriangle, 
  FileEdit, Trash2, Calendar, Building2, Phone, Mail
} from 'lucide-react';
import Modal from '../ui/Modal';

interface InvoiceDetailProps {
  invoice: Invoice;
  client: Client;
  products: Product[];
  onUpdateStatus: (id: string, status: Invoice['status']) => void;
  onDelete: (id: string) => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  invoice,
  client,
  products,
  onUpdateStatus,
  onDelete,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDownloadPDF = () => {
    generateInvoicePDF(invoice);
  };

  const handleSendEmail = () => {
    // In a real app, this would integrate with an email API
    // Here we'll just create a mailto link
    const subject = encodeURIComponent(`Invoice ${invoice.invoiceNumber}`);
    const body = encodeURIComponent(`Dear ${client.name},\n\nPlease find attached invoice ${invoice.invoiceNumber} for ${formatCurrency(invoice.total)}.\n\nPayment is due by ${formatDate(invoice.dueDate)}.\n\nThank you for your business.`);
    
    window.location.href = `mailto:${client.email}?subject=${subject}&body=${body}`;
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'draft':
        return <FileText className="mr-2 text-gray-500" />;
      case 'pending':
        return <Clock className="mr-2 text-warning-500" />;
      case 'paid':
        return <Check className="mr-2 text-success-500" />;
      case 'overdue':
        return <AlertTriangle className="mr-2 text-danger-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Invoice['status']) => {
    const statusMap = {
      draft: 'Draft',
      pending: 'Pending Payment',
      paid: 'Paid',
      overdue: 'Overdue',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: Invoice['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-warning-100 text-warning-700';
      case 'paid':
        return 'bg-success-100 text-success-700';
      case 'overdue':
        return 'bg-danger-100 text-danger-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProductName = (productId: string): string => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Invoice {invoice.invoiceNumber}</h1>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(invoice.status)}`}>
            {getStatusIcon(invoice.status)}
            {getStatusText(invoice.status)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={16} />}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon={<Send size={16} />}
            onClick={handleSendEmail}
          >
            Send Email
          </Button>
          
          {invoice.status === 'draft' && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Clock size={16} />}
              onClick={() => onUpdateStatus(invoice.id, 'pending')}
            >
              Mark as Pending
            </Button>
          )}
          
          {invoice.status === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              icon={<Check size={16} />}
              onClick={() => onUpdateStatus(invoice.id, 'paid')}
            >
              Mark as Paid
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="text-lg font-medium">{client.name}</h3>
              {client.company && (
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Building2 size={14} className="mr-1" />
                  {client.company}
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex">
                <Mail size={14} className="mr-2 min-w-[14px] mt-1" />
                <span>{client.email}</span>
              </div>
              
              {client.phone && (
                <div className="flex">
                  <Phone size={14} className="mr-2 min-w-[14px] mt-1" />
                  <span>{client.phone}</span>
                </div>
              )}
              
              <div className="flex">
                <div className="mr-2 min-w-[14px] mt-1">
                  <Building2 size={14} />
                </div>
                <span>{client.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Invoice Number:</span>
              <span className="font-medium">{invoice.invoiceNumber}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Issue Date:</span>
              <span className="font-medium flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(invoice.issueDate)}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(invoice.dueDate)}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm pt-3 mt-1 border-t border-gray-100">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            
            {invoice.tax > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tax ({invoice.tax}%):</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            
            {invoice.discount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Discount ({invoice.discount}%):</span>
                <span>-{formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center font-medium pt-3 mt-1 border-t border-gray-200">
              <span>Total:</span>
              <span className="text-xl text-primary-700">{formatCurrency(invoice.total)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              icon={<FileEdit size={16} />}
              onClick={() => window.location.href = `/invoices/edit/${invoice.id}`}
            >
              Edit Invoice
            </Button>
            
            {invoice.status === 'draft' && (
              <Button
                variant="outline"
                fullWidth
                icon={<Clock size={16} />}
                onClick={() => onUpdateStatus(invoice.id, 'pending')}
              >
                Mark as Pending
              </Button>
            )}
            
            {invoice.status === 'pending' && (
              <Button
                variant="primary"
                fullWidth
                icon={<Check size={16} />}
                onClick={() => onUpdateStatus(invoice.id, 'paid')}
              >
                Mark as Paid
              </Button>
            )}
            
            {invoice.status === 'pending' && (
              <Button
                variant="outline"
                fullWidth
                icon={<AlertTriangle size={16} />}
                onClick={() => onUpdateStatus(invoice.id, 'overdue')}
                className="text-danger-500 hover:text-danger-700 hover:border-danger-300"
              >
                Mark as Overdue
              </Button>
            )}
            
            <Button
              variant="outline"
              fullWidth
              icon={<Trash2 size={16} />}
              className="text-danger-500 hover:text-danger-700 hover:border-danger-300"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Invoice
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 text-sm">
                  <th className="py-2 px-4 font-medium border-b">Item</th>
                  <th className="py-2 px-4 font-medium border-b">Description</th>
                  <th className="py-2 px-4 font-medium border-b text-center">Qty</th>
                  <th className="py-2 px-4 font-medium border-b text-right">Price</th>
                  <th className="py-2 px-4 font-medium border-b text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{getProductName(item.productId)}</td>
                    <td className="py-3 px-4 text-gray-600">{item.description}</td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({invoice.tax}%)</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount ({invoice.discount}%)</span>
                <span>-{formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
              <span>Total</span>
              <span className="text-primary-700">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {invoice.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Invoice"
        size="sm"
      >
        <div className="py-4">
          <p>
            Are you sure you want to delete invoice <strong>{invoice.invoiceNumber}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => {
              onDelete(invoice.id);
              setIsDeleteModalOpen(false);
            }}
          >
            Delete Invoice
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceDetail;