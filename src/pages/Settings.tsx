import React, { useState, useEffect } from 'react';
import { Building, Mail, Phone, Globe } from 'lucide-react';
import { getCompanyInfo, saveCompanyInfo } from '../utils/storage';
import { CompanyInfo } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const Settings: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load company info from localStorage
    const info = getCompanyInfo();
    setCompanyInfo(info);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    });
    
    // Reset the saved message
    if (isSaved) {
      setIsSaved(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save company info to localStorage
    saveCompanyInfo(companyInfo);
    
    // Show saved message
    setIsSaved(true);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={companyInfo.name}
                  onChange={handleChange}
                  className="w-full pl-9"
                  placeholder="Your Company Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={companyInfo.address}
                onChange={handleChange}
                rows={3}
                className="w-full"
                placeholder="Company Address"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={companyInfo.email}
                    onChange={handleChange}
                    className="w-full pl-9"
                    placeholder="contact@yourcompany.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={companyInfo.phone}
                    onChange={handleChange}
                    className="w-full pl-9"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website (optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={companyInfo.website}
                    onChange={handleChange}
                    className="w-full pl-9"
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              {isSaved && (
                <span className="text-success-600 animate-fade-in">
                  Company information saved successfully!
                </span>
              )}
              
              <Button type="submit" variant="primary">
                Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;