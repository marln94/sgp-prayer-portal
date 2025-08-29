export enum Priorities {
  Prioritario = "Prioritario",
  Diario = "Diario"
}

export interface Prayer {
  id: number;
  text: string;
  category: string;
  priority?: Priorities;
  checked?: boolean;
}
