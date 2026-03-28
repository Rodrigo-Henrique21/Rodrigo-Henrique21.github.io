// ===== Data Loading & Rendering =====
document.addEventListener('DOMContentLoaded', async () => {
  const resumeData = await loadJSON('data/resume_data.json');
  const githubData = await loadJSON('data/github_data.json');

  if (resumeData && githubData) {
    renderHero(resumeData, githubData);
    renderSobre(resumeData);
    renderExperiencia(resumeData);
    renderProjetos(githubData);
    renderHabilidades(resumeData);
    renderCertificacoes(resumeData);
    renderContato(resumeData);
    renderFooter(resumeData);
  }

  initScrollAnimations();
  initHeader();
  initMobileMenu();
  initBackToTop();
  initContactForm();
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});

async function loadJSON(path) {
  try {
    const res = await fetch(path);
    return await res.json();
  } catch (e) {
    console.error('Erro ao carregar:', path, e);
    return null;
  }
}

// ===== Language Color Map =====
const langColors = {
  'Python': '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'C': '#555555',
  'C++': '#f34b7d',
  'Dockerfile': '#384d54',
};

// ===== Render Functions =====
function renderHero(resume, github) {
  document.getElementById('heroName').textContent = resume.full_name;
  document.getElementById('heroTitle').textContent = 'Engenheiro de Dados & Tech Lead';
  document.getElementById('heroDescription').textContent =
    `Profissional com ${resume.highlights.years_of_experience} anos de experiência em Engenharia de Dados, Arquitetura de Dados e Liderança Técnica. Especialista em Spark, Databricks, Airflow e Cloud.`;

  const avatar = document.getElementById('heroAvatar');
  avatar.src = github.profile.avatar_url;
  avatar.alt = resume.full_name;

  // Stats
  const statsHTML = `
    <div class="hero__stat">
      <div class="hero__stat-value">${resume.highlights.years_of_experience}</div>
      <div class="hero__stat-label">Anos Exp.</div>
    </div>
    <div class="hero__stat">
      <div class="hero__stat-value">${github.statistics.total_public_repos}</div>
      <div class="hero__stat-label">Repositórios</div>
    </div>
    <div class="hero__stat">
      <div class="hero__stat-value">${github.statistics.total_followers}</div>
      <div class="hero__stat-label">Seguidores</div>
    </div>
  `;
  document.getElementById('heroStats').innerHTML = statsHTML;

  // Social links
  const socialHTML = `
    <a href="${resume.contact.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
    <a href="${resume.contact.github}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>
    <a href="mailto:${resume.contact.email}" aria-label="Email"><i class="fas fa-envelope"></i></a>
  `;
  document.getElementById('heroSocial').innerHTML = socialHTML;
}

function renderSobre(data) {
  // Summary text - split into paragraphs
  const sentences = data.summary.split('. ');
  const mid = Math.ceil(sentences.length / 2);
  const p1 = sentences.slice(0, mid).join('. ') + '.';
  const p2 = sentences.slice(mid).join('. ');

  document.getElementById('sobreText').innerHTML = `
    <p>${p1}</p>
    <p>${p2}</p>
    <p><strong>${data.highlights.leadership}</strong> em empresas como Bradesco, Stefanini e mais.</p>
  `;

  // Key achievements
  const highlights = data.highlights.key_achievements.slice(0, 6).map(a =>
    `<div class="highlight-card">
      <i class="fas fa-chart-line"></i>
      <span>${a}</span>
    </div>`
  ).join('');
  document.getElementById('sobreHighlights').innerHTML = highlights;

  // Industries
  const industries = data.highlights.industries.map(i =>
    `<span class="industry-tag">${i}</span>`
  ).join('');
  document.getElementById('sobreIndustries').innerHTML = `
    <h3>Setores de Atuação</h3>
    <div class="industry-tags">${industries}</div>
  `;
}

