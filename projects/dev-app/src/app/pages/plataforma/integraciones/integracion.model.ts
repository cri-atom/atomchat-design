export type IntegracionStatus = 'conectado' | 'conectar';

export interface Integracion {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl: string;
  logoBgColor?: string;
  status: IntegracionStatus;
}
