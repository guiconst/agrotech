export type Origem = "manual" | "rega" | "sensor";
export type Leitura = { t: string; v: number; origem: Origem };
export type Nota = { id: number; t: string; texto: string };
export type Horta = {
  id: number;
  nome: string;
  local: string;
  cultura: string;
  leituras: Leitura[];
  notas: Nota[];
};
export type Estado = "seca" | "ideal" | "encharcada";