function renderExperiencia(data) {
  const timeline = document.getElementById('timeline');
  let html = '';

  data.experience.forEach(exp => {
    exp.roles.forEach(role => {
      const responsibilities = role.responsibilities.slice(0, 4).map(r =>
        `<li>${r}</li>`
      ).join('');

      html += `
        <div class="timeline__item animate-on-scroll">
          <div class="timeline__header">
            <div class="timeline__company">${exp.company}</div>
            <div class="timeline__role">${role.title}</div>
            <div class="timeline__meta">
              <span><i class="far fa-calendar"></i>${role.period}</span>
              <span><i class="far fa-clock"></i>${role.duration}</span>
              ${role.location ? `<span><i class="fas fa-map-marker-alt"></i>${role.location}</span>` : ''}
            </div>
          </div>
          ${responsibilities ? `<ul class="timeline__responsibilities">${responsibilities}</ul>` : ''}
        </div>
      `;
    });
  });

  timeline.innerHTML = html;
}

function renderProjetos(data) {
  const grid = document.getElementById('projetosGrid');
  const repos = data.featured_repositories
    .filter(r => r.name !== 'Rodrigo-Henrique21')
    .sort((a, b) => b.stars - a.stars);

  let html = '';
  repos.forEach(repo => {
    const langs = Object.keys(repo.languages).slice(0, 4);
    const techTags = langs.map(l => `<span class="projeto-card__tech">${l}</span>`).join('');
    const langColor = langColors[repo.language] || '#8b8b8b';
    const desc = repo.description && repo.description !== 'Sem descrição'
      ? repo.description
      : 'Projeto disponível no GitHub.';

    html += `
      <div class="projeto-card animate-on-scroll">
        <div class="projeto-card__header">
          <i class="fas fa-folder-open projeto-card__icon"></i>
          <a href="${repo.url}" target="_blank" rel="noopener" class="projeto-card__link"><i class="fas fa-external-link-alt"></i></a>
        </div>
        <h3 class="projeto-card__name">${repo.name.replace(/_/g, ' ')}</h3>
        <p class="projeto-card__desc">${desc}</p>
        <div class="projeto-card__techs">${techTags}</div>
        <div class="projeto-card__footer">
          <span class="projeto-card__lang">
            ${repo.language ? `<span class="projeto-card__lang-dot" style="background:${langColor}"></span>${repo.language}` : ''}
          </span>
          <span class="projeto-card__stars"><i class="fas fa-star"></i> ${repo.stars}</span>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function renderHabilidades(data) {
  const wrapper = document.getElementById('habilidadesWrapper');

  // Primary skills
  const primaryTags = data.skills.primary.map(s =>
    `<span class="skill-tag skill-tag--primary">${s}</span>`
  ).join('');

  // Technology skills - group them
  const techGroups = {
    'Big Data & Processing': ['Apache Spark / PySpark', 'Databricks', 'Apache Airflow', 'Apache Kafka', 'Apache Flink', 'Apache NiFi', 'Hadoop', 'Delta Lake', 'dbt'],
    'Linguagens': ['Python', 'SQL', 'R'],
    'Cloud': ['Azure (Azure Data Factory, Azure IoT Hub, Azure Blob Storage, Azure SQL Database)', 'AWS (EC2, S3, RDS)', 'GCP (Compute Engine, Cloud Storage, BigQuery)'],
    'Bancos de Dados': ['PostgreSQL', 'MySQL', 'MongoDB', 'Snowflake', 'Redshift'],
    'Visualização & ML': ['Power BI', 'Tableau', 'TensorFlow', 'Scikit-learn', 'NumPy', 'Pandas', 'Matplotlib'],
    'DevOps & CI/CD': ['Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Bitbucket', 'SonarQube']
  };

  let techHTML = '';
  for (const [group, techs] of Object.entries(techGroups)) {
    const tags = techs.map(t => `<span class="skill-tag">${t.split(' (')[0].split(' /')[0]}</span>`).join('');
    const icon = getGroupIcon(group);
    techHTML += `
      <div class="habilidades__category animate-on-scroll">
        <h3><i class="${icon}"></i> ${group}</h3>
        <div class="skills-grid">${tags}</div>
      </div>
    `;
  }

  // Concepts
  const conceptTags = data.skills.concepts.map(c =>
    `<span class="skill-tag">${c}</span>`
  ).join('');

  wrapper.innerHTML = `
    <div class="habilidades__category animate-on-scroll">
      <h3><i class="fas fa-rocket"></i> Competências Principais</h3>
      <div class="skills-grid">${primaryTags}</div>
    </div>
    ${techHTML}
    <div class="habilidades__category animate-on-scroll">
      <h3><i class="fas fa-lightbulb"></i> Conceitos & Arquiteturas</h3>
      <div class="skills-grid">${conceptTags}</div>
    </div>
  `;
}

function getGroupIcon(group) {
  const icons = {
    'Big Data & Processing': 'fas fa-database',
    'Linguagens': 'fas fa-code',
    'Cloud': 'fas fa-cloud',
    'Bancos de Dados': 'fas fa-server',
    'Visualização & ML': 'fas fa-chart-bar',
    'DevOps & CI/CD': 'fas fa-cogs',
  };
  return icons[group] || 'fas fa-tools';
}

function renderCertificacoes(data) {
  // Certifications
  const certIcons = {
    'Databricks': 'fas fa-database',
    'Microsoft': 'fab fa-microsoft',
    'ETL': 'fas fa-exchange-alt',
    'Power BI': 'fas fa-chart-pie',
  };

  const certsHTML = data.certifications.map(cert => {
    let icon = 'fas fa-certificate';
    for (const [key, val] of Object.entries(certIcons)) {
      if (cert.includes(key)) { icon = val; break; }
    }
    return `
      <div class="cert-card animate-on-scroll">
        <div class="cert-card__icon"><i class="${icon}"></i></div>
        <div class="cert-card__name">${cert}</div>
      </div>
    `;
  }).join('');
  document.getElementById('certificacoesGrid').innerHTML = certsHTML;

  // Education
  const eduHTML = data.education.map(edu => `
    <div class="edu-card animate-on-scroll">
      <div class="edu-card__degree">${edu.degree}</div>
      <div class="edu-card__field">${edu.field}</div>
      <div class="edu-card__inst"><i class="fas fa-university"></i> ${edu.institution}</div>
      <div class="edu-card__period"><i class="far fa-calendar-alt"></i> ${edu.period}</div>
    </div>
  `).join('');
  document.getElementById('educacaoGrid').innerHTML = eduHTML;
}

function renderContato(data) {
  document.getElementById('contatoInfo').innerHTML = `
    <p class="contato__info-text">
      Estou sempre aberto a novas oportunidades, projetos interessantes e colaborações.
      Sinta-se à vontade para entrar em contato!
    </p>
    <div class="contato__item">
      <div class="contato__item-icon"><i class="fas fa-envelope"></i></div>
      <div>
        <div class="contato__item-label">Email</div>
        <div class="contato__item-value"><a href="mailto:${data.contact.email}">${data.contact.email}</a></div>
      </div>
    </div>
    <div class="contato__item">
      <div class="contato__item-icon"><i class="fab fa-linkedin-in"></i></div>
      <div>
        <div class="contato__item-label">LinkedIn</div>
        <div class="contato__item-value"><a href="${data.contact.linkedin}" target="_blank" rel="noopener">LinkedIn Profile</a></div>
      </div>
    </div>
    <div class="contato__item">
      <div class="contato__item-icon"><i class="fab fa-github"></i></div>
      <div>
        <div class="contato__item-label">GitHub</div>
        <div class="contato__item-value"><a href="${data.contact.github}" target="_blank" rel="noopener">github.com/Rodrigo-Henrique21</a></div>
      </div>
    </div>
    <div class="contato__item">
      <div class="contato__item-icon"><i class="fas fa-phone"></i></div>
      <div>
        <div class="contato__item-label">Telefone</div>
        <div class="contato__item-value">${data.contact.phone}</div>
      </div>
    </div>
  `;
}

function renderFooter(data) {
  document.getElementById('footerSocial').innerHTML = `
    <a href="${data.contact.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
    <a href="${data.contact.github}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>
    <a href="mailto:${data.contact.email}" aria-label="Email"><i class="fas fa-envelope"></i></a>
  `;
}

// ===== Interactions =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function initHeader() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    const icon = toggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      const icon = toggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    });
  });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initContactForm() {
  document.getElementById('contatoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
      btn.style.background = '';
      e.target.reset();
    }, 3000);
  });
}
