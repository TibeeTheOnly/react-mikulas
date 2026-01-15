import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Child, Toy, MikulasContextType, CreateToyDto } from '../types';
import { config } from '../config/api';

const MikulasContext = createContext<MikulasContextType | undefined>(undefined);

export const MikulasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gyerekek lekérése
  const fetchChildren = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.apiBaseUrl}${config.endpoints.children}`);
      if (!response.ok) throw new Error('Gyerekek betöltése sikertelen');
      const data = await response.json();
      setChildrenList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba');
      console.error('Fetch children error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Játékok lekérése
  const fetchToys = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.apiBaseUrl}${config.endpoints.toys}`);
      if (!response.ok) throw new Error('Játékok betöltése sikertelen');
      const data = await response.json();
      setToys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba');
      console.error('Fetch toys error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Játék létrehozása
  const createToy = async (toy: CreateToyDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.apiBaseUrl}${config.endpoints.toys}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toy),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Játék létrehozása sikertelen');
      }
      await fetchToys(); // Frissítjük a listát
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba');
      console.error('Create toy error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Játék törlése
  const deleteToy = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.apiBaseUrl}${config.endpoints.toys}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Játék törlése sikertelen');
      await fetchToys(); // Frissítjük a listát
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba');
      console.error('Delete toy error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Játék hozzárendelése gyerekhez (Backend használja a PUT metódust!)
  const assignToyToChild = async (childId: number, toyId: number) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${config.apiBaseUrl}${config.endpoints.childToys(childId, toyId)}`;
      const response = await fetch(url, {
        method: 'PUT', // Backend PUT-ot vár!
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Játék hozzárendelése sikertelen');
      }
      
      // Frissítjük mindkét listát
      await fetchChildren();
      await fetchToys();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba');
      console.error('Assign toy error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Játék eltávolítása gyerektől
  const removeToyFromChild = async (childId: number, toyId: number) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${config.apiBaseUrl}${config.endpoints.childToys(childId, toyId)}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Játék eltávolítása sikertelen');
      
      // Frissítjük mindkét listát
      await fetchChildren();
      await fetchToys();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba');
      console.error('Remove toy error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Egy gyerek játékainak lekérdezése (backend childId property alapján)
  const getChildToys = (childId: number): Toy[] => {
    return toys.filter(toy => toy.childId === childId);
  };

  const value: MikulasContextType = {
    children: childrenList,
    toys,
    loading,
    error,
    fetchChildren,
    fetchToys,
    createToy,
    deleteToy,
    assignToyToChild,
    removeToyFromChild,
    getChildToys,
  };

  return <MikulasContext.Provider value={value}>{children}</MikulasContext.Provider>;
};

// Custom hook a context használatához
export const useMikulas = () => {
  const context = useContext(MikulasContext);
  if (context === undefined) {
    throw new Error('useMikulas must be used within a MikulasProvider');
  }
  return context;
};
