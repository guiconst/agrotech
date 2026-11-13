import type { Horta } from "./types";

const NOVA = "agrotech:v2";
const ANTIGA = "agrotech:hortas";
const CFG = "agrotech:alertas";

function historico(valores: number[]) {
  const agora = Date.now();
  return valores.map((v, i) => ({
    t: new Date(agora - (valores.length - 1 - i) * 86400000).toISOString(),
    v,
    origem: "manual" as const
  }));
}

function semente(): Horta[] {
  return [
    { id: 1, nome: "Horta do Jardim Primavera", local: "Rua das Acácias", cultura: "Tomate", leituras: historico([48, 52, 45, 58, 61, 54]), notas: [] },
    { id: 2, nome: "Horta da Escola Municipal", local: "Vila Esperança", cultura: "Alface", leituras: historico([66, 60, 52, 41, 33, 22]), notas: [] },
    { id: 3, nome: "Horta Comunitária do Centro", local: "Praça da Matriz", cultura: "Geral", leituras: historico([55, 62, 70, 74, 76, 78]), notas: [] }
  ];
}

export function carregar(): Horta[] {
  try {
    const n = localStorage.getItem(NOVA);
    if (n) return JSON.parse(n) as Horta[];
    const a = localStorage.getItem(ANTIGA);
    if (a) {
      const velhas = JSON.parse(a) as { id: number; nome: string; local: string; umidade: number; atualizadoEm: string }[];
      return velhas.map((o) => ({
        id: o.id,
        nome: o.nome,
        local: o.local,
        cultura: "Geral",
        leituras: [{ t: o.atualizadoEm, v: o.umidade, origem: "manual" as const }],
        notas: []
      }));
    }
  } catch {
    /* usa dados de exemplo */
  }
  return semente();
}

export function salvar(hortas: Horta[]) {
  try {
    localStorage.setItem(NOVA, JSON.stringify(hortas));
  } catch {
    /* sem armazenamento */
  }
}

export const carregarAlertas = () => {
  try {
    return localStorage.getItem(CFG) === "1";
  } catch {
    return false;
  }
};

export const salvarAlertas = (ligado: boolean) => {
  try {
    localStorage.setItem(CFG, ligado ? "1" : "0");
  } catch {
    /* ignora */
  }
};
