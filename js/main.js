/**
 * RAP Technologies - Modern Interactions
 * Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initPlatformTabs();
  initSmoothScroll();
  initEnquiryForm();
  initPortfolioGallery();
});

/**
 * Sticky Header Scroll State
 */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer & Accordion
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  const closeMenu = () => {
    toggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Mobile submenu accordion
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1100) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = item.classList.contains('open');
          dropdownItems.forEach(other => {
            if (other !== item) other.classList.remove('open');
          });
          item.classList.toggle('open', !isOpen);
        }
      });
    }
  });

  // Close menu when clicking any dropdown link
  const dropdownLinks = document.querySelectorAll('.dropdown-item');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1100) {
        closeMenu();
      }
    });
  });

  // Close when clicking outside of menu
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/**
 * Interactive Platform Tabs in CAD Customization Section
 */
function initPlatformTabs() {
  const tabButtons = document.querySelectorAll('.platform-tab-btn');
  const codeBody = document.querySelector('.code-display-body');
  const codeFilename = document.querySelector('.cad-filename');

  if (!tabButtons.length || !codeBody) return;

  const codeSnippets = {
    autocad: {
      file: 'RapAutoCADAutomation.cs',
      code: `<span class="code-comment">// RAP Technologies - AutoCAD .NET Plugin Command</span>
<span class="code-keyword">using</span> Autodesk.AutoCAD.Runtime;
<span class="code-keyword">using</span> Autodesk.AutoCAD.ApplicationServices;
<span class="code-keyword">using</span> Autodesk.AutoCAD.DatabaseServices;

<span class="code-keyword">public class</span> <span class="code-class">CADAutomationPlugin</span>
{
    [<span class="code-fn">CommandMethod</span>(<span class="code-str">"RAP_VALIDATE_STANDARDS"</span>)]
    <span class="code-keyword">public void</span> <span class="code-fn">AuditDrawingStandards</span>()
    {
        <span class="code-class">Document</span> doc = <span class="code-class">Application</span>.DocumentManager.MdiActiveDocument;
        <span class="code-class">Database</span> db = doc.Database;
        DrawingAuditor.ExecuteValidation(db, exportToExcel: <span class="code-keyword">true</span>);
        doc.Editor.WriteMessage(<span class="code-str">"\\n[RAP] Drawing validation completed successfully."</span>);
    }
}`
    },
    bricscad: {
      file: 'RapBricsCADEntityProcessor.cs',
      code: `<span class="code-comment">// RAP Technologies - BricsCAD C# .NET API Extension</span>
<span class="code-keyword">using</span> Bricscad.ApplicationServices;
<span class="code-keyword">using</span> Bricscad.EditorInput;
<span class="code-keyword">using</span> Teigha.DatabaseServices;

<span class="code-keyword">public class</span> <span class="code-class">BricsCADCustomTools</span>
{
    [<span class="code-fn">CommandMethod</span>(<span class="code-str">"RAP_BATCH_EXPORT"</span>)]
    <span class="code-keyword">public void</span> <span class="code-fn">ExportBricsCADBOM</span>()
    {
        <span class="code-class">Database</span> db = <span class="code-class">HostApplicationServices</span>.WorkingDatabase;
        using (<span class="code-class">Transaction</span> tr = db.TransactionManager.StartTransaction())
        {
            BricsManager.ExtractEntities(tr, db, <span class="code-str">"OUTPUT_BOM.xlsx"</span>);
            tr.Commit();
        }
    }
}`
    },
    intellicad: {
      file: 'RapIntelliCADLisp.lsp',
      code: `<span class="code-comment">;; RAP Technologies - IntelliCAD Custom LISP Automation</span>
(<span class="code-keyword">defun</span> <span class="code-fn">c:RAP_CLEANUP_DRAWING</span> (/ ss doc i ent)
  (<span class="code-keyword">vl-load-com</span>)
  (<span class="code-fn">princ</span> <span class="code-str">"\\n[RAP] Initiating IntelliCAD Drawing Optimization..."</span>)
  (<span class="code-keyword">setq</span> ss (<span class="code-fn">ssget</span> <span class="code-str">"X"</span> '((0 . <span class="code-str">"INSERT,LWPOLYLINE"</span>))))
  (<span class="code-keyword">if</span> ss
    (<span class="code-keyword">progn</span>
      (<span class="code-fn">rap_audit_blocks</span> ss)
      (<span class="code-fn">princ</span> <span class="code-str">"\\n[RAP] Optimization complete. Standards verified."</span>)
    )
  )
  (<span class="code-fn">princ</span>)
)`
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetPlatform = btn.dataset.platform;
      const snippet = codeSnippets[targetPlatform];

      if (snippet) {
        codeBody.innerHTML = `<pre><code>${snippet.code}</code></pre>`;
        if (codeFilename) {
          codeFilename.textContent = snippet.file;
        }
      }
    });
  });
}

