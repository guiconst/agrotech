import { useState } from "react";
import type { Horta, Origem } from "../types";
import { atual, dataHora, estado, faixa, TEXTO } from "../utils";
import Sparkline from "./Sparkline";

type Props = {
  horta: Horta;
  onLeitura: (v: number, origem: Origem) => void;
  onRegar: () => void;
  onEditar: () => void;
  onRemover: () => void;
  onNota: (texto: string) => void;
  onRemoverNota: (id: number) => void;
};

const ROTULO_ORIGEM: Record<Origem, string> = { manual: "Manual", rega: "Rega", sensor: "Sensor" };

export default function HortaCard({ horta, onLeitura, onRegar, onEditar, onRemover, onNota, onRemoverNota }: Props) {
  const [aberto, setAberto] = useState(false);
  const [novo, setNovo] = useState(atual(horta).v);
  const [texto, setTexto] = useState("");
  const e = estado(horta);
  const f = faixa(horta);
  const u = atual(horta);

  return (
    <article className={`horta ${e}`}>
      <div className="horta-info">
        <h2>{horta.nome}</h2>
        <p className="local">
          {horta.local} · {horta.cultura}
        </p>
        <p className="leitura">
          <strong>{u.v}%</strong> <span className="selo">{TEXTO[e].rotulo}</span>
        </p>
        <p className="dica">
          {TEXTO[e].dica} (ideal: {f.min}% a {f.max}%)
        </p>

        <label className="ajuste">
          <span>Nova leitura: {novo}%</span>
          <input type="range" min={0} max={100} value={novo} onChange={(ev) => setNovo(Number(ev.target.value))} />
        </label>
        <div className="linha-botoes">
          <button className="secundario" onClick={() => onLeitura(novo, "manual")}>
            Registrar leitura
          </button>
          <button className="secundario" onClick={onRegar}>
            Registrar rega
          </button>
        </div>
        <p className="meta">Atualizado em {dataHora(u.t)}</p>

        <button className="link" onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
          {aberto ? "Ocultar detalhes" : "Ver histórico e anotações"}
        </button>

        {aberto && (
          <div className="detalhes">
            <h3>Histórico de umidade</h3>
            <Sparkline leituras={horta.leituras} min={f.min} max={f.max} />
            <ul className="historico">
              {horta.leituras
                .slice(-5)
                .reverse()
                .map((l, i) => (
                  <li key={i}>
                    <span>{dataHora(l.t)}</span>
                    <span>{ROTULO_ORIGEM[l.origem]}</span>
                    <strong>{l.v}%</strong>
                  </li>
                ))}
            </ul>

            <h3>Anotações</h3>
            <form
              className="nota-form"
              onSubmit={(ev) => {
                ev.preventDefault();
                if (!texto.trim()) return;
                onNota(texto.trim());
                setTexto("");
              }}
            >
              <input value={texto} onChange={(ev) => setTexto(ev.target.value)} placeholder="Ex.: Adubo aplicado hoje" />
              <button type="submit" className="secundario">
                Adicionar
              </button>
            </form>
            {horta.notas.length === 0 && <p className="meta">Nenhuma anotação ainda.</p>}
            <ul className="notas">
              {horta.notas.map((n) => (
                <li key={n.id}>
                  <div>
                    <span>{n.texto}</span>
                    <span className="meta"> {dataHora(n.t)}</span>
                  </div>
                  <button className="link" onClick={() => onRemoverNota(n.id)} aria-label="Remover anotação">
                    Apagar
                  </button>
                </li>
              ))}
            </ul>

            <div className="linha-botoes">
              <button className="link" onClick={onEditar}>
                Editar horta
              </button>
              <button className="link perigo" onClick={onRemover}>
                Remover horta
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="solo" role="img" aria-label={`Umidade do solo: ${u.v}%`}>
        <div className="faixa-ideal" style={{ bottom: `${f.min}%`, height: `${f.max - f.min}%` }} />
        <div className="agua" style={{ height: `${u.v}%` }} />
      </div>
    </article>
  );
}
