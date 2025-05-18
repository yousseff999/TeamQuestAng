import { Submission } from "./Submission";

// src/app/models/defi.model.ts
export interface Defi {
  id?: number;
  theme: string;
  title: string;
  description: string;
  deadline: Date | string;
  submissions?: Submission[];
}