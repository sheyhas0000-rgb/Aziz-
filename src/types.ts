export type Relation = 'Ota' | 'Ona' | 'Aka' | 'Opa' | 'Uka' | 'Singil' | 'Bobo' | 'Buvijon' | 'Katta bobo' | 'Katta buvi' | 'Turmush oʻrtogʻi' | 'Farzand' | 'Oʻzim';

export interface FamilyMember {
  id: string;
  name: string;
  relation: Relation;
  birthDate?: string;
  deathDate?: string;
  description?: string;
  gender: 'Erkak' | 'Ayol';
}
