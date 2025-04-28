// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.main-nav');

mobileMenuBtn.addEventListener('click', () => {
  nav.classList.toggle('active');
  const isExpanded = nav.classList.contains('active');
  mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
});

// StyleMatch Quiz
const questionContainer = document.getElementById('questionContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const btnNext = document.getElementById('btnNext');
const btnBack = document.getElementById('btnBack');
const resultsModal = document.getElementById('resultsModal');
const resultsContent = document.getElementById('resultsContent');
const closeModal = document.getElementById('closeModal');
const btnRestart = document.getElementById('btnRestart');
let currentQuestion = 0;
let answers = {};

const questions = [
  {
    id: 'gender',
    title: 'Com qual gênero você mais se identifica?',
    type: 'option',
    options: [
      { text: 'Mulher', value: 'mulher' },
      { text: 'Homem', value: 'homem' },
      { text: 'Não-binário', value: 'nao-binario' }
    ]
  },
  {
    id: 'faceShape',
    title: 'Qual o formato predominante do seu rosto?',
    type: 'option',
    options: [
      { text: 'Oval (proporcional)', value: 'oval' },
      { text: 'Redondo (curvas suaves)', value: 'redondo' },
      { text: 'Quadrado (ângulos marcados)', value: 'quadrado' },
      { text: 'Retangular (comprido)', value: 'retangular' },
      { text: 'Triangular (queixo estreito)', value: 'triangular' },
      { text: 'Diamante (maior largura nos ossos)', value: 'diamante' },
      { text: 'Coração (testa larga, queixo pontudo)', value: 'coracao' }
    ]
  },
  {
    id: 'features',
    title: 'Quais seus traços faciais mais marcantes?',
    type: 'option',
    multiple: true,
    options: [
      { text: 'Olhos grandes', value: 'olhos-grandes' },
      { text: 'Nariz proeminente', value: 'nariz-proeminente' },
      { text: 'Lábios carnudos', value: 'labios-carnudos' },
      { text: 'Testa larga', value: 'testa-larga' },
      { text: 'Queixo forte', value: 'queixo-forte' },
      { text: 'Maçãs do rosto altas', value: 'macas-altas' }
    ]
  },
  {
    id: 'styleArchetype',
    title: 'Qual arquétipo de estilo mais combina com você?',
    type: 'option',
    options: [
      { text: 'Clássico (elegância atemporal)', value: 'classico' },
      { text: 'Romântico (suave e delicado)', value: 'romantico' },
      { text: 'Dramático (impactante e ousado)', value: 'dramatico' },
      { text: 'Natural (despojado e orgânico)', value: 'natural' },
      { text: 'Criativo (inovador e artístico)', value: 'criativo' },
      { text: 'Sedutor (sensual e misterioso)', value: 'sedutor' }
    ]
  },
  {
    id: 'contrast',
    title: 'Qual o nível de contraste entre seus traços?',
    type: 'option',
    options: [
      { text: 'Alto contraste (ex: pele clara + cabelo escuro)', value: 'alto' },
      { text: 'Médio contraste', value: 'medio' },
      { text: 'Baixo contraste (tons próximos)', value: 'baixo' }
    ]
  },
  {
    id: 'hairType',
    title: 'Qual a textura natural do seu cabelo?',
    type: 'option',
    options: [
      { text: 'Liso', value: 'liso' },
      { text: 'Ondulado', value: 'ondulado' },
      { text: 'Cacheado', value: 'cacheado' },
      { text: 'Crespo', value: 'crespo' }
    ]
  },
  {
    id: 'hairLength',
    title: 'Qual comprimento de cabelo você prefere?',
    type: 'option',
    options: [
      { text: 'Curto', value: 'curto' },
      {ხ: 'Médio', value: 'medio' },
      { text: 'Longo', value: 'longo' }
    ]
  },
  {
    id: 'colors',
    title: 'Quais cores você mais usa no guarda-roupa?',
    type: 'option',
    multiple: true,
    options: [
      { text: 'Neutras (preto, branco, cinza, bege)', value: 'neutras' },
      { text: 'Quentes (vermelho, laranja, amarelo)', value: 'quentes' },
      { text: 'Friais (azul, verde, roxo)', value: 'frias' },
      { text: 'Pastéis', value: 'pasteis' },
      { text: 'Vivas/fluorescentes', value: 'vivas' },
      { text: 'Terrosas', value: 'terrosas' }
    ]
  }
];

function renderQuestion() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute('aria-valuenow', progress);
  progressText.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
  
  const question = questions[currentQuestion];
  let questionHTML = `
    <div class="question-card">
      <h2 class="question-title">${question.title}</h2>
      <div class="options-container">
  `;
  
  if (question.type === 'option') {
    question.options.forEach(option => {
      const isSelected = question.multiple 
        ? (answers[question.id] && answers[question.id].includes(option.value))
        : (answers[question.id] === option.value);
      questionHTML += `
        <button class="option-btn ${isSelected ? 'selected' : ''}" 
                data-value="${option.value}"
                aria-pressed="${isSelected}">
          ${option.text}
        </button>
      `;
    });
  }
  
  questionHTML += `</div></div>`;
  questionContainer.innerHTML = questionHTML;

  if (question.type === 'option') {
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (question.multiple) {
          if (!answers[question.id]) answers[question.id] = [];
          const index = answers[question.id].indexOf(this.dataset.value);
          if (index === -1) {
            answers[question.id].push(this.dataset.value);
            this.classList.add('selected');
            this.setAttribute('aria-pressed', 'true');
          } else {
            answers[question.id].splice(index, 1);
            this.classList.remove('selected');
            this.setAttribute('aria-pressed', 'false');
          }
        } else {
          document.querySelectorAll('.option-btn').forEach(b => {
            b.classList.remove('selected');
            b.setAttribute('aria-pressed', 'false');
          });
          this.classList.add('selected');
          this.setAttribute('aria-pressed', 'true');
          answers[question.id] = this.dataset.value;
        }
        btnNext.disabled = question.multiple 
          ? (!answers[question.id] || answers[question.id].length === 0)
          : !answers[question.id];
      });
    });
  }
  
  btnBack.disabled = currentQuestion === 0;
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResults();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function showResults() {
  let resultsHTML = `
    <div class="result-item">
      <h3 class="result-title">Seu Perfil de Visagismo</h3>
      <p class="result-value">${getProfileDescription()}</p>
    </div>
    <div class="result-item">
      <h3 class="result-title">Formato do Rosto</h3>
      <p class="result-value">${answers.faceShape || 'Não informado'}</p>
    </div>
    <div class="result-item">
      <h3 class="result-title">Arquétipo de Estilo</h3>
      <p class="result-value">${answers.styleArchetype || 'Não informado'}</p>
    </div>
    <div class="result-item">
      <h3 class="result-title">Nível de Contraste</h3>
      <p class="result-value">${answers.contrast || 'Não informado'}</p>
    </div>
    <div class="result-item">
      <h3 class="result-title">Tipo e Comprimento de Cabelo</h3>
      <p class="result-value">${answers.hairType || 'Não informado'} - ${answers.hairLength || 'Não informado'}</p>
    </div>
    <div class="result-item">
      <h3 class="result-title">Cores Preferidas</h3>
      <p class="result-value">${answers.colors ? answers.colors.join(', ') : 'Não informado'}</p>
    </div>
    <div class="recommendation">
      <h3>Recomendações de Visagismo</h3>
  `;
  
  switch(answers.faceShape) {
    case 'redondo':
      resultsHTML += `<p><strong>Rosto Redondo:</strong> Se beneficia de cortes que criam ângulos e alongamento visual</p>`;
      resultsHTML += `<p>- Franjas laterais ou cortes assimétricos</p>`;
      resultsHTML += `<p>- Comprimentos médios a longos (acima do queixo)</p>`;
      resultsHTML += `<p>- Evite cortes arredondados ou bob cuts</p>`;
      break;
    case 'quadrado':
      resultsHTML += `<p><strong>Rosto Quadrado:</strong> Recomenda-se suavizar os ângulos marcantes</p>`;
      resultsHTML += `<p>- Franjas arredondadas ou cortes em camadas suaves</p>`;
      resultsHTML += `<p>- Volume na altura do queixo</p>`;
      resultsHTML += `<p>- Evite cortes retos ou franjas retas</p>`;
      break;
    case 'oval':
      resultsHTML += `<p><strong>Rosto Oval:</strong> O formato mais versátil e proporcional</p>`;
      resultsHTML += `<p>- Pode experimentar desde curtos pixie até longos layers</p>`;
      resultsHTML += `<p>- Evite volumes extremos em uma área só</p>`;
      break;
    case 'retangular':
      resultsHTML += `<p><strong>Rosto Retangular:</strong> Equilibrar o comprimento com volume lateral</p>`;
      resultsHTML += `<p>- Franjas cheias ou cortes com camadas suaves</p>`;
      resultsHTML += `<p>- Evite cortes muito longos sem volume</p>`;
      break;
    case 'triangular':
      resultsHTML += `<p><strong>Rosto Triangular:</strong> Suavizar o maxilar com volume no topo</p>`;
      resultsHTML += `<p>- Cortes com volume na parte superior</p>`;
      resultsHTML += `<p>- Evite cortes que enfatizem o maxilar</p>`;
      break;
    case 'diamante':
      resultsHTML += `<p><strong>Rosto Diamante:</strong> Destacar as maçãs do rosto</p>`;
      resultsHTML += `<p>- Cortes com textura nas laterais</p>`;
      resultsHTML += `<p>- Evite cortes muito curtos no topo</p>`;
      break;
    case 'coracao':
      resultsHTML += `<p><strong>Rosto Coração:</strong> Equilibrar a testa com o queixo</p>`;
      resultsHTML += `<p>- Franjas laterais e cortes com volume no queixo</p>`;
      resultsHTML += `<p>- Evite volume excessivo no topo</p>`;
      break;
  }
  
  if (answers.styleArchetype === 'classico') {
    resultsHTML += `<p><strong>Estilo Clássico:</strong> Elegância atemporal e estruturada</p>`;
    resultsHTML += `<p>- Cortes simétricos com linhas limpas</p>`;
    resultsHTML += `<p>- Tons naturais (castanhos, loiros naturais)</p>`;
  } else if (answers.styleArchetype === 'dramatico') {
    resultsHTML += `<p><strong>Estilo Dramático:</strong> Impacto visual e ousadia</p>`;
    resultsHTML += `<p>- Cortes geométricos com ângulos marcantes</p>`;
    resultsHTML += `<p>- Cores contrastantes (ex: mechas platinadas)</p>`;
  } else if (answers.styleArchetype === 'romantico') {
    resultsHTML += `<p><strong>Estilo Romântico:</strong> Movimento e suavidade</p>`;
    resultsHTML += `<p>- Ondas naturais e camadas fluidas</p>`;
    resultsHTML += `<p>- Tons quentes (caramelos, vermelhos profundos)</p>`;
  }
  
  if (answers.contrast === 'alto') {
    resultsHTML += `<p><strong>Alto Contraste:</strong> Permite combinações ousadas</p>`;
    resultsHTML += `<p>- Cores vibrantes e contrastes marcantes</p>`;
  } else if (answers.contrast === 'baixo') {
    resultsHTML += `<p><strong>Baixo Contraste:</strong> Harmonia e gradientes suaves</p>`;
    resultsHTML += `<p>- Tons próximos na mesma família cromática</p>`;
  }
  
  resultsHTML += `
    </div>
    <div class="visual-examples">
      <h3>Inspirações para Você</h3>
      <div class="example-grid">
        <img src="https://i.pinimg.com/736x/ff/dc/7b/ffdc7b8287c18ce8442ff550bfb1ac5b.jpg" alt="Exemplo de corte para ${answers.faceShape || 'rosto'}">
        <img src="https://i.pinimg.com/736x/fd/df/12/fddf1222ec90fae02a250f159e4a6663.jpg" alt="Exemplo de corte para ${answers.faceShape || 'rosto'}">
        <img src="https://i.pinimg.com/736x/91/7f/64/917f6409deb677e4470a17d2618b2ec7.jpg" alt="Exemplo de corte para ${answers.faceShape || 'rosto'}">
      </div>
    </div>
    <div class="recommendation">
      <h3>Produtos Recomendados</h3>
      <p>Baseado no seu perfil, recomendamos:</p>
      <ul>
        <li><strong>Shampoo e Condicionador:</strong> ${getProductRecommendation('haircare')}</li>
        <li><strong>Produto para Estilização:</strong> ${getProductRecommendation('styling')}</li>
        <li><strong>Tratamento:</strong> ${getProductRecommendation('treatment')}</li>
      </ul>
    </div>
    <div class="premium-offer">
      <h3>Quer mais detalhes?</h3>
      <p>Obtenha seu relatório completo em PDF com recomendações personalizadas!</p>
      <a href="#premium" class="btn btn-accent">Assinar Premium</a>
    </div>
  `;
  
  resultsContent.innerHTML = resultsHTML;
  resultsModal.style.display = 'flex';
}

