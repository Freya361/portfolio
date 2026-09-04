// Minimal script for future interactivity
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({behavior:'smooth'});
    }
  });
});

// Example: smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({behavior:'smooth'});
    }
  });
});

// Hover-follow bubble for project cards (desktop)
;(function(){
  // Skip on touch devices
  if (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) return;

  document.querySelectorAll('.card').forEach(card=>{
    let bubble = null;

    function createBubble(){
      if (bubble) return;
      bubble = document.createElement('div');
      bubble.className = 'project-bubble';
      bubble.textContent = 'View Project';
      document.body.appendChild(bubble);
      // small delay to allow transitions
      requestAnimationFrame(()=> bubble.classList.add('show'));
    }

    function moveBubble(e){
      if (!bubble) return;
      const x = e.clientX;
      const y = e.clientY;
      // offset so the larger circular bubble doesn't obscure the cursor
      // offset so the large circular bubble sits above/right of the cursor
      bubble.style.left = (x + 40) + 'px';
      bubble.style.top = (y - 48) + 'px';
    }

    function removeBubble(){
      if (!bubble) return;
      bubble.classList.remove('show');
      // remove after transition
      setTimeout(()=>{
        if (bubble && bubble.parentNode) bubble.parentNode.removeChild(bubble);
        bubble = null;
      }, 250);
    }

    card.addEventListener('mouseenter', e=>{
      createBubble();
      card.addEventListener('mousemove', moveBubble);
    });
    card.addEventListener('mouseleave', e=>{
      card.removeEventListener('mousemove', moveBubble);
      removeBubble();
    });
  });
})();

// Ken Burns slideshow for Discovery section
(function(){
  const container = document.querySelector('.discovery-ken');
  if(!container) return;
  const imgs = Array.from(container.querySelectorAll('.kb-image'));
  if(!imgs.length) return;

  let idx = 0;
  const duration = 4200; // how long each image plays (ms)
  const crossfade = 900; // crossfade overlap (ms)
  let timer = null;

  // initialize styles
  imgs.forEach((img,i)=>{
    img.style.opacity = i===0 ? '1' : '0';
    img.style.transition = `opacity ${crossfade}ms ease`;
    img.style.animation = 'none';
    img.setAttribute('aria-hidden', i===0 ? 'false' : 'true');
  });

  function show(n){
    imgs.forEach((im, i)=>{
      if(i === n){
        im.style.opacity = '1';
        im.setAttribute('aria-hidden','false');
        // trigger kenburns animation
        im.style.animation = `kenburns-pan ${duration}ms ease-in-out forwards`;
      } else {
        im.style.opacity = '0';
        im.setAttribute('aria-hidden','true');
        im.style.animation = 'none';
      }
    });
    idx = n;
  }

  function next(){ show((idx + 1) % imgs.length); }

  function start(){ stop(); timer = setInterval(next, duration); }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }

  container.addEventListener('mouseenter', stop);
  container.addEventListener('mouseleave', start);

  // start
  show(0);
  start();
})();

// Simple rotator for project hero images
(function(){
  const rotators = document.querySelectorAll('.project-rotator');
  if(!rotators || !rotators.length) return;

  rotators.forEach(rotator => {
    const imgs = Array.from(rotator.querySelectorAll('img'));
    if (!imgs.length) return;
    let idx = 0;
    // ensure first image visible
    imgs.forEach((im,i)=> im.classList.toggle('active', i===0));
    // preload images
    imgs.forEach(i=>{ const img=new Image(); img.src=i.src; });

    // create dot controls
    const dots = document.createElement('div');
    dots.className = 'rotator-dots';
    imgs.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rotator-dot' + (i===0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Show image ' + (i+1));
      btn.addEventListener('click', ()=>{
        clearTimer();
        goTo(i);
      });
      dots.appendChild(btn);
    });
    rotator.appendChild(dots);

    const interval = 3500;
    const firstDelay = 1200; // shorter initial display before first rotation
    let timer = null;

    function clearTimer(){ if(timer){ try{ clearInterval(timer); }catch(e){} try{ clearTimeout(timer); }catch(e){} timer = null; } }

    // start with a shorter initial delay, then switch to regular interval
    timer = setTimeout(()=>{
      next();
      timer = setInterval(next, interval);
    }, firstDelay);

    function goTo(n){
      if (n === idx) return;
      imgs[idx].classList.remove('active');
      const prevDot = dots.children[idx]; if (prevDot) prevDot.classList.remove('active');
      idx = n;
      imgs[idx].classList.add('active');
      const curDot = dots.children[idx]; if (curDot) curDot.classList.add('active');
    }

    function next(){
      goTo((idx+1) % imgs.length);
    }

    // pause on hover/focus — use clearTimer to cancel either timeout or interval
    rotator.addEventListener('mouseenter', ()=> clearTimer());
    rotator.addEventListener('mouseleave', ()=>{ clearTimer(); timer = setInterval(next, interval); });
    dots.addEventListener('focusin', ()=> clearTimer());
    dots.addEventListener('focusout', ()=>{ clearTimer(); timer = setInterval(next, interval); });
  });
})();

