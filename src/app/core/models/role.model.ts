export interface Role {
  id: number;
  name: string;
  description:{
    es: string;
    en: string;
  };
  permissions: string[];
}