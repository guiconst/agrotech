import type { Leitura } from "../types";

type Props = { leituras: Leitura[]; min: number; max: number };

export default function Sparkline({ leituras, min, max }: Props) {
  const dados = leituras.slice(-14);
  if (dados.length < 2) return <p className="meta">Registre mais leituras para ver o gráfico.</p>;
  const W = 240;
  const H = 70;
  const y = (v: number) => H - (v / 100) * H;
  const pontos = dados.map((l, i) => `${(i / (dados.length - 1)) * W},${y(l.v)}`).join(" ");
  return (
    <svg className="grafico" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Histórico de umidade">
      <rect x="0" y={y(max)} width={W} height={y(min) - y(max)} className="grafico-faixa" />
      <polyline points={pontos} className="grafico-linha" fill="none" />
    </svg>
  );
}
