import React from 'react';
import { useProducts } from '../context/ProductContext';
import ProductsList from '../components/products/ProductsList';

const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products & Services</h1>
      </div>

      <ProductsList
        products={products}
        onAddProduct={addProduct}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
      />
    </div>
  );
};

export default Products;