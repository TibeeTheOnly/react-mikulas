// API típusok - Backend kompatibilis
export interface Child {
  id: number;
  name: string;
  address: string;
  hasBeenGood: boolean;
}

export interface Toy {
  id: number;
  name: string;
  material: 'wood' | 'plastic' | 'metal';
  weight: number;
  childId?: number | null;
}

// DTOs
export interface CreateToyDto {
  name: string;
  material: 'wood' | 'plastic' | 'metal';
  weight: number;
}

// Context típusok
export interface MikulasContextType {
  children: Child[];
  toys: Toy[];
  loading: boolean;
  error: string | null;
  
  // Children műveletek
  fetchChildren: () => Promise<void>;
  
  // Toys műveletek
  fetchToys: () => Promise<void>;
  createToy: (toy: CreateToyDto) => Promise<void>;
  deleteToy: (id: number) => Promise<void>;
  
  // Child-Toy műveletek
  assignToyToChild: (childId: number, toyId: number) => Promise<void>;
  removeToyFromChild: (childId: number, toyId: number) => Promise<void>;
  getChildToys: (childId: number) => Toy[];
}