// Discovery flip-book (right-to-left page flip)
// Smooth Slide + Crossfade for all discovery galleries
(function(){
  const containers = document.querySelectorAll('.discovery-flip');
  if(!containers || !containers.length) return;

  containers.forEach(container => {
    const pages = Array.from(container.querySelectorAll('.page'));
    const prevBtn = container.querySelector('.flip-prev');
    const nextBtn = container.querySelector('.flip-next');
    if(!pages.length) return;

    const anim = 700; // ms transition
    const interval = 3600; // autoplay
    let idx = 0;
    let timer = null;

    // initialize pages: center and place offscreen to the right except first
    pages.forEach((p,i)=>{
      p.style.position = 'absolute';
      p.style.left = '50%';
      p.style.top = '50%';
      p.style.transform = i===0 ? 'translate(-50%,-50%) translateX(0)' : 'translate(-50%,-50%) translateX(100%)';
      p.style.opacity = i===0 ? '1' : '0';
      p.style.transition = `transform ${anim}ms cubic-bezier(.22,.9,.32,1), opacity ${anim}ms ease`;
      p.setAttribute('aria-hidden', i===0 ? 'false' : 'true');
    });

    // create dot controls like the main rotator
    const dots = document.createElement('div');
    dots.className = 'rotator-dots';
    pages.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rotator-dot' + (i===0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Show image ' + (i+1));
      btn.addEventListener('click', ()=>{ stop(); goTo(i); });
      dots.appendChild(btn);
    });
    container.appendChild(dots);
    dots.addEventListener('focusin', ()=> stop());
    dots.addEventListener('focusout', ()=> start());

    function goTo(n){
      if(n === idx) return;
      const prev = pages[idx];
      const next = pages[n];
      const dir = (n > idx || (n === 0 && idx === pages.length -1)) ? 'forward' : 'backward';

      // position next offscreen in dir
      next.style.transition = 'none';
      next.style.transform = dir === 'forward' ? 'translate(-50%,-50%) translateX(100%)' : 'translate(-50%,-50%) translateX(-100%)';
      next.style.opacity = '1';
      next.setAttribute('aria-hidden','false');

      requestAnimationFrame(()=> requestAnimationFrame(()=>{
        prev.style.transform = dir === 'forward' ? 'translate(-50%,-50%) translateX(-100%)' : 'translate(-50%,-50%) translateX(100%)';
        prev.style.opacity = '0';
        next.style.transform = 'translate(-50%,-50%) translateX(0)';
      }));

      const oldIdx = idx;
      setTimeout(()=>{
        prev.setAttribute('aria-hidden','true');
        idx = n;
        // update dots
        const prevDot = dots.children[oldIdx]; if(prevDot) prevDot.classList.remove('active');
        const curDot = dots.children[idx]; if(curDot) curDot.classList.add('active');
      }, anim + 30);
    }

    function nextSlide(){ goTo((idx + 1) % pages.length); }
    function prevSlide(){ goTo((idx - 1 + pages.length) % pages.length); }

    if(nextBtn) nextBtn.addEventListener('click', ()=>{ stop(); nextSlide(); start(); });
    if(prevBtn) prevBtn.addEventListener('click', ()=>{ stop(); prevSlide(); start(); });

    container.addEventListener('click', (e)=>{ if(e.target.closest('.flip-controls')) return; stop(); nextSlide(); start(); });

    container.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); stop(); nextSlide(); start(); }
      if(e.key === 'ArrowLeft') { e.preventDefault(); stop(); prevSlide(); start(); }
    });

    function start(){ stop(); timer = setInterval(nextSlide, interval); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }

    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);
    container.addEventListener('focusin', stop);
    container.addEventListener('focusout', start);

    if(!container.hasAttribute('tabindex')) container.setAttribute('tabindex','0');
    start();
  });
})();

// Navigation: static and floating
(function(){
  const floatingNav = document.getElementById('floatingNav');
  const sectionNav = document.getElementById('sectionNav');
  const hero = document.querySelector('.hero');
  const sections = document.querySelectorAll('section[id]');
  if (!floatingNav || !sectionNav || !hero) return;

  const floatingNavLinks = floatingNav.querySelectorAll('a[data-section]');
  const sectionNavLinks = sectionNav.querySelectorAll('a[data-section]');

  function updateActiveSection(){
    let activeSection = null;
    let maxVisibleArea = 0;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate how much of the section is visible
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleArea = Math.max(0, visibleBottom - visibleTop);

      // If this section has the most visible area, it's the active one
      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        activeSection = section.id;
      }
    });

    // Update active links in both navs
    floatingNavLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === activeSection);
    });
    sectionNavLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === activeSection);
    });
  }

  function checkNavs(){
    const sectionNavRect = sectionNav.getBoundingClientRect();
    // Show floating nav when section nav scrolls out of view
    const shouldShow = sectionNavRect.bottom < 0;
    floatingNav.classList.toggle('visible', shouldShow);

    updateActiveSection();
  }

  window.addEventListener('scroll', checkNavs, { passive: true });

  // Smooth scroll for both navs
  const allNavLinks = [...floatingNavLinks, ...sectionNavLinks];
  allNavLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.dataset.section;
      const target = document.getElementById(targetId);
      if(target){
        const heading = target.querySelector('h3');
        if(heading){
          heading.scrollIntoView({ behavior: 'smooth' });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
})();
