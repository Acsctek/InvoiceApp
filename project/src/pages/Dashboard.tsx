import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Users, Package, CreditCard, ArrowUpRight, 
  ArrowUp, ArrowDown, TrendingUp, Wallet, Calendar,
  BarChart3, PieChart, FileBarChart
} from 'lucide-react';
import { useInvoices } from '../context/InvoiceContext';
import { useClients } from '../context/ClientContext';
import { useProducts } from '../context/ProductContext';
import { formatCurrency } from '../utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard: React.FC = () => {
  const { invoices } = useInvoices();
  const { clients } = useClients();
  const { products } = useProducts();
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidInvoices: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    averageInvoice: 0,
    invoiceCount: 0,
    clientCount: 0,
    productCount: 0,
  });

  useEffect(() => {
    // Calculate statistics
    if (invoices.length > 0) {
      const paidInvoices = invoices.filter(inv => inv.status === 'paid');
      const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
      const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
      
      const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const averageInvoice = invoices.length > 0 ? 
        invoices.reduce((sum, inv) => sum + inv.total, 0) / invoices.length : 0;
      
      setStats({
        totalRevenue,
        paidInvoices: paidInvoices.length,
        pendingAmount,
        overdueAmount,
        averageInvoice,
        invoiceCount: invoices.length,
        clientCount: clients.length,
        productCount: products.length,
      });
    }
  }, [invoices, clients, products]);

  // Get recent invoices (last 5)
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get upcoming invoices (next 5 due)
  const upcomingInvoices = [...invoices]
    .filter(inv => inv.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link to="/invoices/new">
          <Button variant="primary" size="sm" icon={<FileText size={16} />}>
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-primary-100 mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</h3>
              </div>
              <div className="bg-primary-500 bg-opacity-50 p-2 rounded-lg">
                <Wallet size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-primary-100">
              <ArrowUp size={14} className="mr-1" />
              <span className="text-sm">From {stats.paidInvoices} paid invoices</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 mb-1">Pending</p>
                <h3 className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</h3>
              </div>
              <div className="bg-warning-100 p-2 rounded-lg text-warning-600">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-gray-500">
              <Calendar size={14} className="mr-1" />
              <span className="text-sm">Awaiting payment</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 mb-1">Clients</p>
                <h3 className="text-2xl font-bold">{stats.clientCount}</h3>
              </div>
              <div className="bg-secondary-100 p-2 rounded-lg text-secondary-600">
                <Users size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-gray-500">
              <ArrowUpRight size={14} className="mr-1" />
              <span className="text-sm">Active clients</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 mb-1">Products</p>
                <h3 className="text-2xl font-bold">{stats.productCount}</h3>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                <Package size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-gray-500">
              <BarChart3 size={14} className="mr-1" />
              <span className="text-sm">Available products</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and stats section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {recentInvoices.length > 0 ? (
              <div className="space-y-3">
                {recentInvoices.map((invoice) => {
                  const client = clients.find(c => c.id === invoice.clientId);
                  return (
                    <Link key={invoice.id} to={`/invoices/${invoice.id}`}>
                      <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <FileText className="text-gray-400 mr-3" size={18} />
                          <div>
                            <p className="font-medium">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-gray-500">{client?.name || 'Unknown client'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(invoice.total)}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <FileText className="mx-auto mb-2" size={24} />
                <p>No invoices yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingInvoices.length > 0 ? (
              <div className="space-y-3">
                {upcomingInvoices.map((invoice) => {
                  const client = clients.find(c => c.id === invoice.clientId);
                  const daysUntilDue = Math.ceil(
                    (new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                  );
                  
                  return (
                    <Link key={invoice.id} to={`/invoices/${invoice.id}`}>
                      <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <Calendar className="text-gray-400 mr-3" size={18} />
                          <div>
                            <p className="font-medium">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-gray-500">{client?.name || 'Unknown client'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(invoice.total)}</p>
                          <p className={`text-xs ${daysUntilDue <= 3 ? 'text-danger-500' : 'text-gray-500'}`}>
                            Due in {daysUntilDue} days
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="mx-auto mb-2" size={24} />
                <p>No upcoming payments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Average Invoice</h3>
              <FileBarChart size={20} className="text-primary-500" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.averageInvoice)}</p>
            <div className="mt-3 text-sm text-gray-500">
              Based on {stats.invoiceCount} invoices
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Overdue Invoices</h3>
              <ArrowDown size={20} className="text-danger-500" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.overdueAmount)}</p>
            <div className="mt-3 text-sm text-gray-500">
              Needs attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Total Invoices</h3>
              <PieChart size={20} className="text-secondary-500" />
            </div>
            <p className="text-2xl font-bold">{stats.invoiceCount}</p>
            <div className="mt-3 text-sm text-gray-500">
              All time
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;