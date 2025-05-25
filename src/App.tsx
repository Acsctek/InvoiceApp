import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import NewInvoice from './pages/NewInvoice';
import EditInvoice from './pages/EditInvoice';
import ViewInvoice from './pages/ViewInvoice';
import Settings from './pages/Settings';
import { ProductProvider } from './context/ProductContext';
import { ClientProvider } from './context/ClientContext';
import { InvoiceProvider } from './context/InvoiceContext';

function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <ClientProvider>
          <InvoiceProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="clients" element={<Clients />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="invoices/new" element={<NewInvoice />} />
                <Route path="invoices/:id" element={<ViewInvoice />} />
                <Route path="invoices/edit/:id" element={<EditInvoice />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </InvoiceProvider>
        </ClientProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;