function getProfileDescription() {
  let description = '';
  if (answers.styleArchetype === 'classico') {
    description = 'Perfil Clássico - Elegância atemporal e sofisticação';
  } else if (answers.styleArchetype === 'dramatico') {
    description = 'Perfil Dramático - Impactante e cheio de personalidade';
  } else if (answers.styleArchetype === 'romantico') {
    description = 'Perfil Romântico - Suave, delicado e feminino';
  } else {
    description = 'Perfil Versátil - Combina elementos de vários estilos';
  }
  return description;
}

function getProductRecommendation(type) {
  if (type === 'haircare') {
    if (answers.hairType === 'cacheado' || answers.hairType === 'crespo') {
      return '<a href="https://mercadolivre.com/sec/18uy8jS" target="_blank" rel="noopener">Shampoo para cuidados dos cachos</a>';
    } else if (answers.hairType === 'liso') {
      return '<a href="https://mercadolivre.com/sec/1jKirLi" target="_blank" rel="noopener">Shampoo sem sal para brilho</a>';
    } else {
      return '<a href="https://mercadolivre.com/sec/1wFbYxw" target="_blank" rel="noopener">Shampoo hidratante</a>';
    }
  } else if (type === 'styling') {
    if (answers.hairType === 'cacheado' || answers.hairType === 'crespo') {
      return '<a href="https://mercadolivre.com/sec/1siypwP" target="_blank" rel="noopener">Creme de pentear definidor</a>';
    } else if (answers.hairType === 'liso') {
      return '<a href="https://mercadolivre.com/sec/29z4Pnp" target="_blank" rel="noopener">Óleo de argan para brilho</a>';
    } else {
      return '<a href="https://mercadolivre.com/sec/16FfURj" target="_blank" rel="noopener">Mousse ou spray texturizador</a>';
    }
  } else if (type === 'treatment') {
    if (answers.hairType === 'cacheado' || answers.hairType === 'crespo') {
      return '<a href="https://mercadolivre.com/sec/12UwAdP" target="_blank" rel="noopener">Máscara de hidratação profunda</a>';
    } else if (answers.hairType === 'liso') {
      return '<a href="https://mercadolivre.com/sec/2356nrv" target="_blank" rel="noopener">Máscara de reconstrução</a>';
    } else {
      return '<a href="https://mercadolivre.com/sec/1HhvTKM" target="_blank" rel="noopener">Máscara nutritiva</a>';
    }
  }
  return '<a href="https://www.example.com" target="_blank" rel="noopener">Produto adequado</a>';
}

