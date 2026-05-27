import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const marketItems = [
  { name: 'BITCOIN', symbol: 'BTC', price: '$64,281.40', change: '+2.4%', positive: true },
  { name: 'ETHEREUM', symbol: 'ETH', price: '$3,452.12', change: '+1.8%', positive: true },
  { name: 'SOLANA', symbol: 'SOL', price: '$142.85', change: '-0.5%', positive: false },
  { name: 'S&P 500', symbol: 'SPX', price: '5,234.10', change: '+0.3%', positive: true },
]

function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <Link to="/" className="landing-brand" aria-label="Mundo Invest">
          <img src="/mundo-invest-logo-cutout.png" alt="Mundo Invest" />
        </Link>

        <nav aria-label="Navegacao principal">
          <a href="#markets">Markets</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#ai-advisor">AI Advisor</a>
          <a href="#insights">Insights</a>
        </nav>

        <div className="landing-nav-actions">
          <Link to="/login">Sign In</Link>
          <Link to="/signup" className="landing-nav-cta">Get Started</Link>
        </div>
      </header>

      <section className="landing-hero">
        <span className="landing-pill">
          <i />
          Inteligencia artificial ativa
        </span>
        <h1>Invista com clareza.</h1>
        <p>
          Decisoes guiadas por dados, nao por impulsos. Visualize mercado,
          carteira e riscos antes de criar sua conta.
        </p>
        <div className="landing-hero-actions">
          <Link to="/signup" className="landing-primary">Comecar agora</Link>
          <a href="#preview" className="landing-secondary">Ver demonstracao</a>
        </div>
      </section>

      <section className="market-ticker" id="markets" aria-label="Precos do mercado">
        {marketItems.map((item) => (
          <article key={item.symbol}>
            <span>{item.name}</span>
            <strong>{item.symbol} {item.price}</strong>
            <small className={item.positive ? 'ticker-up' : 'ticker-down'}>{item.change}</small>
          </article>
        ))}
      </section>

      <section className="landing-product-grid" id="preview">
        <article className="landing-feature-card ai-card" id="ai-advisor">
          <div className="feature-icon">AI</div>
          <h2>Chat IA de Elite</h2>
          <p>
            Tire duvidas complexas sobre ativos, risco e cenarios. Receba
            resumos executivos dos principais eventos do mercado em segundos.
          </p>
          <a href="#advisor-preview">Explore o AI Assistant</a>
        </article>

        <article className="landing-feature-card dashboard-card" id="portfolio">
          <div>
            <div className="feature-icon teal">MI</div>
            <h2>Dashboard Unificado</h2>
            <p>
              Visualize investimentos, criptoativos, perfil de risco e carteira
              sugerida em uma interface fluida e profissional.
            </p>
          </div>
          <div className="mini-dashboard-shot" aria-hidden="true">
            <div />
            <span />
            <span />
          </div>
        </article>

        <article className="landing-feature-card simulation-card">
          <div className="feature-icon purple">%</div>
          <h2>Simulacao Avancada</h2>
          <p>
            Projete o futuro do seu patrimonio com algoritmos de risco,
            cenarios macroeconomicos e distribuicao inteligente.
          </p>
          <div className="simulation-meter">
            <span>Cenario moderado</span>
            <strong>+12.4% aa</strong>
            <div><i /></div>
          </div>
        </article>
      </section>

      <section className="landing-preview-section" id="advisor-preview">
        <div className="section-heading">
          <span>Previews antes do cadastro</span>
          <h2>Veja como a plataforma se comporta na pratica</h2>
        </div>

        <div className="preview-showcase-grid">
          <article className="advisor-preview">
            <div className="preview-window-top">
              <span>Mundo AI</span>
              <small>Advisor ativo</small>
            </div>
            <h3>How can I help your <strong>Portfolio</strong> today?</h3>
            <p>Acesse insights em tempo real e analise preditiva do mercado global.</p>

            <div className="advisor-message">
              <span className="assistant-orb">AI</span>
              <div>
                <p>
                  Ola! Notei volatilidade moderada em tecnologia. Seu perfil de
                  risco atual esta em <strong>Moderado</strong>.
                </p>
                <div className="market-insight">
                  <strong>Market Insight</strong>
                  <span>BTC subiu 2.4% no pre-mercado. Deseja revisar sua exposicao?</span>
                </div>
              </div>
            </div>

            <div className="user-message">
              Como esta o mercado hoje e qual o impacto nas minhas posicoes?
            </div>

            <div className="advisor-input flex items-center gap-2">
              <span>Analisar meu risco</span>
              <Button variant="primary" aria-label="Enviar">›</Button>
            </div>
          </article>

          <article className="dashboard-preview">
            <aside className="preview-sidebar">
              <img src="/mundo-invest-logo-cutout.png" alt="" />
              <span className="active" />
              <span />
              <span />
              <span />
            </aside>

            <div className="dashboard-preview-content">
              <header>
                <div>
                  <h3>Ola, investidor.</h3>
                  <p>Sua jornada financeira esta em evolucao constante.</p>
                </div>
                <div className="profile-toggle">
                  <span>Conservador</span>
                  <strong>Moderado</strong>
                  <span>Agressivo</span>
                </div>
              </header>

              <div className="dashboard-preview-main">
                <div className="chart-card-preview">
                  <span>Performance do mercado</span>
                  <h4>BTC / ETH <strong>+12.4%</strong></h4>
                  <div className="chart-surface">
                    <i className="chart-line-primary" />
                    <i className="chart-line-secondary" />
                    <b>BTC Price<br />$64,281.00</b>
                  </div>
                </div>

                <div className="watchlist-card-preview">
                  <div className="watchlist-header">
                    <h4>Watchlist</h4>
                    <span>Ver todos</span>
                  </div>
                  {['Bitcoin', 'Ethereum', 'Solana'].map((asset, index) => (
                    <div className="watch-row" key={asset}>
                      <i>{asset[0]}</i>
                      <div>
                        <strong>{asset}</strong>
                        <span>{index === 0 ? 'BTC' : index === 1 ? 'ETH' : 'SOL'} / USDT</span>
                      </div>
                      <small className={index === 1 ? 'ticker-down' : 'ticker-up'}>
                        {index === 1 ? '-1.20%' : '+2.45%'}
                      </small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="portfolio-preview-card" id="insights">
                <div>
                  <h4>Carteira Sugerida</h4>
                  <p>
                    Baseado no perfil <strong>Moderado</strong>, nossa IA recalibrou
                    sua distribuicao ideal para controle de drawdown.
                  </p>
                  <div className="allocation-grid">
                    <span>Cripto Blue Chips <strong>45%</strong></span>
                    <span>Renda Fixa Global <strong>30%</strong></span>
                    <span>Small Caps <strong>15%</strong></span>
                    <span>Liquidez <strong>10%</strong></span>
                  </div>
                </div>
                <div className="ai-score-ring">
                  <span>Score IA</span>
                  <strong>8.4</strong>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="landing-cta">
        <h2>Pronto para elevar seu patamar?</h2>
        <p>
          Junte-se a investidores que usam dados, IA e gestao de risco para tomar
          decisoes melhores.
        </p>
        <form className="flex items-center gap-3">
          <Input type="email" placeholder="Seu melhor e-mail" aria-label="Seu melhor email" className="flex-1" />
          <Link to="/signup"><Button variant="primary">Criar conta grátis</Button></Link>
        </form>
        <span>Sem cartao de credito necessario</span>
      </section>

      <footer className="landing-footer">
        <div>
          <img src="/mundo-invest-logo-cutout.png" alt="Mundo Invest" />
          <p>
            A plataforma definitiva para o investidor moderno. Tecnologia de ponta
            aliada a seguranca institucional.
          </p>
        </div>
        <nav>
          <strong>Produto</strong>
          <a href="#preview">Funcionalidades</a>
          <a href="#advisor-preview">Simulador</a>
          <Link to="/signup">Planos</Link>
        </nav>
        <nav>
          <strong>Legal</strong>
          <a href="#risk">Privacy Policy</a>
          <a href="#risk">Terms of Service</a>
          <a href="#risk">Security</a>
        </nav>
        <p id="risk" className="risk-copy">
          Aviso de risco: investimentos em ativos financeiros e criptoativos envolvem
          riscos significativos. A Mundo Invest atua como ferramenta de analise e
          auxilio a decisao, nao constituindo recomendacao direta de compra ou venda.
        </p>
      </footer>
    </main>
  )
}

export default LandingPage
