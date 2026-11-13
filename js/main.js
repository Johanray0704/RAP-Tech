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
  initFileUploadHandler();
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
    if (!isExpanded) {
      navMenu.scrollTop = 0; // Ensure Home button is always cleanly visible at the top
    }
  });

  // Mobile submenu accordion
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1460) {
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
      if (window.innerWidth <= 1380) {
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
 * Enquiry Form Handling with Dual Delivery (Email + WhatsApp) & File Metadata
 */
function initEnquiryForm() {
  const form = document.getElementById('projectEnquiryForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="fullName"]')?.value.trim();
    const company = form.querySelector('[name="companyName"]')?.value.trim();
    const email = form.querySelector('[name="businessEmail"]')?.value.trim();
    const country = (form.querySelector('[name="country"]') || form.querySelector('[name="countryLocation"]'))?.value.trim();
    const phone = (form.querySelector('[name="phone"]') || form.querySelector('[name="phoneNumber"]'))?.value.trim();
    const service = form.querySelector('[name="serviceRequired"]')?.value.trim();
    const cadSoftware = form.querySelector('[name="cadSoftware"]')?.value.trim();
    const scope = (form.querySelector('[name="projectDescription"]') || form.querySelector('[name="projectScope"]'))?.value.trim();
    const consent = (form.querySelector('[name="ndaConsent"]') || form.querySelector('#ndaConsentCheck'))?.checked;
    const accessKeyInput = form.querySelector('[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '410bd810-3ecf-4177-91ec-199e1de25e80';

    if (!name || !email) {
      alert('Please fill in required fields (Name and Business Email).');
      return;
    }

    if (!consent) {
      alert('Please acknowledge the privacy and confidentiality statement.');
      return;
    }

    // Check if an attachment is selected
    const fileInput = form.querySelector('input[type="file"]');
    const selectedFile = (fileInput && fileInput.files && fileInput.files.length > 0) ? fileInput.files[0] : null;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Enquiry & Connecting...';

    // Format clean professional WhatsApp lead message for MD (+91 9444167875)
    let msg = "*NEW PROJECT ENQUIRY - RAP Technologies*\n";
    msg += "----------------------------------------\n";
    msg += "*Client Name:* " + name + "\n";
    if (company) msg += "*Company:* " + company + "\n";
    msg += "*Business Email:* " + email + "\n";
    if (phone) msg += "*Phone:* " + phone + "\n";
    if (country) msg += "*Location:* " + country + "\n";
    if (service && service !== '-- Select Required Service --') msg += "*Service Required:* " + service + "\n";
    if (cadSoftware) msg += "*CAD Software:* " + cadSoftware + "\n";
    if (selectedFile) {
      const sizeStr = selectedFile.size > 1048576 
        ? (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB'
        : (selectedFile.size / 1024).toFixed(1) + ' KB';
      msg += "*Attached File:* " + selectedFile.name + " (" + sizeStr + ") [Attaching in WhatsApp]\n";
    }
    if (scope) msg += "*Project Scope:*\n" + scope + "\n";
    msg += "----------------------------------------\n";
    msg += "_Confidential Enquiry via RAP Technologies Website (NDA Protected)_";

    const whatsappUrl = "https://wa.me/919444167875?text=" + encodeURIComponent(msg);

    // 1. Send Email in Background via Web3Forms
    try {
      const formData = new FormData(form);
      formData.set('access_key', accessKey);

      // Web3Forms Free plan does not support binary file upload (returns error if binary file attached).
      // We pass the filename & size as text, and omit the binary payload so the email sends cleanly.
      if (selectedFile) {
        formData.append('attached_file_name', selectedFile.name);
        formData.append('attached_file_size', (selectedFile.size / 1024).toFixed(1) + ' KB');
        formData.delete('fileUpload');
      }
      
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      }).then(res => res.json()).then(data => {
        console.log('Web3Forms email delivery status:', data);
      }).catch(err => {
        console.log('Web3Forms background send notice:', err);
      });
    } catch (err) {
      console.log('Web3Forms form data error:', err);
    }

    // 2. Open WhatsApp simultaneously with pre-filled message
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      // Reset file box UI
      const fileBox = form.querySelector('.form-file-box');
      if (fileBox) {
        const promptEl = fileBox.querySelector('.file-upload-prompt');
        const selectedEl = fileBox.querySelector('.file-selected-info');
        if (promptEl) promptEl.style.display = 'block';
        if (selectedEl) selectedEl.style.display = 'none';
        fileBox.classList.remove('has-file');
      }

      if (feedback) {
        feedback.className = 'form-feedback success';
        let feedbackHtml = '<strong>Enquiry Successfully Dispatched!</strong> Your project enquiry has been sent to our inbox, and our Engineering Leadership is connected on WhatsApp (+91 9444167875). We will review your specifications under strict NDA and reply within 24 business hours.';
        if (selectedFile) {
          feedbackHtml += '<br><br><strong>Note on Attached File (' + selectedFile.name + '):</strong> Please tap the attachment/paperclip icon in the opened WhatsApp chat to send your file directly to our MD.';
        }
        feedbackHtml += '<br><br>If WhatsApp did not open automatically, <a href=\"' + whatsappUrl + '\" target=\"_blank\" style=\"color: #0284c7; text-decoration: underline; font-weight: 700;\">click here to send on WhatsApp &rarr;</a>';
        feedback.innerHTML = feedbackHtml;
        feedback.style.display = 'block';
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 600);
  });
}

