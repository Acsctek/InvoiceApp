import React from 'react';
import { useClients } from '../context/ClientContext';
import ClientsList from '../components/clients/ClientsList';

const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useClients();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Clients</h1>
      </div>

      <ClientsList
        clients={clients}
        onAddClient={addClient}
        onUpdateClient={updateClient}
        onDeleteClient={deleteClient}
      />
    </div>
  );
};

export default Clients;