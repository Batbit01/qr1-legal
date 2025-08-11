
(function(){
  // Try central path first, then local fallback
  const CANDIDATE_URLS = ['/assets/lang/qr1_labels_ue.json', 'qr1_labels_ue.json'];

  // Native names for selector
  const NATIVE = {
    bg:'Български', cs:'Čeština', da:'Dansk', de:'Deutsch', et:'Eesti', el:'Ελληνικά',
    en:'English', es:'Español', fr:'Français', ga:'Gaeilge', hr:'Hrvatski', it:'Italiano',
    lv:'Latviešu', lt:'Lietuvių', hu:'Magyar', mt:'Malti', nl:'Nederlands', pl:'Polski',
    pt:'Português', ro:'Română', sk:'Slovenčina', sl:'Slovenščina', fi:'Suomi', sv:'Svenska'
  };

  // Map keys in JSON -> element IDs in your HTML
  const BIND = {
    title:       'title',
    subtitle:    'subtitle',
    ingredients: 'ingredientsTitle',
    nutrition:   'nutritionTitle',
    allergens:   'allergensTitle',
    alcohol:     'alcoholTitle',
    more:        'footerMore',
    view:        'qr2link'
  };

  function getInitialLang(dict){
    const qs = new URLSearchParams(location.search);
    const fromUrl = (qs.get('idioma') || qs.get('lang') || '').slice(0,2).toLowerCase();
    const ls1 = (localStorage.getItem('idiomaPreferido') || '').slice(0,2).toLowerCase();
    const ls2 = (localStorage.getItem('qr1.lang') || '').slice(0,2).toLowerCase();
    const fromLS = ls1 || ls2;
    const fromNav = (navigator.language || 'en').slice(0,2).toLowerCase();
    return [fromUrl, fromLS, fromNav, 'en'].find(l => l && dict[l]) || 'en';
  }

  function setUrlLang(lang){
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    url.searchParams.set('idioma', lang);
    history.replaceState({}, '', url.toString());
  }

  function updateQr2Links(lang){
    // Update main link if present
    const main = document.getElementById('qr2link');
    const updateHref = (a) => {
      try{
        const u = new URL(a.href, location.href);
        u.searchParams.set('lang', lang);
        u.searchParams.set('idioma', lang);
        a.href = u.toString();
      }catch(e){/* ignore */}
    };
    if (main) updateHref(main);
    // Any extra QR2 links can be marked with data-qr2
    document.querySelectorAll('a[data-qr2]').forEach(updateHref);
  }

  function apply(dict, lang){
    const t = dict[lang] || dict.en;
    if (!t) return;
    Object.entries(BIND).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (!el || !t[key]) return;
      el.textContent = t[key];
    });
    // Persist preference in both keys for compat
    localStorage.setItem('idiomaPreferido', lang);
    localStorage.setItem('qr1.lang', lang);
    // Sync URL & links
    setUrlLang(lang);
    updateQr2Links(lang);
    // Notify other modules if needed
    document.dispatchEvent(new CustomEvent('qr1:lang-changed', { detail:{ lang } }));
  }

  function hijackSelect(sel, dict){
    // Remove existing listeners by cloning node
    const clone = sel.cloneNode(true);
    clone.id = sel.id; // preserve id
    sel.parentNode.replaceChild(clone, sel);
    clone.addEventListener('change', () => apply(dict, clone.value));
    return clone;
  }

  async function loadDict(){
    for (const url of CANDIDATE_URLS){
      try{
        const res = await fetch(url, { cache:'no-cache' });
        if (res.ok) return await res.json();
      }catch(e){/* try next */}
    }
    throw new Error('Cannot load qr1 labels from any known path.');
  }

  async function init(){
    try{
      const dict = await loadDict();
      const sel = document.getElementById('lang');

      // Populate selector with languages available in JSON
      if (sel){
        sel.innerHTML = Object.keys(dict)
          .map(code => `<option value="${code}">${NATIVE[code] || code}</option>`)
          .join('');
      }

      const initial = getInitialLang(dict);
      let control = sel ? hijackSelect(sel, dict) : null;
      if (control) control.value = initial;
      apply(dict, initial);

    }catch(err){
      console.error('QR1 i18n init failed:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
