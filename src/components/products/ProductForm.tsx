import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { Product } from '../../types';
import Button from '../ui/Button';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    description: '',
    unit: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
  }>({});

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description || '',
        unit: product.unit || '',
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle price input differently, convert to number
    if (name === 'price') {
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

  const validate = (): boolean => {
    const newErrors: { name?: string; price?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name <span className="text-danger-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full ${errors.name ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''}`}
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-danger-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign size={16} className="text-gray-500" />
          </div>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full pl-9 ${errors.price ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''}`}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
        {errors.price && (
          <p className="mt-1 text-sm text-danger-500">{errors.price}</p>
        )}
      </div>

      <div>
        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
          Unit (optional)
        </label>
        <input
          type="text"
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="w-full"
          placeholder="hour, item, piece, etc."
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full"
          placeholder="Product description"
        ></textarea>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;