/**
 * Interactive File Upload Handler (Native Label trigger, Drag & Drop, Max 25MB check, UI feedback)
 */
function initFileUploadHandler() {
  const fileBoxes = document.querySelectorAll('.form-file-box');
  
  fileBoxes.forEach(box => {
    const fileInput = box.querySelector('input[type="file"]');
    const promptEl = box.querySelector('.file-upload-prompt');
    const selectedEl = box.querySelector('.file-selected-info');
    const nameEl = box.querySelector('.file-name-text');
    const sizeBadge = box.querySelector('.file-size-badge');
    const removeBtn = box.querySelector('.file-remove-btn');
    
    if (!fileInput) return;

    // Prevent direct input click from bubbling to label/box to prevent duplicate native events
    fileInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
      box.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        box.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      box.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        box.classList.remove('dragover');
      });
    });

    box.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        fileInput.files = dt.files;
        handleFileSelection(fileInput.files[0]);
      }
    });

    // Change event when user selects a file
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFileSelection(fileInput.files[0]);
      } else {
        clearFile();
      }
    });

    // Remove button click - prevent label from opening file picker
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearFile();
      });
    }

    function handleFileSelection(file) {
      const maxBytes = 25 * 1024 * 1024; // 25 MB limit
      if (file.size > maxBytes) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        alert('File size exceeds the 25 MB limit (' + sizeMb + ' MB).\n\nPlease attach a file under 25 MB, or share a Google Drive / OneDrive / WeTransfer link in the Project Scope description.');
        clearFile();
        return;
      }

      // Format size
      const sizeStr = file.size > 1048576 
        ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        : (file.size / 1024).toFixed(1) + ' KB';

      if (promptEl) promptEl.style.display = 'none';
      if (selectedEl) selectedEl.style.display = 'flex';
      if (nameEl) {
        nameEl.textContent = file.name;
        nameEl.title = file.name;
      }
      if (sizeBadge) sizeBadge.textContent = sizeStr;
      box.classList.add('has-file');
    }

    function clearFile() {
      fileInput.value = '';
      if (promptEl) promptEl.style.display = 'block';
      if (selectedEl) selectedEl.style.display = 'none';
      if (nameEl) nameEl.textContent = '';
      if (sizeBadge) sizeBadge.textContent = '';
      box.classList.remove('has-file');
    }
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