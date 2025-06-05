import { Role } from "./role.model";

export interface Employee {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}