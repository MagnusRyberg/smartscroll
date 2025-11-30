$(function(){
  const $articles = $('#articles');
  const $loading = $('#loading');
  const $error = $('#error');
  const $loadMore = $('#load-more');

  function renderArticles(list){
    list.forEach(a => {
      const imagePart = a.thumbnail ? `<img class="article-image" src="${a.thumbnail}" alt="${a.title}"/>` : '<div class="placeholder-image">No image</div>';

      const $el = $(
        `<div class="article-card">
          ${imagePart}
          <div class="article-content">
            <div class="article-title">${a.title}</div>
            <div class="article-text">${a.extract || ''}</div>
            ${a.url ? `<a class="read-more-link" href="${a.url}" target="_blank" rel="noopener noreferrer">Open on Wikipedia</a>` : ''}
          </div>
        </div>`
      );
      $articles.append($el);
    });
  }

  function showLoading(show){
    $loading.toggleClass('hidden', !show);
  }

  function showError(msg){
    $error.text(msg).toggleClass('hidden', !msg);
  }

  function fetchArticles(count=5){
    showError('');
    showLoading(true);

    $.ajax({
      url: '/api/random-articles?count=' + count,
      method: 'GET',
      dataType: 'json'
    }).done(function(data){
      renderArticles(data);
    }).fail(function(jqXHR, textStatus, err){
      console.error('Error fetching articles:', textStatus, err);
      showError('Failed to fetch articles');
    }).always(function(){
      showLoading(false);
    });
  }

  $loadMore.on('click', function(){ fetchArticles(5); });

  // Initial load
  fetchArticles(5);
});
