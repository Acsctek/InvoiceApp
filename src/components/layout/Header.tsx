import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, FileText, Download } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden mr-2"
            onClick={onMenuClick}
            aria-label="Menu"
          >
            <Menu size={24} />
          </Button>
          
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="text-primary-700" size={24} />
            <span className="text-xl font-semibold text-gray-900">InvoiceApp</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link to="/invoices/new">
            <Button 
              variant="primary" 
              size="sm"
              icon={<FileText size={16} />}
              className="hidden sm:flex"
            >
              New Invoice
            </Button>
          </Link>
          <Link to="/invoices/new">
            <Button 
              variant="primary" 
              size="sm"
              className="sm:hidden"
              aria-label="New Invoice"
            >
              <FileText size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;