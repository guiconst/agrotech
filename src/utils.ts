import { CULTURAS } from "./culturas";
import type { Estado, Horta } from "./types";

export const atual = (h: Horta) => h.leituras[h.leituras.length - 1];
export const faixa = (h: Horta) => CULTURAS[h.cultura] ?? CULTURAS.Geral;

export function estado(h: Horta): Estado {
  const u = atual(h).v;
  const f = faixa(h);
  return u < f.min ? "seca" : u > f.max ? "encharcada" : "ideal";
}

export const TEXTO: Record<Estado, { rotulo: string; dica: string }> = {
  seca: { rotulo: "Seca", dica: "Regar hoje" },
  ideal: { rotulo: "Ideal", dica: "Sem ação necessária" },
  encharcada: { rotulo: "Encharcada", dica: "Suspender a rega" }
};

export function dataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export const limitar = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
