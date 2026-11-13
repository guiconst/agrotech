// Faixas de referência aproximadas de umidade do solo (%), para fins didáticos.
export const CULTURAS: Record<string, { min: number; max: number }> = {
  Geral: { min: 30, max: 70 },
  Alface: { min: 50, max: 75 },
  Tomate: { min: 40, max: 65 },
  Cenoura: { min: 35, max: 60 },
  Couve: { min: 45, max: 70 },
  Manjericão: { min: 35, max: 60 },
  Mandioca: { min: 25, max: 50 }
};
