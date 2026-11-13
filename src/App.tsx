import { useEffect, useMemo, useRef, useState } from "react";
import HortaCard from "./components/HortaCard";
import HortaForm, { DadosForm } from "./components/HortaForm";
import { notificar, pedirPermissao } from "./alertas";
import { carregar, carregarAlertas, salvar, salvarAlertas } from "./store";
import type { Horta, Origem } from "./types";
import { atual, estado, limitar, TEXTO } from "./utils";

type Filtro = "todas" | "atencao" | "ideais";

export default function App() {
  const [hortas, setHortas] = useState<Horta[]>(carregar);
  const [alertas, setAlertas] = useState<boolean>(carregarAlertas);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [aviso, setAviso] = useState("");
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => salvar(hortas), [hortas]);

  function mostrarAviso(msg: string) {
    setAviso(msg);
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setAviso(""), 4000);
  }

  function alternarAlertas() {
    if (alertas) {
      setAlertas(false);
      salvarAlertas(false);
      mostrarAviso("Alertas desligados.");
      return;
    }
    pedirPermissao().then((ok) => {
      setAlertas(ok);
      salvarAlertas(ok);
      mostrarAviso(ok ? "Alertas ligados: você será avisado quando uma horta precisar de atenção." : "Permissão de notificações negada.");
    });
  }

  function aplicarLeituras(mudancas: { id: number; v: number; origem: Origem }[]) {
    const agora = new Date().toISOString();
    const avisos: string[] = [];
    const proximas = hortas.map((h) => {
      const m = mudancas.find((x) => x.id === h.id);
      if (!m) return h;
      const nova: Horta = {
        ...h,
        leituras: [...h.leituras, { t: agora, v: limitar(m.v), origem: m.origem }].slice(-60)
      };
      const antes = estado(h);
      const depois = estado(nova);
      if (depois !== antes && depois !== "ideal") avisos.push(`${h.nome}: ${TEXTO[depois].rotulo.toLowerCase()}. ${TEXTO[depois].dica}.`);
      return nova;
    });
    setHortas(proximas);
    if (alertas && avisos.length > 0) {
      mostrarAviso(avisos[0]);
      avisos.forEach((a) => notificar("AgroTech", a));
    }
  }

  const leitura = (id: number, v: number, origem: Origem) => aplicarLeituras([{ id, v, origem }]);
  const regar = (h: Horta) => leitura(h.id, atual(h).v + 25, "rega");

  function simularSensores() {
    aplicarLeituras(hortas.map((h) => ({ id: h.id, v: atual(h).v + Math.round(Math.random() * 30 - 18), origem: "sensor" as const })));
    mostrarAviso("Leituras simuladas registradas em todas as hortas.");
  }

  function cadastrar(d: DadosForm) {
    setHortas([
      ...hortas,
      {
        id: Date.now(),
        nome: d.nome,
        local: d.local,
        cultura: d.cultura,
        leituras: [{ t: new Date().toISOString(), v: d.umidade, origem: "manual" }],
        notas: []
      }
    ]);
    mostrarAviso("Horta cadastrada.");
  }

  function editar(id: number, d: DadosForm) {
    setHortas(hortas.map((h) => (h.id === id ? { ...h, nome: d.nome, local: d.local, cultura: d.cultura } : h)));
    setEditando(null);
    mostrarAviso("Horta atualizada.");
  }

  function remover(h: Horta) {
    if (window.confirm(`Remover "${h.nome}"? O histórico será apagado.`)) setHortas(hortas.filter((x) => x.id !== h.id));
  }

  function adicionarNota(id: number, texto: string) {
    setHortas(hortas.map((h) => (h.id === id ? { ...h, notas: [{ id: Date.now(), t: new Date().toISOString(), texto }, ...h.notas] } : h)));
  }

  function removerNota(id: number, notaId: number) {
    setHortas(hortas.map((h) => (h.id === id ? { ...h, notas: h.notas.filter((n) => n.id !== notaId) } : h)));
  }

  const secas = hortas.filter((h) => estado(h) === "seca");
  const encharcadas = hortas.filter((h) => estado(h) === "encharcada");
  const atencao = secas.length + encharcadas.length;
  const media = hortas.length ? Math.round(hortas.reduce((s, h) => s + atual(h).v, 0) / hortas.length) : 0;

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return hortas.filter((h) => {
      const e = estado(h);
      if (filtro === "atencao" && e === "ideal") return false;
      if (filtro === "ideais" && e !== "ideal") return false;
      return !termo || `${h.nome} ${h.local} ${h.cultura}`.toLowerCase().includes(termo);
    });
  }, [hortas, filtro, busca]);

  const emEdicao = hortas.find((h) => h.id === editando);

  return (
    <main className="app">
      <header className="topo">
        <h1>AgroTech</h1>
        <p className="resumo">
          {hortas.length === 0
            ? "Nenhuma horta cadastrada."
            : atencao === 0
            ? `Todas as hortas estão com umidade ideal. Média geral: ${media}%.`
            : `${atencao} de ${hortas.length} ${hortas.length === 1 ? "horta precisa" : "hortas precisam"} de atenção. Média geral: ${media}%.`}
        </p>
        {secas.length > 0 && <p className="regar">Regar hoje: {secas.map((h) => h.nome).join(", ")}</p>}
        {encharcadas.length > 0 && <p className="regar azul">Suspender a rega: {encharcadas.map((h) => h.nome).join(", ")}</p>}
        <div className="linha-botoes">
          <button className="secundario" onClick={simularSensores} disabled={hortas.length === 0}>
            Simular sensores
          </button>
          <button className="secundario" onClick={alternarAlertas} aria-pressed={alertas}>
            Alertas: {alertas ? "ligados" : "desligados"}
          </button>
        </div>
      </header>

      {aviso && (
        <p className="aviso" role="status">
          {aviso}
        </p>
      )}

      <div className="filtros">
        <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, local ou cultura" aria-label="Buscar hortas" />
        <div className="chips" role="group" aria-label="Filtrar por situação">
          {([
            ["todas", `Todas (${hortas.length})`],
            ["atencao", `Atenção (${atencao})`],
            ["ideais", `Ideais (${hortas.length - atencao})`]
          ] as [Filtro, string][]).map(([chave, rotulo]) => (
            <button key={chave} className={filtro === chave ? "chip ativo" : "chip"} onClick={() => setFiltro(chave)}>
              {rotulo}
            </button>
          ))}
        </div>
      </div>

      <section className="lista" aria-label="Hortas">
        {visiveis.length === 0 && <p className="vazio">{hortas.length === 0 ? "Cadastre a primeira horta no formulário abaixo." : "Nenhuma horta encontrada com esse filtro."}</p>}
        {visiveis.map((h) => (
          <HortaCard
            key={h.id}
            horta={h}
            onLeitura={(v, origem) => leitura(h.id, v, origem)}
            onRegar={() => regar(h)}
            onEditar={() => setEditando(h.id)}
            onRemover={() => remover(h)}
            onNota={(t) => adicionarNota(h.id, t)}
            onRemoverNota={(n) => removerNota(h.id, n)}
          />
        ))}
      </section>

      {emEdicao ? (
        <HortaForm key={emEdicao.id} inicial={emEdicao} onSalvar={(d) => editar(emEdicao.id, d)} onCancelar={() => setEditando(null)} />
      ) : (
        <HortaForm onSalvar={cadastrar} />
      )}

      <p className="legenda">As faixas de umidade por cultura são valores de referência aproximados.</p>
    </main>
  );
}
