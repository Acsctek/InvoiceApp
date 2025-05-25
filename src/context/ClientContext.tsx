import React, { createContext, useState, useEffect, useContext } from 'react';
import { Client } from '../types';
import { getClients, saveClients, initializeData } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    // Initialize data with demo values if empty
    initializeData();
    
    // Load clients from localStorage
    setClients(getClients());
  }, []);

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      id: generateId(),
      ...client,
    };
    
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  const updateClient = (id: string, updatedFields: Partial<Client>) => {
    const updatedClients = clients.map((client) =>
      client.id === id ? { ...client, ...updatedFields } : client
    );
    
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter((client) => client.id !== id);
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  const getClientById = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};