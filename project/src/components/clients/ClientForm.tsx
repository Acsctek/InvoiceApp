import React, { useState, useEffect } from 'react';
import { AtSign, Phone, Building2, MapPin } from 'lucide-react';
import { Client } from '../../types';
import Button from '../ui/Button';

interface ClientFormProps {
  client?: Client;
  onSubmit: (client: Omit<Client, 'id'>) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    name: '',
    email: '',
    address: '',
    phone: '',
    company: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    address?: string;
  }>({});

  // Initialize form with client data if editing
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        address: client.address,
        phone: client.phone || '',
        company: client.company || '',
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string; address?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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
          Client Name <span className="text-danger-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full ${errors.name ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''}`}
          placeholder="Enter client name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-danger-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AtSign size={16} className="text-gray-500" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full pl-9 ${errors.email ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''}`}
            placeholder="client@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-danger-500">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone (optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={16} className="text-gray-500" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-9"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company (optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full pl-9"
              placeholder="Company name"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-danger-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin size={16} className="text-gray-500" />
          </div>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className={`w-full pl-9 ${errors.address ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''}`}
            placeholder="Full address"
          ></textarea>
        </div>
        {errors.address && (
          <p className="mt-1 text-sm text-danger-500">{errors.address}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {client ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;