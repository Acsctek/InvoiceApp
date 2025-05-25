import React, { useState } from 'react';
import { Edit, Trash2, Package, ChevronRight, Plus } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ProductForm from './ProductForm';
import EmptyState from '../ui/EmptyState';

interface ProductsListProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateProduct = (updatedProduct: Omit<Product, 'id'>) => {
    if (selectedProduct) {
      onUpdateProduct(selectedProduct.id, updatedProduct);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      onDeleteProduct(selectedProduct.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    onAddProduct(product);
    setIsAddModalOpen(false);
  };

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products yet"
        description="Add your first product to get started"
        icon={<Package size={48} />}
        action={{
          label: "Add Product",
          onClick: () => setIsAddModalOpen(true)
        }}
        className="py-12"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            hoverable
            className="transition-all hover:border-primary-300 animate-fade-in"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>
              <div className="text-xl font-semibold text-primary-700">
                {formatCurrency(product.price)}
              </div>
            </div>

            <div className="mt-2">
              {product.unit && (
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700 mr-2">
                  {product.unit}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-3 text-sm text-gray-500 line-clamp-2">{product.description}</p>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                icon={<Edit size={14} />}
                onClick={() => handleEditClick(product)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-danger-500 hover:text-danger-700"
                icon={<Trash2 size={14} />}
                onClick={() => handleDeleteClick(product)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        size="md"
      >
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
        size="md"
      >
        {selectedProduct && (
          <ProductForm
            product={selectedProduct}
            onSubmit={handleUpdateProduct}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        size="sm"
      >
        <div className="py-4">
          <p>
            Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete Product
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsList;