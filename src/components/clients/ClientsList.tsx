import React, { useState } from 'react';
import { Edit, Trash2, Users, Building2, AtSign, Phone, Plus } from 'lucide-react';
import { Client } from '../../types';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ClientForm from './ClientForm';
import EmptyState from '../ui/EmptyState';

interface ClientsListProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onUpdateClient: (id: string, client: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateClient = (updatedClient: Omit<Client, 'id'>) => {
    if (selectedClient) {
      onUpdateClient(selectedClient.id, updatedClient);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClient = () => {
    if (selectedClient) {
      onDeleteClient(selectedClient.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleAddClient = (client: Omit<Client, 'id'>) => {
    onAddClient(client);
    setIsAddModalOpen(false);
  };

  if (clients.length === 0) {
    return (
      <EmptyState
        title="No clients yet"
        description="Add your first client to get started"
        icon={<Users size={48} />}
        action={{
          label: "Add Client",
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
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <Card
            key={client.id}
            hoverable
            className="transition-all hover:border-primary-300 animate-fade-in"
          >
            <div>
              <h3 className="text-lg font-medium">{client.name}</h3>
              {client.company && (
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Building2 size={14} className="mr-1" />
                  {client.company}
                </div>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center text-gray-600 text-sm">
                <AtSign size={14} className="mr-2 min-w-[14px]" />
                {client.email}
              </div>

              {client.phone && (
                <div className="flex items-center text-gray-600 text-sm">
                  <Phone size={14} className="mr-2 min-w-[14px]" />
                  {client.phone}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                icon={<Edit size={14} />}
                onClick={() => handleEditClick(client)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-danger-500 hover:text-danger-700"
                icon={<Trash2 size={14} />}
                onClick={() => handleDeleteClick(client)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Client"
        size="md"
      >
        <ClientForm
          onSubmit={handleAddClient}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Client"
        size="md"
      >
        {selectedClient && (
          <ClientForm
            client={selectedClient}
            onSubmit={handleUpdateClient}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Client"
        size="sm"
      >
        <div className="py-4">
          <p>
            Are you sure you want to delete <strong>{selectedClient?.name}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteClient}>
            Delete Client
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ClientsList;