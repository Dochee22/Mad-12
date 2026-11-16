(() => {
  const cfg = window.MAD12_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const money = (n) => new Intl.NumberFormat(cfg.locale || 'fr-FR').format(Number(n || 0)) + ' FCFA';
  let client = null, products = [], categories = [], cart = JSON.parse(localStorage.getItem('mad12-cart') || '[]'), activeCategory = 'all';
  if (window.supabase && cfg.supabaseUrl && !cfg.supabaseUrl.startsWith('REMPLACER') && cfg.supabaseAnonKey && !cfg.supabaseAnonKey.startsWith('REMPLACER')) {
    client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  }
  $('year').textContent = new Date().getFullYear();

  function persist(){ localStorage.setItem('mad12-cart', JSON.stringify(cart)); renderCart(); }
  function renderFilters(){
    const holder = $('categoryFilters');
    holder.innerHTML = '<button class="filter '+(activeCategory==='all'?'active':'')+'" data-category="all">Tout</button>';
    categories.forEach(c => {
      const b = document.createElement('button'); b.className='filter '+(activeCategory===c.id?'active':''); b.dataset.category=c.id; b.textContent=c.name; holder.appendChild(b);
    });
  }
  function renderProducts(){
    const q = $('searchInput').value.trim().toLowerCase();
    const visible = products.filter(p => (activeCategory==='all' || p.category_id===activeCategory) && (`${p.name||''} ${p.description||''}`).toLowerCase().includes(q));
    const grid=$('productGrid'); grid.innerHTML='';
    if(!visible.length){ grid.innerHTML='<p class="state-message">Aucun article publié dans cette sélection pour le moment.</p>'; return; }
    visible.forEach(p=>{
      const card=document.createElement('article'); card.className='product-card';
      const img=document.createElement('div'); img.className='product-image';
      const imageUrl=p.image_url || (p.product_images && p.product_images[0] && p.product_images[0].url);
      if(imageUrl){const im=document.createElement('img'); im.src=imageUrl; im.alt=p.name||'Produit MAD12'; im.loading='lazy'; img.appendChild(im);} else img.textContent='MAD12';
      const info=document.createElement('div'); info.className='product-info';
      const cat=categories.find(c=>c.id===p.category_id);
      info.innerHTML=`<div class="product-category"></div><h3></h3><div class="product-price"></div><button class="add-button">Ajouter au panier</button>`;
      info.querySelector('.product-category').textContent=cat?.name || 'MAD12';
      info.querySelector('h3').textContent=p.name || 'Article';
      info.querySelector('.product-price').textContent=money(p.price);
      info.querySelector('button').addEventListener('click',()=>{const found=cart.find(x=>x.id===p.id); if(found)found.quantity++; else cart.push({id:p.id,name:p.name,price:Number(p.price),quantity:1}); persist();});
      card.append(img,info); grid.appendChild(card);
    });
  }
  function renderCart(){
    $('cartCount').textContent=cart.reduce((s,x)=>s+x.quantity,0);
    $('cartTotal').textContent=money(cart.reduce((s,x)=>s+x.price*x.quantity,0));
    const holder=$('cartItems'); holder.innerHTML='';
    if(!cart.length){holder.innerHTML='<p class="state-message">Ton panier est vide.</p>';$('checkoutButton').disabled=true;return;}
    $('checkoutButton').disabled=false;
    cart.forEach(item=>{
      const row=document.createElement('div');row.className='cart-row';
      const detail=document.createElement('div');detail.innerHTML='<strong></strong><small></small>';detail.querySelector('strong').textContent=item.name;detail.querySelector('small').textContent=money(item.price);
      const qty=document.createElement('div');qty.className='qty-controls';
      const minus=document.createElement('button');minus.textContent='−';minus.setAttribute('aria-label','Diminuer');
      const count=document.createElement('span');count.textContent=item.quantity;
      const plus=document.createElement('button');plus.textContent='+';
      minus.onclick=()=>{item.quantity--;if(item.quantity<=0)cart=cart.filter(x=>x.id!==item.id);persist();};
      plus.onclick=()=>{item.quantity++;persist();};
      qty.append(minus,count,plus);row.append(detail,qty);holder.appendChild(row);
    });
  }
  async function load(){
    if(!client){$('productGrid').innerHTML='<p class="state-message">Catalogue non connecté. La configuration Supabase doit être renseignée avant d’afficher les articles.</p>';renderCart();return;}
    const [cats,prods]=await Promise.all([
      client.from('categories').select('id,name').eq('is_active',true).order('name'),
      client.from('products').select('id,name,description,price,category_id,product_images(url)').eq('is_active',true).order('created_at',{ascending:false})
    ]);
    if(cats.error || prods.error){$('productGrid').innerHTML='<p class="state-message">Impossible de charger le catalogue. Vérifier la configuration et les règles d’accès.</p>';return;}
    categories=cats.data||[]; products=prods.data||[]; renderFilters(); renderProducts(); renderCart();
  }
  $('categoryFilters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;activeCategory=b.dataset.category;renderFilters();renderProducts();});
  $('searchInput').addEventListener('input',renderProducts);
  function toggleCart(open){$('cartPanel').classList.toggle('open',open);$('scrim').classList.toggle('show',open);$('cartPanel').setAttribute('aria-hidden',String(!open));}
  $('cartOpen').onclick=()=>toggleCart(true);$('cartClose').onclick=()=>toggleCart(false);$('scrim').onclick=()=>toggleCart(false);
  $('checkoutButton').onclick=()=>alert("Le panier est prêt. L'envoi réel d'une commande sera activé après le déploiement de la fonction serveur sécurisée qui vérifie les prix et les stocks.");
  renderCart(); load();
})();