btnNext.addEventListener('click', nextQuestion);
btnBack.addEventListener('click', prevQuestion);
closeModal.addEventListener('click', () => {
  resultsModal.style.display = 'none';
});
btnRestart.addEventListener('click', () => {
  resultsModal.style.display = 'none';
  currentQuestion = 0;
  answers = {};
  renderQuestion();
});
window.addEventListener('click', (e) => {
  if (e.target === resultsModal) {
    resultsModal.style.display = 'none';
  }
});
renderQuestion();

// Product Quiz
document.getElementById('product-quiz').addEventListener('submit', (e) => {
  e.preventDefault();
  const hairType = document.getElementById('hair-type').value;
  const chemicalUse = document.getElementById('chemical-use').value;
  let recommendation = '';
  
  if (hairType === 'oleoso') {
    recommendation = 'Recomendamos um shampoo para cabelos oleosos.';
  } else if (hairType === 'seco' && chemicalUse === 'sim') {
    recommendation = 'Use uma máscara hidratante e shampoo sem sulfato.';
  } else {
    recommendation = 'Um shampoo neutro é ideal para você.';
  }
  
  const result = document.getElementById('product-result');
  result.innerHTML = `<p class="success">${recommendation}</p>`;
  result.style.display = 'block';
});

// Hairstyle Quiz
document.getElementById('hairstyle-quiz').addEventListener('submit', (e) => {
  e.preventDefault();
  const faceShape = document.getElementById('face-shape').value;
  const stylePref = document.getElementById('style-pref').value;
  let suggestion = '';
  
  if (faceShape === 'oval' && stylePref === 'moderno') {
    suggestion = 'O corte Pixie é perfeito para você!';
  } else if (faceShape === 'redondo' && stylePref === 'classico') {
    suggestion = 'Experimente um corte em camadas longas.';
  } else {
    suggestion = 'Um corte Nirvana combina com seu estilo!';
  }
  
  const result = document.getElementById('hairstyle-result');
  result.innerHTML = `<p class="success">${suggestion}</p>`;
  result.style.display = 'block';
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const feedback = document.getElementById('contactFeedback');
  
  if (name && email && message) {
    feedback.className = 'form-feedback success';
    feedback.textContent = `Obrigado, ${name}! Sua mensagem foi enviada com sucesso.`;
    document.getElementById('contactForm').reset();
  } else {
    feedback.className = 'form-feedback error';
    feedback.textContent = 'Por favor, preencha todos os campos.';
  }
  
  feedback.style.display = 'block';
  setTimeout(() => {
    feedback.style.display = 'none';
  }, 3000);
});

