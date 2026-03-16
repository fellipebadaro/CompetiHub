/* ============================================================
   Competi – site.js  (versão aprimorada)
   Inclui: nav, FAQ, scroll reveal, carrossel, simulador de planos
   ============================================================ */

/* ---------- utilitários ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- nav mobile ---------- */
const menuBtn  = $('#menuBtn');
const mainNav  = $('#mainNav');
const navLinks = $$('a', mainNav);
const sections = $$('[data-page]');
const toTop    = $('#toTop');

menuBtn?.addEventListener('click', () => mainNav.classList.toggle('open'));
navLinks.forEach(l => l.addEventListener('click', () => mainNav.classList.remove('open')));

const setActiveLink = () => {
  const scrollY = window.scrollY + 140;
  let current = sections[0]?.id || 'home';
  sections.forEach(s => { if (scrollY >= s.offsetTop) current = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
};

window.addEventListener('scroll', () => {
  setActiveLink();
  toTop.classList.toggle('show', window.scrollY > 420);
}, { passive: true });

setActiveLink();
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- FAQ ---------- */
$$('.faq-item').forEach(item => {
  item.querySelector('.faq-question')?.addEventListener('click', () => {
    const open = item.classList.contains('open');
    $$('.faq-item').forEach(f => f.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

/* ---------- formulário de contato ---------- */
const contactForm = $('#contactForm');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('[type="submit"]');
  btn.textContent = 'Mensagem enviada!';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  contactForm.reset();
  setTimeout(() => { btn.textContent = 'Enviar mensagem'; btn.disabled = false; btn.style.opacity = ''; }, 3000);
});

/* ============================================================
   SCROLL REVEAL
   Anima elementos ao entrar na viewport
   ============================================================ */
(function initScrollReveal() {
  const CLASSES = {
    fade:       'sr-fade',
    slideUp:    'sr-up',
    slideLeft:  'sr-left',
    slideRight: 'sr-right',
    scaleIn:    'sr-scale',
  };

  /* injeta CSS de animação uma única vez */
  const style = document.createElement('style');
  style.textContent = `
    .sr-fade, .sr-up, .sr-left, .sr-right, .sr-scale {
      opacity: 0;
      transition: opacity 0.65s cubic-bezier(.22,.68,0,1.2),
                  transform 0.65s cubic-bezier(.22,.68,0,1.2);
      will-change: opacity, transform;
    }
    .sr-up    { transform: translateY(36px); }
    .sr-left  { transform: translateX(-36px); }
    .sr-right { transform: translateX(36px); }
    .sr-scale { transform: scale(0.88); }
    .sr-visible {
      opacity: 1 !important;
      transform: none !important;
    }
  `;
  document.head.appendChild(style);

  /* atribui classes de animação aos elementos */
  const map = [
    { sel: '.hero-copy',            cls: 'sr-fade',  delay: 0   },
    { sel: '.hero-card',            cls: 'sr-scale', delay: 150 },
    { sel: '.eyebrow',              cls: 'sr-left',  delay: 0   },
    { sel: '.section-head h2',      cls: 'sr-up',    delay: 0   },
    { sel: '.section-head p',       cls: 'sr-up',    delay: 80  },
    { sel: '.card.metric',          cls: 'sr-up',    delay: 0   },
    { sel: '.feature-card',         cls: 'sr-up',    delay: 0   },
    { sel: '.persona-card',         cls: 'sr-up',    delay: 0   },
    { sel: '.pricing-card',         cls: 'sr-up',    delay: 0   },
    { sel: '.faq-item',             cls: 'sr-up',    delay: 0   },
    { sel: '.showcase-copy',        cls: 'sr-left',  delay: 0   },
    { sel: '.showcase-image-card',  cls: 'sr-right', delay: 100 },
    { sel: '.contact-card',         cls: 'sr-up',    delay: 0   },
    { sel: '.quote-box',            cls: 'sr-fade',  delay: 0   },
  ];

  map.forEach(({ sel, cls }) => {
    $$(sel).forEach((el, i) => {
      el.classList.add(cls);
      /* escalonamento por grupos (irmãos) */
      const siblings = $$(`${sel}`).filter(s => s.parentElement === el.parentElement);
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 80}ms`;
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('sr-visible');
        io.unobserve(target);
      }
    });
  }, { threshold: 0.12 });

  $$('.sr-fade, .sr-up, .sr-left, .sr-right, .sr-scale').forEach(el => io.observe(el));
})();

/* ============================================================
   CARROSSEL DE DEPOIMENTOS
   Injeta a seção inteira antes do footer
   ============================================================ */
(function initTestimonials() {
  const depoimentos = [
    {
      nome:  'Rafael Monteiro',
      cargo: 'Organizador — Liga Aquática SP',
      texto: 'Antes do Competi eu controlava inscrição em planilha. Hoje tenho tudo centralizado e o check-in no dia do evento ficou dez vezes mais rápido.',
      inicial: 'RM',
    },
    {
      nome:  'Juliana Farias',
      cargo: 'Técnica — Clube Neptuno',
      texto: 'Meus atletas não me ligam mais perguntando onde estão os resultados. Tudo fica publicado em tempo real. Parece simples, mas faz uma diferença enorme.',
      inicial: 'JF',
    },
    {
      nome:  'Carlos Augusto',
      cargo: 'Diretor Esportivo — Federação Regional',
      texto: 'A plataforma entregou uma operação mais profissional sem precisar de uma equipe de TI dedicada. A credibilidade do evento aumentou visivelmente.',
      inicial: 'CA',
    },
    {
      nome:  'Mariana Silva',
      cargo: 'Atleta — categoria master',
      texto: 'Fiz minha inscrição, recebi confirmação imediata e fiquei acompanhando a agenda pelo celular. Zero estresse antes da competição.',
      inicial: 'MS',
    },
  ];

  const html = `
  <section class="section testimonials-section" id="depoimentos" data-page="Depoimentos">
    <div class="container">
      <div class="section-head">
        <h2>Quem já está competindo com a Competi</h2>
        <p>Organizadores, técnicos e atletas que transformaram sua operação.</p>
      </div>
      <div class="tcarousel" aria-label="Depoimentos">
        <div class="tcarousel-track" id="tcarouselTrack">
          ${depoimentos.map((d, i) => `
          <article class="tcard" aria-hidden="${i > 0}" role="group" aria-label="Depoimento ${i + 1} de ${depoimentos.length}">
            <div class="tcard-quote">"${d.texto}"</div>
            <div class="tcard-author">
              <div class="tcard-avatar" aria-hidden="true">${d.inicial}</div>
              <div>
                <strong class="tcard-name">${d.nome}</strong>
                <span class="tcard-role">${d.cargo}</span>
              </div>
            </div>
          </article>`).join('')}
        </div>
        <div class="tcarousel-controls">
          <button class="tcarousel-btn" id="tPrev" aria-label="Anterior">&#8592;</button>
          <div class="tcarousel-dots" id="tDots" role="tablist">
            ${depoimentos.map((_, i) => `<button class="tdot${i === 0 ? ' active' : ''}" data-index="${i}" role="tab" aria-label="Depoimento ${i + 1}" aria-selected="${i === 0}"></button>`).join('')}
          </div>
          <button class="tcarousel-btn" id="tNext" aria-label="Próximo">&#8594;</button>
        </div>
      </div>
    </div>
  </section>`;

  const footer = $('footer.footer');
  if (footer) footer.insertAdjacentHTML('beforebegin', html);

  /* lógica do carrossel */
  let current = 0;
  const total   = depoimentos.length;
  const track   = $('#tcarouselTrack');
  const dots    = $$('.tdot');
  const cards   = $$('.tcard');

  function goTo(idx) {
    cards[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    cards[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  $('#tNext')?.addEventListener('click', () => goTo(current + 1));
  $('#tPrev')?.addEventListener('click', () => goTo(current - 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.index)));

  /* swipe touch */
  let touchStartX = 0;
  track?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track?.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  /* autoplay acessível: pausa no hover/foco */
  let timer = setInterval(() => goTo(current + 1), 5000);
  const section = $('#depoimentos');
  section?.addEventListener('mouseenter', () => clearInterval(timer));
  section?.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(current + 1), 5000); });
  section?.addEventListener('focusin',  () => clearInterval(timer));
  section?.addEventListener('focusout', () => { timer = setInterval(() => goTo(current + 1), 5000); });
})();

/* ============================================================
   SIMULADOR DE PLANOS
   Injeta calculadora interativa na seção de planos
   ============================================================ */
(function initPlanSimulator() {
  const planos = [
    { id: 'basico',        nome: 'Básico',       mensalidade: 149,  taxa: 0.0149, limite: 200  },
    { id: 'intermediario', nome: 'Intermediário', mensalidade: 349,  taxa: 0.0119, limite: 800  },
    { id: 'avancado',      nome: 'Avançado',      mensalidade: 799,  taxa: 0.0089, limite: 2500 },
  ];

  const valorMedioInscricao = 120; /* R$ — valor de referência */

  const simulatorHTML = `
  <div class="simulator" id="planSimulator" role="region" aria-label="Simulador de planos">
    <div class="simulator-head">
      <h3 class="simulator-title">Simule o custo do seu evento</h3>
      <p class="simulator-sub">Informe o número de inscrições pagas esperadas por mês e veja qual plano faz mais sentido.</p>
    </div>

    <div class="sim-controls">
      <label class="sim-label" for="simInscricoes">Inscrições pagas válidas por mês</label>
      <div class="sim-range-wrap">
        <input
          type="range"
          id="simInscricoes"
          class="sim-range"
          min="10"
          max="2500"
          step="10"
          value="200"
          aria-valuemin="10"
          aria-valuemax="2500"
          aria-valuenow="200"
        />
        <div class="sim-range-labels">
          <span>10</span><span>2.500</span>
        </div>
      </div>
      <div class="sim-value-display">
        <strong id="simQtd">200</strong> inscrições
      </div>
    </div>

    <div class="sim-valor-wrap">
      <label class="sim-label" for="simValor">Valor médio por inscrição (R$)</label>
      <input type="number" id="simValor" class="input sim-input-valor" value="120" min="1" max="9999" step="1" />
    </div>

    <div class="sim-results" id="simResults" aria-live="polite"></div>

    <p class="sim-disclaimer">* Estimativa baseada nos planos publicados. Taxas do parceiro de pagamento não estão incluídas.</p>
  </div>`;

  /* insere após a tabela de planos */
  const tableWrap = $('.table-wrap');
  if (tableWrap) tableWrap.insertAdjacentHTML('afterend', simulatorHTML);

  const rangeEl  = $('#simInscricoes');
  const qtdLabel = $('#simQtd');
  const valorEl  = $('#simValor');
  const results  = $('#simResults');

  function fmt(n) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
  }

  function calcular() {
    const qtd   = parseInt(rangeEl.value,  10) || 0;
    const valor = parseFloat(valorEl.value) || valorMedioInscricao;

    qtdLabel.textContent = qtd.toLocaleString('pt-BR');
    rangeEl.setAttribute('aria-valuenow', qtd);

    const cards = planos.map(p => {
      const taxaCompeti   = qtd * valor * p.taxa;
      const totalMes      = p.mensalidade + taxaCompeti;
      const acimaDolimite = qtd > p.limite;
      const recomendado   = !acimaDolimite && planos.filter(x => x.limite >= qtd).indexOf(p) === 0;

      return { ...p, taxaCompeti, totalMes, acimaDolimite, recomendado };
    });

    results.innerHTML = cards.map(c => `
      <div class="sim-card${c.recomendado ? ' sim-card--rec' : ''}${c.acimaDolimite ? ' sim-card--over' : ''}">
        ${c.recomendado ? '<div class="sim-badge-rec">Plano recomendado</div>' : ''}
        ${c.acimaDolimite ? '<div class="sim-badge-over">Limite excedido</div>' : ''}
        <div class="sim-card-title">${c.nome}</div>
        <div class="sim-card-price">${fmt(c.totalMes)}<span>/mês</span></div>
        <ul class="sim-card-detail">
          <li><span>Mensalidade</span><strong>${fmt(c.mensalidade)}</strong></li>
          <li><span>Taxa Competi (${(c.taxa * 100).toFixed(2)}%)</span><strong>${fmt(c.taxaCompeti)}</strong></li>
          <li class="sim-total-row"><span>Total estimado</span><strong>${fmt(c.totalMes)}</strong></li>
        </ul>
      </div>`).join('');
  }

  rangeEl?.addEventListener('input', calcular);
  valorEl?.addEventListener('input', calcular);

  /* inicia com valores padrão */
  calcular();
})();
