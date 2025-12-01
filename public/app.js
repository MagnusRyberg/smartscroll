$(function(){
  const $feed = $('#feed');
  const $loader = $('#loader');
  const $loadMore = $('#loadMore');
  const $autoLoad = $('#autoLoad');
  const $toast = $('#toast');

  let isLoading = false;
  let queued = 0;

  // Wikipedia REST endpoints
  const RANDOM_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';

  function showToast(msg, timeout=3000){
    $toast.text(msg).removeClass('hidden');
    setTimeout(()=> $toast.addClass('hidden'), timeout);
  }

  function renderCard(item){
    const $card = $('<article>').addClass('card').attr('tabindex',0);
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
  $body.append($('<h3>').addClass('title').text(item.title));
  $body.append($('<p>').addClass('extract').text(item.extract || 'No summary available.'));
  $card.append($body);

    // store full item data for modal
    $card.data('item', item);

    // click to open modal
    $card.on('click keypress', function(e){
      if(e.type === 'keypress' && e.key !== 'Enter' && e.key !== ' ') return;
      openModal($(this).data('item'));
    });

    $feed.append($card);
  }

  // Modal helpers
  const $modal = $('#modal');
  const $modalTitle = $modal.find('.modal-title');
  const $modalExtract = $modal.find('.modal-extract');
  const $modalImage = $modal.find('.modal-image img');
  const $modalLink = $modal.find('.modal-link');

  function openModal(item){
    if(!item) return;
    $modalImage.attr('src', item.thumbnail?.source || '');
    $modalImage.attr('alt', item.title || '');
    $modalTitle.text(item.title || '');
    $modalExtract.text(item.extract || '');
    $modalLink.attr('href', item.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`);
    $modal.removeClass('hidden').attr('aria-hidden','false');
    setTimeout(()=> $modal.find('.modal-close').focus(), 50);
  }

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
      requests.push($.ajax({url: RANDOM_ENDPOINT, method:'GET', dataType:'json'}));
    }

  return Promise.allSettled(requests).then(results=>{
      let added = 0;
      results.forEach(r=>{
        if(r.status === 'fulfilled' && r.value){
          renderCard(r.value);
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
