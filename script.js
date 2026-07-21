/* ============================================
   COFFEE PORTFOLIO — Interactive Engine
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. PRELOADER =====
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloaderBar');
  let loadProgress = 0;

  const simulateLoading = () => {
    if (loadProgress < 100) {
      const increment = Math.random() * 8 + 2;
      loadProgress = Math.min(loadProgress + increment, 100);
      preloaderBar.style.width = loadProgress + '%';
      if (loadProgress < 100) {
        setTimeout(simulateLoading, 150 + Math.random() * 200);
      } else {
        setTimeout(() => {
          preloader.classList.add('hidden');
          document.body.style.overflow = '';
          // Start scramble text effect after preloader
          scrambleHeroName();
          initBrewGauge();
          initCmdHint();
          initScrollCue();
        }, 400);
      }
    }
  };

  document.body.style.overflow = 'hidden';
  simulateLoading();

  // ===== 2. SCRAMBLE TEXT EFFECT =====
  const scrambleHeroName = () => {
    const nameLine = document.querySelector('.hero-name-line');
    if (!nameLine) return;
    const originalText = nameLine.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let iterations = 0;
    const maxIterations = 20;
    
    const interval = setInterval(() => {
      iterations++;
      let scrambled = '';
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === ' ') { scrambled += ' '; continue; }
        // Reveal characters progressively
        if (iterations > i * 0.5) {
          scrambled += originalText[i];
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      nameLine.textContent = scrambled;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        nameLine.textContent = originalText;
      }
    }, 50);
  };

  // ===== 3. CUSTOM CURSOR =====
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorSpotlight = document.getElementById('cursorSpotlight');
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let isOnPage = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorSpotlight.style.left = e.clientX + 'px';
    cursorSpotlight.style.top = e.clientY + 'px';
    
    if (!isOnPage) {
      isOnPage = true;
      cursorSpotlight.classList.add('visible');
    }
  });

  document.addEventListener('mouseleave', () => {
    isOnPage = false;
    cursorSpotlight.classList.remove('visible');
  });

  // Smooth ring follow
  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.08;
    ringY += (mouseY - ringY) * 0.08;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover effects on interactive elements
  const hoverables = document.querySelectorAll('a, button, .btn, .card-btn, .filter-btn, .lang-chip, .social-link, .accordion-header, .timeline-content');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  // ===== 4. MAGNETIC BUTTONS =====
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 6;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ===== 5. THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = '';
    } else {
      sunIcon.style.display = '';
      moonIcon.style.display = 'none';
    }
  };

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ===== 6. COMMAND PALETTE =====
  const cmdOverlay = document.getElementById('cmdOverlay');
  const cmdInput = document.getElementById('cmdInput');
  const cmdOpenBtn = document.getElementById('cmdOpenBtn');
  const cmdResults = document.getElementById('cmdResults');
  const cmdItems = cmdResults.querySelectorAll('.cmd-item');

  const openCmd = () => {
    cmdOverlay.classList.add('open');
    setTimeout(() => cmdInput.focus(), 100);
  };

  const closeCmd = () => {
    cmdOverlay.classList.remove('open');
  };

  cmdOpenBtn.addEventListener('click', openCmd);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdOverlay.classList.contains('open')) {
        closeCmd();
      } else {
        openCmd();
      }
    }
    if (e.key === 'Escape') {
      closeCmd();
    }
  });

  cmdOverlay.addEventListener('click', (e) => {
    if (e.target === cmdOverlay) closeCmd();
  });

  cmdInput.addEventListener('input', () => {
    const query = cmdInput.value.toLowerCase();
    cmdItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      const action = item.dataset.action;
      if (target) {
        const section = document.getElementById(target);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
          closeCmd();
        }
      }
      if (action === 'theme') {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
        closeCmd();
      }
    });
  });

  // ===== 7. SIDE DOT NAV =====
  const sideDots = document.querySelectorAll('.side-dot');
  const sections = document.querySelectorAll('.section[id]');

  const updateActiveDot = () => {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    let activeSection = 'hero';
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        activeSection = section.id;
      }
    });

    sideDots.forEach(dot => {
      const isActive = dot.dataset.section === activeSection;
      dot.classList.toggle('active', isActive);
    });
  };

  window.addEventListener('scroll', updateActiveDot);
  updateActiveDot();

  // ===== 8. BREW GAUGE (scroll progress) =====
  const brewGauge = document.getElementById('brewGauge');
  const cupLiquid = document.querySelector('.cup-liquid');

  const initBrewGauge = () => {
    brewGauge.classList.add('visible');
    updateBrewGauge();
  };

  const updateBrewGauge = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    // Liquid fills from bottom (Y=42) to top (Y=22) — cup body is y=18 to y=44
    const maxHeight = 22; // 44 - 22
    const currentHeight = progress * maxHeight;
    cupLiquid.setAttribute('y', 44 - currentHeight);
    cupLiquid.setAttribute('height', currentHeight);
  };

  window.addEventListener('scroll', updateBrewGauge);

  // ===== 9. CMD HINT =====
  const cmdHint = document.getElementById('cmdHint');
  const initCmdHint = () => {
    cmdHint.classList.add('visible');
  };

  // ===== 10. SCROLL CUE =====
  const scrollCue = document.getElementById('scrollCue');
  const initScrollCue = () => {
    // Hide scroll cue on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollCue.style.opacity = '0';
      } else {
        scrollCue.style.opacity = '0.5';
      }
    }, { passive: true });
  };

  // ===== 11. ROTATING TAGLINE (typing effect) =====
  const rotatingEl = document.getElementById('heroRotating');
  const taglines = [
    'scalable backends',
    'clean APIs',
    'intelligent solutions',
    'elegant code',
    'digital experiences'
  ];
  let taglineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  const typeTagline = () => {
    const currentTagline = taglines[taglineIndex];
    
    if (isDeleting) {
      rotatingEl.textContent = currentTagline.substring(0, charIndex - 1);
      charIndex--;
    } else {
      rotatingEl.textContent = currentTagline.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentTagline.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      taglineIndex = (taglineIndex + 1) % taglineList.length;
      typeSpeed = 500;
    } else {
      typeSpeed = isDeleting ? 40 : 80;
    }

    setTimeout(typeTagline, typeSpeed);
  };

  // Fix: store taglines in a variable named taglineList for the typewriter
  const taglineList = taglines;
  setTimeout(typeTagline, 2000);

  // ===== 12. CANVAS CONSTELLATION (hero particles) =====
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: 0, y: 0 };
  let animationId;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      // Mouse influence
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.05;
        this.x -= dx * force;
        this.y -= dy * force;
      }
      
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184, 134, 60, ${this.opacity})`;
      ctx.fill();
    }
  }

  const initParticles = () => {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 80);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  };
  initParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  const connectParticles = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(184, 134, 60, ${0.15 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animateParticles);
  };
  animateParticles();

  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // ===== 13. SCROLL REVEAL (IntersectionObserver) =====
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // If it's a stat number, start counting
        const statNum = entry.target.querySelector('.stat-number');
        if (statNum) {
          animateCounter(statNum);
        }
        // If it's a skill bar, animate it
        const skillFills = entry.target.querySelectorAll('.skill-fill');
        skillFills.forEach(fill => animateSkillBar(fill));
        // Don't unobserve — keep checking for stats
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== 14. COUNTER ANIMATION =====
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count) || 0;
    let current = 0;
    const increment = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, 40);
  };

  // Also check for stat numbers directly visible
  document.querySelectorAll('.stat-number').forEach(el => {
    // Observer handles this via parent .reveal
  });

  // ===== 15. SKILL BAR ANIMATION =====
  const animateSkillBar = (el) => {
    const width = el.dataset.width || 0;
    el.style.setProperty('--target-width', width + '%');
    el.classList.add('animate');
  };

  // Also observe skill bars directly
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        animateSkillBar(fill);
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.skill-fill').forEach(fill => skillObserver.observe(fill));

  // ===== 16. ACCORDION =====
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      // Close other items
      accordionItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
        }
      });
      item.classList.toggle('active');
    });
  });

  // ===== 17. PROJECT FILTERING =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ===== 18. 3D TILT ON PROJECT CARDS =====
  const tiltCards = document.querySelectorAll('[data-tilt]');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;
      
      const inner = card.querySelector('.card-inner');
      if (inner) {
        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

      // Cursor-tracked glow
      const glow = card.querySelector('.card-glow');
      if (glow) {
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        glow.style.background = `radial-gradient(600px circle at ${pctX}% ${pctY}%, var(--color-gold-light), transparent 40%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.card-inner');
      if (inner) {
        inner.style.transform = '';
      }
    });
  });

  // ===== 19. MODALS =====
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalCloses = document.querySelectorAll('.modal-close');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // ===== 20. BEAN BURST =====
  const createBeanBurst = (x, y) => {
    const count = 20;
    const colors = ['#B8863C', '#8A5A34', '#E8C77E', '#F0DEB8', '#D4A047'];
    
    for (let i = 0; i < count; i++) {
      const bean = document.createElement('div');
      bean.className = 'bean-particle';
      bean.style.left = x + 'px';
      bean.style.top = y + 'px';
      bean.style.background = colors[Math.floor(Math.random() * colors.length)];
      bean.style.width = (6 + Math.random() * 6) + 'px';
      bean.style.height = (8 + Math.random() * 6) + 'px';
      bean.style.borderRadius = '60%';
      
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const velocity = 80 + Math.random() * 120;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 60;
      const rotation = Math.random() * 360;
      const scale = 0.5 + Math.random() * 0.8;
      
      document.body.appendChild(bean);
      
      let opacity = 1;
      let posX = x;
      let posY = y;
      let velX = vx;
      let velY = vy;
      let rot = rotation;
      let life = 0;
      
      const animateBean = () => {
        life++;
        if (life > 60) {
          bean.remove();
          return;
        }
        
        velY += 4; // gravity
        posX += velX * 0.016;
        posY += velY * 0.016;
        rot += 8;
        
        opacity = Math.max(0, 1 - life / 60);
        
        bean.style.left = posX + 'px';
        bean.style.top = posY + 'px';
        bean.style.transform = `rotate(${rot}deg) scale(${scale})`;
        bean.style.opacity = opacity;
        
        requestAnimationFrame(animateBean);
      };
      
      animateBean();
    }
  };

  // ===== 21. CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('formSubmit');
      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const message = document.getElementById('formMessage').value;
      
      btn.querySelector('.btn-text').textContent = 'Sending…';
      btn.disabled = true;
      
      // Send to Django API
      fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ name, email, message })
      })
      .then(res => res.json())
      .then(data => {
        // Bean burst on submit
        const rect = btn.getBoundingClientRect();
        createBeanBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        
        btn.querySelector('.btn-text').textContent = 'Message Brewed ☕';
        btn.querySelector('.btn-icon').innerHTML = '✓';
        
        setTimeout(() => {
          contactForm.reset();
          btn.querySelector('.btn-text').textContent = 'Send Message';
          btn.querySelector('.btn-icon').innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
          btn.disabled = false;
        }, 3000);
      })
      .catch(err => {
        btn.querySelector('.btn-text').textContent = 'Send Message';
        btn.disabled = false;
        console.error('Contact form error:', err);
      });
    });
  }

  // Helper to get CSRF token from cookie
  function getCSRFToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // ===== 22. NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ===== 23. MOBILE MENU TOGGLE =====
  const menuToggle = document.getElementById('navMenuToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    let menuOpen = false;
    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      navLinks.style.display = menuOpen ? 'flex' : '';
      if (menuOpen) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.right = '24px';
        navLinks.style.background = 'var(--navbar-bg)';
        navLinks.style.backdropFilter = 'blur(20px)';
        navLinks.style.border = '1px solid var(--glass-border)';
        navLinks.style.borderRadius = '12px';
        navLinks.style.padding = '16px 24px';
        navLinks.style.zIndex = '100';
      }
    });
  }

  // ===== 24. NAV SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== 25. TICKER DUPLICATION =====
  const tickerTrack = document.getElementById('tickerTrack');
  if (tickerTrack) {
    // Duplicate content for seamless loop
    tickerTrack.innerHTML += tickerTrack.innerHTML;
  }

  console.log('%c☕ Coffee Portfolio', 'font-size:24px; font-weight:bold; color:#B8863C;');
  console.log('%cBrewed with love for Akhilesh P', 'font-size:14px; color:#8A5A34;');
});
