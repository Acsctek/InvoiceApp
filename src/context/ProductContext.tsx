import React, { createContext, useState, useEffect, useContext } from 'react';
import { Product } from '../types';
import { getProducts, saveProducts, initializeData } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Initialize data with demo values if empty
    initializeData();
    
    // Load products from localStorage
    setProducts(getProducts());
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      id: generateId(),
      ...product,
    };
    
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, ...updatedFields } : product
    );
    
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};