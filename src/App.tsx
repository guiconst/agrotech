import { useEffect, useState } from "react";

type Horta = {
  id: number;
  nome: string;
  local: string;
  umidade: number;
  atualizadoEm: string;
};

const STORAGE_KEY = "agrotech:hortas";

const INICIAIS: Horta[] = [
  { id: 1, nome: "Horta do Jardim Primavera", local: "Rua das Acácias", umidade: 54, atualizadoEm: new Date().toISOString() },
  { id: 2, nome: "Horta da Escola Municipal", local: "Vila Esperança", umidade: 22, atualizadoEm: new Date().toISOString() },
  { id: 3, nome: "Horta Comunitária do Centro", local: "Praça da Matriz", umidade: 78, atualizadoEm: new Date().toISOString() }
];

function status(u: number) {
  if (u < 30) return { chave: "seca", texto: "Seca", dica: "Regar hoje" };
  if (u > 70) return { chave: "encharcada", texto: "Encharcada", dica: "Suspender a rega" };
  return { chave: "ideal", texto: "Ideal", dica: "Sem ação necessária" };
}

function hora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function carregar(): Horta[] {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? (JSON.parse(salvo) as Horta[]) : INICIAIS;
  } catch {
    return INICIAIS;
  }
}

export default function App() {
  const [hortas, setHortas] = useState<Horta[]>(carregar);
  const [nome, setNome] = useState("");
  const [local, setLocal] = useState("");
  const [umidade, setUmidade] = useState(50);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hortas));
    } catch {
      /* sem armazenamento disponível */
    }
  }, [hortas]);

  const ideais = hortas.filter((h) => status(h.umidade).chave === "ideal").length;
  const atencao = hortas.length - ideais;

  function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setHortas([
      ...hortas,
      { id: Date.now(), nome: nome.trim(), local: local.trim() || "Local não informado", umidade, atualizadoEm: new Date().toISOString() }
    ]);
    setNome("");
    setLocal("");
    setUmidade(50);
  }

  function atualizar(id: number, valor: number) {
    setHortas(hortas.map((h) => (h.id === id ? { ...h, umidade: valor, atualizadoEm: new Date().toISOString() } : h)));
  }

  function remover(id: number) {
    setHortas(hortas.filter((h) => h.id !== id));
  }

  return (
    <main className="app">
      <header className="topo">
        <h1>AgroTech</h1>
        <p className="resumo">
          {hortas.length === 0
            ? "Nenhuma horta cadastrada."
            : atencao === 0
            ? "Todas as hortas estão com umidade ideal."
            : `${atencao} de ${hortas.length} ${hortas.length === 1 ? "horta precisa" : "hortas precisam"} de atenção.`}
        </p>
      </header>

      <section className="lista" aria-label="Hortas">
        {hortas.length === 0 && <p className="vazio">Cadastre a primeira horta no formulário abaixo.</p>}
        {hortas.map((h) => {
          const s = status(h.umidade);
          return (
            <article key={h.id} className={`horta ${s.chave}`}>
              <div className="horta-info">
                <h2>{h.nome}</h2>
                <p className="local">{h.local}</p>
                <p className="leitura">
                  <strong>{h.umidade}%</strong> <span className="selo">{s.texto}</span>
                </p>
                <p className="dica">{s.dica}</p>
                <label className="ajuste">
                  <span>Nova leitura</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={h.umidade}
                    onChange={(e) => atualizar(h.id, Number(e.target.value))}
                  />
                </label>
                <p className="meta">Atualizado em {hora(h.atualizadoEm)}</p>
                <button className="remover" onClick={() => remover(h.id)}>
                  Remover horta
                </button>
              </div>
              <div className="solo" role="img" aria-label={`Umidade do solo: ${h.umidade}%`}>
                <div className="faixa-ideal" />
                <div className="agua" style={{ height: `${h.umidade}%` }} />
              </div>
            </article>
          );
        })}
      </section>

      <form className="novo" onSubmit={adicionar}>
        <h2>Cadastrar horta</h2>
        <label>
          Nome
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Horta da Rua 7" required />
        </label>
        <label>
          Local
          <input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Bairro ou endereço" />
        </label>
        <label>
          Umidade inicial: {umidade}%
          <input type="range" min={0} max={100} value={umidade} onChange={(e) => setUmidade(Number(e.target.value))} />
        </label>
        <button type="submit" className="salvar">
          Salvar horta
        </button>
      </form>

      <p className="legenda">Faixa ideal de umidade do solo: 30% a 70%.</p>
    </main>
  );
}
