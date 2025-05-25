import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, DollarSign, Percent } from 'lucide-react';
import { Invoice, InvoiceItem, Product, Client } from '../../types';
import { formatCurrency, createEmptyInvoiceItem } from '../../utils/helpers';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface InvoiceFormProps {
  invoice?: Invoice;
  products: Product[];
  clients: Client[];
  onSubmit: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  recalculateInvoice: (items: InvoiceItem[], tax?: number, discount?: number) => {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
  };
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  products,
  clients,
  onSubmit,
  onCancel,
  recalculateInvoice,
}) => {
  const [formData, setFormData] = useState<Omit<Invoice, 'id' | 'createdAt'>>({
    invoiceNumber: '',
    clientId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [],
    tax: 0,
    discount: 0,
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 0,
    notes: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState<{
    clientId?: string;
    items?: string;
  }>({});

  // Initialize form with invoice data if editing
  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        clientId: invoice.clientId,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        items: [...invoice.items],
        tax: invoice.tax,
        discount: invoice.discount,
        subtotal: invoice.subtotal,
        taxAmount: invoice.taxAmount,
        discountAmount: invoice.discountAmount,
        total: invoice.total,
        notes: invoice.notes || '',
        status: invoice.status,
      });
    } else {
      // Add due date (30 days from today)
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + 30);
      
      setFormData({
        ...formData,
        dueDate: dueDate.toISOString().split('T')[0],
      });
    }
  }, [invoice]);

  // Recalculate totals when items, tax, or discount change
  useEffect(() => {
    const { subtotal, taxAmount, discountAmount, total } = recalculateInvoice(
      formData.items,
      formData.tax,
      formData.discount
    );

    setFormData({
      ...formData,
      subtotal,
      taxAmount,
      discountAmount,
      total,
    });
  }, [formData.items, formData.tax, formData.discount]);

  const handleGeneralChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'tax' || name === 'discount') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddItem = () => {
    const newItem = createEmptyInvoiceItem();
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.id !== itemId),
    });
  };

  const handleItemChange = (
    itemId: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const updatedItems = formData.items.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // If product changed, update price and description
        if (field === 'productId' && typeof value === 'string') {
          const selectedProduct = products.find((p) => p.id === value);
          if (selectedProduct) {
            updatedItem.price = selectedProduct.price;
            updatedItem.description = selectedProduct.description || '';
          }
        }
        
        // Recalculate total when quantity or price changes
        if (field === 'quantity' || field === 'price' || field === 'productId') {
          updatedItem.total = 
            parseFloat(updatedItem.quantity.toString()) * 
            parseFloat(updatedItem.price.toString());
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const validate = (): boolean => {
    const newErrors: { clientId?: string; items?: string } = {};
    
    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client';
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'Please add at least one item';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        status: saveAsDraft ? 'draft' : 'pending',
      });
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
            Client <span className="text-danger-500">*</span>
          </label>
          <select
            id="clientId"
            name="clientId"
            value={formData.clientId}
            onChange={handleGeneralChange}
            className={`w-full ${errors.clientId ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''}`}
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.company ? `(${client.company})` : ''}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-danger-500">{errors.clientId}</p>
          )}
        </div>

        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleGeneralChange}
            className="w-full bg-gray-50"
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Issue Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-500" />
            </div>
            <input
              type="date"
              id="issueDate"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleGeneralChange}
              className="w-full pl-9"
            />
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-500" />
            </div>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleGeneralChange}
              className="w-full pl-9"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus size={16} />}
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </div>

        {errors.items && (
          <p className="text-sm text-danger-500">{errors.items}</p>
        )}

        {formData.items.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
            <p className="text-gray-500">No items added yet. Click the button above to add an item.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <Card key={item.id} className="animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex justify-between mb-4">
                    <h4 className="font-medium">Item #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-danger-500 hover:text-danger-700 p-1 h-auto"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5">
                      <label htmlFor={`product-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                      </label>
                      <select
                        id={`product-${item.id}`}
                        value={item.productId}
                        onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                        className="w-full"
                      >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({formatCurrency(product.price)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label htmlFor={`quantity-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        min="1"
                        step="1"
                        className="w-full"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor={`price-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={16} className="text-gray-500" />
                        </div>
                        <input
                          type="number"
                          id={`price-${item.id}`}
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full pl-9"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor={`total-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Total
                      </label>
                      <input
                        type="text"
                        id={`total-${item.id}`}
                        value={formatCurrency(item.total)}
                        readOnly
                        className="w-full bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label htmlFor={`description-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id={`description-${item.id}`}
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full"
                      placeholder="Item description"
                    ></textarea>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleGeneralChange}
              rows={4}
              className="w-full"
              placeholder="Additional notes or payment instructions..."
            ></textarea>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Percent size={16} className="text-gray-500" />
                </div>
                <input
                  type="number"
                  id="tax"
                  name="tax"
                  value={formData.tax}
                  onChange={handleGeneralChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full pl-9"
                />
              </div>
            </div>

            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Percent size={16} className="text-gray-500" />
                </div>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleGeneralChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full pl-9"
                />
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(formData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({formData.tax}%):</span>
                <span>{formatCurrency(formData.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount ({formData.discount}%):</span>
                <span>{formatCurrency(formData.discountAmount)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-primary-700 text-lg">{formatCurrency(formData.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={(e) => handleSubmit(e, true)}
        >
          Save as Draft
        </Button>
        <Button type="submit" variant="primary">
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;