/**
 * Smooth Anchor Scrolling
 */
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 76;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        const navMenu = document.querySelector('.nav-menu');
        const toggleBtn = document.querySelector('.mobile-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          document.body.classList.remove('menu-open');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
}

/**
 * Enquiry Form Handling
 */
function initEnquiryForm() {
  const form = document.getElementById('projectEnquiryForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="fullName"]')?.value.trim();
    const email = form.querySelector('[name="businessEmail"]')?.value.trim();
    const consent = form.querySelector('[name="ndaConsent"]')?.checked;

    if (!name || !email) {
      alert('Please fill in required fields (Name and Business Email).');
      return;
    }

    if (!consent) {
      alert('Please acknowledge the privacy and confidentiality statement.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Enquiry...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = '<strong>Thank you!</strong> Your project enquiry has been submitted. Our engineering team will review your specifications and contact you under strict NDA within 24 business hours.';
        feedback.style.display = 'block';
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1000);
  });
}

/**
 * Portfolio Interactive Filtering & Lightbox
 */
function initPortfolioGallery() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const cards = document.querySelectorAll('.portfolio-item-card');
  const lightbox = document.getElementById('portfolioLightbox');

  if (!cards.length) return;

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // Lightbox
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxBadge = document.getElementById('lightboxBadge');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const backdrop = lightbox.querySelector('.lightbox-backdrop');

  let currentVisibleCards = [];
  let currentIndex = 0;

  function updateVisibleCards() {
    currentVisibleCards = Array.from(cards).filter(c => !c.classList.contains('is-hidden'));
  }

  function openLightbox(card) {
    updateVisibleCards();
    currentIndex = currentVisibleCards.indexOf(card);
    if (currentIndex === -1) currentIndex = 0;
    renderLightboxItem();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderLightboxItem() {
    if (!currentVisibleCards.length) return;
    const currentCard = currentVisibleCards[currentIndex];
    const img = currentCard.querySelector('.portfolio-thumb-img');
    const badge = currentCard.querySelector('.portfolio-badge');
    const title = currentCard.querySelector('.portfolio-card-title');
    const desc = currentCard.querySelector('.portfolio-card-desc');

    if (lightboxImg && img) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.opacity = '1';
      }, 100);
    }
    if (lightboxBadge && badge) lightboxBadge.textContent = badge.textContent;
    if (lightboxTitle && title) lightboxTitle.textContent = title.textContent;
    if (lightboxDesc && desc) lightboxDesc.textContent = desc.textContent;
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentIndex + 1) + " / " + currentVisibleCards.length;
    }
  }

  function nextItem() {
    if (!currentVisibleCards.length) return;
    currentIndex = (currentIndex + 1) % currentVisibleCards.length;
    renderLightboxItem();
  }

  function prevItem() {
    if (!currentVisibleCards.length) return;
    currentIndex = (currentIndex - 1 + currentVisibleCards.length) % currentVisibleCards.length;
    renderLightboxItem();
  }

  cards.forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextItem(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevItem(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextItem();
    if (e.key === 'ArrowLeft') prevItem();
  });
}