// Newsletter Form
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const feedback = document.getElementById('newsletterFeedback');
  feedback.className = 'form-feedback success';
  feedback.textContent = 'Obrigado por assinar nossa newsletter!';
  document.getElementById('newsletterForm').reset();
  feedback.style.display = 'block';
  setTimeout(() => {
    feedback.style.display = 'none';
  }, 3000);
});

// Premium Button
document.getElementById('btnBuy').addEventListener('click', () => {
  const feedback = document.createElement('p');
  feedback.className = 'form-feedback success';
  feedback.textContent = 'Você será redirecionado para completar sua compra';
  document.getElementById('premium').appendChild(feedback);
  setTimeout(() => feedback.remove(), 3000);
});

// Login/Register Simulation
document.querySelector('a[href="#login"]').addEventListener('click', (e) => {
  e.preventDefault();
  const feedback = document.createElement('p');
  feedback.className = 'form-feedback success';
  feedback.textContent = 'Faça login para acessar recursos premium.';
  document.querySelector('.main-header').appendChild(feedback);
  setTimeout(() => feedback.remove(), 3000);
});

document.querySelector('a[href="#register"]').addEventListener('click', (e) => {
  e.preventDefault();
  const feedback = document.createElement('p');
  feedback.className = 'form-feedback success';
  feedback.textContent = 'Registre-se para personalizar sua experiência.';
  document.querySelector('.main-header').appendChild(feedback);
  setTimeout(() => feedback.remove(), 3000);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    if (anchor.getAttribute('href') !== '#login' && anchor.getAttribute('href') !== '#register') {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Dark Mode Toggle
const darkModeBtn = document.querySelector('.dark-mode-btn');
const body = document.body;

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
if (localStorage.getItem('dark-mode') === 'enabled' || 
    (localStorage.getItem('dark-mode') !== 'disabled' && prefersDarkScheme.matches)) {
  body.classList.add('dark-mode');
  darkModeBtn.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
}

darkModeBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');
  
  if (isDarkMode) {
    darkModeBtn.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
    localStorage.setItem('dark-mode', 'enabled');
  } else {
    darkModeBtn.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
    localStorage.setItem('dark-mode', 'disabled');
  }
});

// Initialize Swiper
const faceSwiper = new Swiper('.faceShapesSwiper', {
  slidesPerView: 'auto',
  spaceBetween: 20,
  freeMode: true, // Permite rolagem livre
  lazy: true,
  pagination: {
    el: '.faceShapesSwiper .swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.faceShapesSwiper .swiper-button-next',
    prevEl: '.faceShapesSwiper .swiper-button-prev'
  },
  breakpoints: {
    480: {
      slidesPerView: 1,
      spaceBetween: 10
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 15
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20
    }
  }
});

const productsSwiper = new Swiper('.productsSwiper', {
  slidesPerView: 'auto',
  spaceBetween: 20,
  freeMode: true, // Permite rolagem livre
  lazy: true,
  pagination: {
    el: '.productsSwiper .swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.productsSwiper .swiper-button-next',
    prevEl: '.productsSwiper .swiper-button-prev'
  },
  breakpoints: {
    480: {
      slidesPerView: 1,
      spaceBetween: 10
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 15
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20
    }
  }
});

// Reference Modal
const faceShapeData = {
  oval: {
    images: [
      'https://i.pinimg.com/564x/ff/dc/7b/ffdc7b8287c18ce8442ff550bfb1ac5b.jpg',
      'https://i.pinimg.com/564x/fd/df/12/fddf1222ec90fae02a250f159e4a6663.jpg'
    ],
    products: [
      { name: 'Shampoo Volume', link: '#', img: 'https://images.unsplash.com/photo-1608248543803-ba9f932f7a07' },
      { name: 'Mousse Texturizador', link: '#', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1' }
    ]
  },
  redondo: {
    images: [
      'https://i.pinimg.com/564x/91/7f/64/917f6409deb677e4470a17d2618b2ec7.jpg',
      'https://i.pinimg.com/564x/fd/df/12/fddf1222ec90fae02a250f159e4a6663.jpg'
    ],
    products: [
      { name: 'Pomada Modeladora', link: '#', img: 'https://images.unsplash.com/photo-1608248543803-ba9f932f7a07' },
      { name: 'Spray de Fixação', link: '#', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1' }
    ]
  },
  quadrado: {
    images: [
      'https://i.pinimg.com/564x/91/7f/64/917f6409deb677e4470a17d2618b2ec7.jpg',
      'https://i.pinimg.com/564x/ff/dc/7b/ffdc7b8287c18ce8442ff550bfb1ac5b.jpg'
    ],
    products: [
      { name: 'Gel Modelador', link: '#', img: 'https://images.unsplash.com/photo-1608248543803-ba9f932f7a07' },
      { name: 'Condicionador Leave-in', link: '#', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1' }
    ]
  },
  retangular: {
    images: [
      'https://i.pinimg.com/564x/fd/df/12/fddf1222ec90fae02a250f159e4a6663.jpg',
      'https://i.pinimg.com/564x/91/7f/64/917f6409deb677e4470a17d2618b2ec7.jpg'
    ],
    products: [
      { name: 'Shampoo Hidratante', link: '#', img: 'https://images.unsplash.com/photo-1608248543803-ba9f932f7a07' },
      { name: 'Sérum Capilar', link: '#', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1' }
    ]
  },
  triangular: {
    images: [
      'https://i.pinimg.com/564x/ff/dc/7b/ffdc7b8287c18ce8442ff550bfb1ac5b.jpg',
      'https://i.pinimg.com/564x/91/7f/64/917f6409deb677e4470a17d2618b2ec7.jpg'
    ],
    products: [
      { name: 'Creme de Pentear', link: '#', img: 'https://images.unsplash.com/photo-1608248543803-ba9f932f7a07' },
      { name: 'Óleo Reparador', link: '#', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1' }
    ]
  },
  diamante: {
    images: [
      'https://i.pinimg.com/564x/fd/df/12/fddf1222ec90fae02a250f159e4a6663.jpg',
      'https://i.pinimg.com/564x/ff/dc/7b/ffdc7b8287c18ce8442ff550bfb1ac5b.jpg'
    ],
    products: [
      { name: 'Máscara Capilar', link: '#', img: 'https://images.unsplash.com/photo-1608248543803-ba9f932f7a07' },
      { name: 'Spray de Brilho', link: '#', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1' }
    ]
  },
  coracao: {
    images: [
      'https://i.pinimg.com/564x/91/7f/64/917f6409deb677e4470a17d2618b2ec7.jpg',
      'https://i.pinimg.com/564x/fd/df/12/fddf1222ec90fae02a250f159e4a6663.jpg'
    ],
    products: [
      { name: 'Shampoo sem Sulfato', link: '#', img: 'https://images.unsplash.com/photo-1608248543803-ba9f932f7a07' },
      { name: 'Protetor Térmico', link: '#', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1' }
    ]
  }
};

document.querySelectorAll('.btn-reference').forEach(btn => {
  btn.addEventListener('click', () => {
    const shape = btn.dataset.shape;
    openReferenceModal(shape);
  });
});

function openReferenceModal(shape) {
  const data = faceShapeData[shape.toLowerCase()];
  if (!data) return;
  
  const modal = document.getElementById('referenceModal');
  const title = document.getElementById('reference-modal-title');
  const imagesContainer = document.getElementById('referenceImages');
  const productsContainer = document.getElementById('modalProducts');
  
  title.textContent = `Referências para Rosto ${shape.charAt(0).toUpperCase() + shape.slice(1)}`;
  
  imagesContainer.innerHTML = '';
  data.images.forEach(img => {
    imagesContainer.innerHTML += `
      <div class="swiper-slide">
        <img src="${img}" alt="Estilo para rosto ${shape}" loading="lazy">
      </div>
    `;
  });
  
  productsContainer.innerHTML = '';
  data.products.forEach(prod => {
    productsContainer.innerHTML += `
      <div class="product-item">
        <img src="${prod.img}" alt="${prod.name}" loading="lazy">
        <p>${prod.name}</p>
      </div>
    `;
  });
  
  if (window.referenceSwiper) {
    window.referenceSwiper.destroy();
  }
  window.referenceSwiper = new Swiper('.referenceSwiper', {
    slidesPerView: 1,
    spaceBetween: 10,
    lazy: true,
    pagination: { el: '.referenceSwiper .swiper-pagination' }
  });
  
  modal.style.display = 'flex';
}

document.querySelectorAll('#referenceModal .close-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('referenceModal').style.display = 'none';
  });
});

document.getElementById('startFaceQuiz').addEventListener('click', () => {
  document.querySelector('a[href="#quizzes"]').click();
});