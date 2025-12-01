$(function(){
  const $feed = $('#feed');
  const $loader = $('#loader');
  const $loadMore = $('#loadMore');
  const $autoLoad = $('#autoLoad');
  const $toast = $('#toast');

  let isLoading = false;
  let queued = 0;
  // track seen article titles to avoid duplicates (helps when API or client caches responses)
  const seenTitles = new Set();

  // Wikipedia REST endpoints
  const RANDOM_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';

  function showToast(msg, timeout=3000){
    $toast.text(msg).removeClass('hidden');
    setTimeout(()=> $toast.addClass('hidden'), timeout);
  }

  function renderCard(item){
    const $card = $('<article>').addClass('card').attr('tabindex',0);
    // favorite star
  const $star = $('<button>').attr('type','button').addClass('fav-star').attr('aria-label','Save to favorites').html('☆');
    $card.append($star);
    const $thumbWrap = $('<div>').addClass('thumb');
    const $img = $('<img>').attr('alt', item.title).attr('loading','lazy');
    if(item.thumbnail && item.thumbnail.source){
      $img.attr('src', item.thumbnail.source);
    } else {
      // transparent placeholder - CSS will show background color
      $img.attr('src', '');
    }
    $thumbWrap.append($img);

  // overlay contains at-least-400-char preview starting at image midpoint
  const $overlay = $('<div>').addClass('overlay');
  const full = item.extract || '';
  const preview400 = full.length > 400 ? full.slice(0,400).trim() + '…' : full;
  // small title on overlay and scrollable preview
  const $ovTitle = $('<div>').addClass('ov-title').text(item.title);
  const $ovText = $('<div>').addClass('overlay-text').text(preview400);
  $overlay.append($ovTitle).append($ovText);
  $card.append($thumbWrap).append($overlay);

  // card body contains title and the full extract (show all text)
  const $body = $('<div>').addClass('card-body');
  $card.append($body);

    // store full item data for modal
    $card.data('item', item);

    // initialize star state
    const id = item.pageid || item.title || JSON.stringify(item);
    if(isFavorited(id)){
      $star.addClass('active').html('★');
    }

    $star.on('click', (e)=>{
      e.stopPropagation();
      if(isFavorited(id)){
        removeFavorite(id);
        $star.removeClass('active').html('☆');
      } else {
        addFavorite(id, item);
        $star.addClass('active').html('★');
      }
      // if viewing favorites, refresh feed
      if(viewingFavorites()) renderFavoritesView();
    });

    // click to open modal
    $card.on('click keypress', function(e){
      if(e.type === 'keypress' && e.key !== 'Enter' && e.key !== ' ') return;
      openModal($(this).data('item'));
    });

    $feed.append($card);
  }

  // Favorites storage (localStorage with cookie fallback)
  const FAVORITES_KEY = 'smartscroll_favorites_v1';

  function loadFavorites(){
    try{
      const raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : {};
    }catch(e){
      // fallback to cookie
      const c = document.cookie.split('; ').find(row=>row.startsWith(FAVORITES_KEY+'='));
      return c ? JSON.parse(decodeURIComponent(c.split('=')[1])) : {};
    }
  }

  function saveFavorites(obj){
    try{
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(obj));
    }catch(e){
      document.cookie = FAVORITES_KEY + '=' + encodeURIComponent(JSON.stringify(obj)) + '; path=/; max-age=31536000';
    }
  }

  function isFavorited(id){
    const favs = loadFavorites();
    return favs.hasOwnProperty(id);
  }

  function addFavorite(id, item){
    const favs = loadFavorites();
    favs[id] = item;
    saveFavorites(favs);
  }

  function removeFavorite(id){
    const favs = loadFavorites();
    delete favs[id];
    saveFavorites(favs);
  }

  // View mode: favorites or all
  function viewingFavorites(){
    return $('#toggleFavorites').data('active') === true;
  }

  function renderFavoritesView(){
    $feed.empty();
    const favs = loadFavorites();
    const keys = Object.keys(favs);
    if(keys.length === 0){
      showToast('No favorites saved');
      return;
    }
    keys.forEach(k=> renderCard(favs[k]));
  }

  // Toggle favorites button
  $('#toggleFavorites').on('click', function(){
    const $btn = $(this);
    const active = $btn.data('active') === true;
    if(active){
      // switch to all
      $btn.data('active', false).text('★ Favorites');
      $feed.empty();
      // reset seen titles to allow refetch
      seenTitles.clear();
      fetchRandom(6);
    } else {
      $btn.data('active', true).text('Show all');
      renderFavoritesView();
    }
  });

  // Modal helpers
  const $modal = $('#modal');
  const $modalTitle = $modal.find('.modal-title');
  const $modalExtract = $modal.find('.modal-extract');
  const $modalImage = $modal.find('.modal-image img');
  const $modalLink = $modal.find('.modal-link');
  const $modalFav = $('#modalFav');

  function openModal(item){
    if(!item) return;
    $modalImage.attr('src', item.thumbnail?.source || '');
    $modalImage.attr('alt', item.title || '');
    $modalTitle.text(item.title || '');
    // Show up to 1000 characters in the modal extract to avoid overly long content
    const fullText = item.extract || '';
    const modalText = fullText.length > 1500 ? fullText.slice(0,1500).trim() + '…' : fullText;
    $modalExtract.text(modalText);
    $modalLink.attr('href', item.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`);
    // set modal favorite state
    const id = item.pageid || item.title || JSON.stringify(item);
    if(isFavorited(id)){
      $modalFav.addClass('active').text('★').attr('aria-pressed', 'true');
    } else {
      $modalFav.removeClass('active').text('☆').attr('aria-pressed', 'false');
    }

    $modal.removeClass('hidden').attr('aria-hidden','false');
    setTimeout(()=> $modal.find('.modal-close').focus(), 50);
  }

  // modal favorite toggle
  $modalFav.on('click', function(e){
    e.preventDefault();
    // determine currently-open item by modal title matching stored items in feed or favorites
    const title = $modalTitle.text();
    // try to find a matching item in the feed DOM
    let $sourceCard = $feed.find('.card').filter(function(){
      return $(this).data('item')?.title === title;
    }).first();

    const currentItem = $sourceCard.length ? $sourceCard.data('item') : null;
    // if not found in DOM, try favorites store
    const id = (currentItem && (currentItem.pageid || currentItem.title)) || title;
    if(isFavorited(id)){
      removeFavorite(id);
      $modalFav.removeClass('active').text('☆').attr('aria-pressed','false');
      // update corresponding card star if present
      if($sourceCard.length) $sourceCard.find('.fav-star').removeClass('active').text('☆');
    } else {
      const itemToSave = currentItem || { title };
      addFavorite(id, itemToSave);
      $modalFav.addClass('active').text('★').attr('aria-pressed','true');
      if($sourceCard.length) $sourceCard.find('.fav-star').addClass('active').text('★');
    }
    // if viewing favorites, re-render
    if(viewingFavorites()) renderFavoritesView();
  });

  function closeModal(){
    $modal.addClass('hidden').attr('aria-hidden','true');
  }

  // modal events
  $modal.on('click', '[data-close]', closeModal);
  $modal.find('.modal-close').on('click', closeModal);
  $(document).on('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

  function fetchRandom(count=1){
    if(isLoading) return Promise.resolve();
    isLoading = true;
    $loader.removeClass('hidden').text('Loading…');

    const requests = [];
    for(let i=0;i<count;i++){
      // disable caching to avoid Safari/iOS returning cached responses for the same URL
      requests.push($.ajax({url: RANDOM_ENDPOINT, method:'GET', dataType:'json', cache: false}));
    }

  return Promise.allSettled(requests).then(results=>{
      let added = 0;
      results.forEach(r=>{
        if(r.status === 'fulfilled' && r.value){
          const title = r.value.title || '';
          if(seenTitles.has(title)){
            // skip duplicates
            return;
          }
          renderCard(r.value);
          seenTitles.add(title);
          added++;
        }
      });
      if(added === 0){
        showToast('No articles loaded — try again');
      }
    }).catch(err=>{
      console.error('fetch error',err);
      showToast('Network error — could not load articles');
    }).finally(()=>{
      isLoading = false;
      $loader.addClass('hidden');
    });
  }

  // Initial load
  fetchRandom(6);

  // Load more button
  $loadMore.on('click', ()=>{
    fetchRandom(4);
  });

  // Infinite scroll
  let scrollTimer = null;
  $(window).on('scroll', ()=>{
    if(!$autoLoad.is(':checked')) return;
    if(scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(()=>{
      const nearBottom = $(window).scrollTop() + $(window).height() > $(document).height() - 320;
      if(nearBottom && !isLoading){
        fetchRandom(3);
      }
    }, 120);
  });

});
