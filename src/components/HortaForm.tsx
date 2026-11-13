import { useState } from "react";
import { CULTURAS } from "../culturas";

export type DadosForm = { nome: string; local: string; cultura: string; umidade: number };
type Props = {
  inicial?: { nome: string; local: string; cultura: string };
  onSalvar: (d: DadosForm) => void;
  onCancelar?: () => void;
};

export default function HortaForm({ inicial, onSalvar, onCancelar }: Props) {
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [local, setLocal] = useState(inicial?.local ?? "");
  const [cultura, setCultura] = useState(inicial?.cultura ?? "Geral");
  const [umidade, setUmidade] = useState(50);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    onSalvar({ nome: nome.trim(), local: local.trim() || "Local não informado", cultura, umidade });
    if (!inicial) {
      setNome("");
      setLocal("");
      setCultura("Geral");
      setUmidade(50);
    }
  }

  const f = CULTURAS[cultura];
  return (
    <form className="novo" onSubmit={enviar}>
      <h2>{inicial ? "Editar horta" : "Cadastrar horta"}</h2>
      <label>
        Nome
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Horta da Rua 7" required />
      </label>
      <label>
        Local
        <input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Bairro ou endereço" />
      </label>
      <label>
        Cultura
        <select value={cultura} onChange={(e) => setCultura(e.target.value)}>
          {Object.keys(CULTURAS).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <span className="meta">Umidade ideal: {f.min}% a {f.max}%</span>
      </label>
      {!inicial && (
        <label>
          Umidade inicial: {umidade}%
          <input type="range" min={0} max={100} value={umidade} onChange={(e) => setUmidade(Number(e.target.value))} />
        </label>
      )}
      <div className="linha-botoes">
        <button type="submit" className="salvar">
          Salvar horta
        </button>
        {onCancelar && (
          <button type="button" className="secundario" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
