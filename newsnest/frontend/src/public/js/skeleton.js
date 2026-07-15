const Skeleton = {
  cards(count = 6) {
    return Array.from({ length: count })
      .map(() => `
        <div class="article-card skeleton-card">
          <div class="skeleton" style="height:55%;width:100%;"></div>
          <div style="padding:18px 20px;display:flex;flex-direction:column;gap:10px;">
            <div class="skeleton" style="height:12px;width:40%;"></div>
            <div class="skeleton" style="height:18px;width:90%;"></div>
            <div class="skeleton" style="height:18px;width:70%;"></div>
          </div>
        </div>
      `)
      .join('');
  },
  categories(count = 8) {
    return Array.from({ length: count })
      .map(() => `<div class="skeleton" style="height:110px;"></div>`)
      .join('');
  }
};

window.Skeleton = Skeleton;
