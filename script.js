// 移动端菜单
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle?.addEventListener('click', () => links.classList.toggle('open'));
links?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => links.classList.remove('open'))
);

// 导航高亮 + 回到顶部按钮
const sections = ['intro', 'scenes', 'ai', 'resume', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);
const navItems = links ? [...links.querySelectorAll('a')] : [];
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(link => link.classList.remove('active'));
    item.classList.add('active');
  });
});
const toTop = document.getElementById('toTop');

function onScroll() {
  toTop?.classList.toggle('show', window.scrollY > 500);

  if (!sections.length) return;
  const y = window.scrollY + 120;
  let current = sections[0].id;
  for (const s of sections) {
    if (s.offsetTop <= y) current = s.id;
  }
  navItems.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + current)
  );
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 主视觉视频：鼠标移入播放，移出暂停；若加载失败则隐藏，露出 poster/渐变背景
const hero = document.getElementById('intro');
const video = document.getElementById('heroVideo');

if (hero && video) {
  video.pause();
  hero.addEventListener('mouseenter', () => {
    video.play().catch(() => {});
  });
  hero.addEventListener('mouseleave', () => {
    video.pause();
  });
  hero.addEventListener('touchstart', () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, { passive: true });
}

video?.addEventListener('error', () => { video.style.display = 'none'; });
video?.querySelector('source')?.addEventListener('error', () => {
  video.style.display = 'none';
});

// 按 assets 文件名自动渲染作品：scene/ai-序号-名称01(标签.标签).jpg/mp4
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov'];

const AI_PROJECT_BACKGROUNDS = {
  '深海坠落': '本案例围绕“深海坠落”的沉浸式视觉体验展开，目标是在较短周期内生成具有冲击力的动态视觉内容，用于展示、概念验证或宣传片素材测试。传统方式需要较高的三维制作、流体模拟与后期合成成本，因此本案例尝试通过 AI 生成视频与实时场景工具结合，快速完成视觉探索。',
  '球体视频': '本案例以抽象球体运动与展厅空间展示为核心，探索 AI 视频生成在产品视觉、空间氛围和动态展示中的快速应用，适合用于视觉风格预研与展示素材验证。',
  '文物复刻': '本案例围绕文物数字化复刻流程展开，结合 Trip3D、Unity 与 ZBrush 等工具，对传统文物资产进行快速三维还原、质感验证和展示视频生成。',
  '环物展示': '本案例面向环物展示与视觉包装场景，使用 Image 2.0、Unity 与 RunningHub 串联生成流程，快速完成可用于宣传、提案或资产展示的动态视觉素材。',
  '智能营销Agent': '本案例围绕智能营销 Agent 的内容生产流程展开，结合 CodeX、Seedance、Image 2 与 Claude，探索从创意生成、视觉素材到营销表达的自动化协作方式。',
  '广告植入Agent': '本案例围绕商业短剧与视频内容中的广告植入流程展开，结合 CodeX、Seedance、Image 2 与 Claude，探索从商品分析、剧情适配到植入分镜生成的自动化工作流。',
  '深海科普视频': '本案例围绕深海主题科普内容展开，结合 Seedance、Image 2 与 Claude 快速完成知识脚本、视觉生成和视频表达，适合用于科普传播与展示素材验证。',
  '宇宙科普视频': '本案例围绕宇宙主题科普视频展开，通过多模态 AI 工具协同完成概念设定、画面生成与视频化表达，用于验证科普类短视频的快速生产流程。'
};

function getWorkBackground(work) {
  if (work.description) return work.description;
  if (work.kind !== 'ai') return '';
  return AI_PROJECT_BACKGROUNDS[work.title] || '本案例基于 AI 生成流程与实时场景工具进行视觉方案探索，重点验证创意方向、动态表现和内容生产效率，适合用于概念预研、展示素材和方案沟通。';
}

function getBackgroundExcerpt(text) {
  return text.length > 54 ? text.slice(0, 54) + '...' : text;
}

function getBilibiliBvid(url) {
  return String(url || '').match(/BV[0-9A-Za-z]+/i)?.[0] || '';
}

function getBilibiliEmbedUrl(url, autoplay = false) {
  if (!url) return '';
  const text = String(url).trim();
  const bv = getBilibiliBvid(text);
  const autoplayValue = autoplay ? 1 : 0;
  if (bv) return `https://player.bilibili.com/player.html?bvid=${bv}&page=1&autoplay=${autoplayValue}`;
  const av = text.match(/(?:av|video\/av)(\d+)/i)?.[1];
  if (av) return `https://player.bilibili.com/player.html?aid=${av}&page=1&autoplay=${autoplayValue}`;
  return '';
}

function getSceneBilibiliLink(order, hasLocalMedia = false) {
  if (hasLocalMedia) return '';
  return window.SCENE_BILIBILI_LINKS?.[order] || window.SCENE_BILIBILI_LINKS?.[String(order)] || '';
}

function getAssetExtension(fileName) {
  const match = fileName.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
}

function getAssetType(fileName) {
  const ext = getAssetExtension(fileName);
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  return 'unknown';
}

const GITHUB_RELEASE_DOWNLOAD_BASE = 'https://github.com/mtcacoin-cell/Personal-Resume/releases/download/V1.0/';
const RELEASE_VIDEO_FILES = {
  'scene-8-静谧草原01（Unity.风格化.PBR.大世界).mp4': 'scene-8-grassland.mp4',
  'ai-1-深海坠落(Seedance.Unity.展厅).MP4': 'ai-1-deep-sea-fall.mp4',
  'ai-2-球体视频(Seedance.Unity.展厅).mp4': 'ai-2-sphere-video.mp4',
  'ai-3-文物复刻(Trip3D.Unity.Zbrush）.mp4': 'ai-3-relic-reconstruction.mp4',
  'ai-4-文物复刻(Trip3D.Unity.Zbrush）.mp4': 'ai-4-relic-reconstruction.mp4',
  'ai-5-环物展示(Image2.Unity.RunningHub）.mp4': 'ai-5-object-display.mp4',
  'ai-6-智能营销Agent08(CodeX.Seedance.Image2.Claude）.mp4': 'ai-6-marketing-agent.mp4',
  'ai-7-广告植入Agent01(CodeX.Seedance.Image2.Claude）.mp4': 'ai-7-product-placement-agent-01.mp4',
  'ai-7-广告植入Agent02(CodeX.Seedance.Image2.Claude）.mp4': 'ai-7-product-placement-agent-02.mp4',
  'ai-8-深海科普视频(Seedance.Image2.Claude）.mp4': 'ai-8-deep-sea-science.mp4',
  'ai-9-宇宙科普视频(Seedance.Image2.Claude）.mp4': 'ai-9-space-science.mp4'
};

function getReleaseAssetUrl(fileName) {
  const assetName = fileName.split(/[\\/]/).pop();
  const releaseName = RELEASE_VIDEO_FILES[assetName] || assetName;
  return GITHUB_RELEASE_DOWNLOAD_BASE + encodeURIComponent(releaseName);
}

function getAssetSrc(fileName, type) {
  return type === 'video' ? getReleaseAssetUrl(fileName) : 'assets/' + fileName;
}

function parseWorkAsset(fileName) {
  const type = getAssetType(fileName);
  if (type === 'unknown') return null;

  const baseName = fileName.split(/[\\/]/).pop();
  const nameWithoutExt = baseName
    .replace(/(\.(jpg|jpeg|png|webp|gif|mp4|webm|mov))+$/i, '')
    .replace(/\s*\(\d+\)$/i, '')
    .replace(/(\.(jpg|jpeg|png|webp|gif|mp4|webm|mov))+$/i, '');
  const coverMatch = nameWithoutExt.match(/^(scene|ai)-(\d+)-(.+)封面$/);
  if (coverMatch) {
    const [, kind, order, rawTitle] = coverMatch;
    return {
      kind,
      order: Number(order),
      title: rawTitle.trim(),
      sequence: 0,
      tags: [],
      type,
      src: getAssetSrc(fileName, type),
      isCover: true
    };
  }

  const match = nameWithoutExt.match(/^(scene|ai)-(\d+)-(.+)[（(]([^）)]+)[）)]$/);
  if (!match) return null;

  const [, kind, order, rawTitle, rawTags] = match;
  const seqMatch = rawTitle.match(/^(.*?)(\d{2})$/);
  const title = (seqMatch ? seqMatch[1] : rawTitle).trim();
  const sequence = seqMatch ? Number(seqMatch[2]) : 1;
  const tags = rawTags.split(/[.。/／、,，]+/).map(tag => tag.trim()).filter(Boolean);

  return {
    kind,
    order: Number(order),
    title,
    sequence,
    tags,
    type,
    src: getAssetSrc(fileName, type)
  };
}

function getWorks(kind) {
  const files = Array.isArray(window.ASSET_FILES) ? window.ASSET_FILES : [];
  const groups = new Map();

  files.map(parseWorkAsset).filter(item => item && item.kind === kind).forEach(item => {
    if (!groups.has(item.order)) {
      groups.set(item.order, {
        kind: item.kind,
        order: item.order,
        title: item.title,
        tags: item.tags,
        cover: null,
        media: []
      });
    }
    const group = groups.get(item.order);
    group.title = item.title;
    if (item.tags.length) group.tags = item.tags;
    if (item.isCover) {
      group.cover = item.src;
    } else {
      group.media.push({ src: item.src, sequence: item.sequence, type: item.type });
    }
  });

  const sceneDetails = window.SCENE_DETAILS || {};
  if (kind === 'scene') {
    Object.keys(sceneDetails).forEach(orderKey => {
      const order = Number(orderKey);
      const detail = sceneDetails[orderKey];
      if (!groups.has(order)) {
        groups.set(order, {
          kind: 'scene',
          order,
          title: detail.title,
        tags: detail.tags || [],
        cover: detail.cover || null,
          media: []
        });
      }
    });
  }

  return [...groups.values()]
    .sort((a, b) => a.order - b.order)
    .map(work => {
      const detail = work.kind === 'scene' ? sceneDetails[work.order] || sceneDetails[String(work.order)] : null;
      const bilibiliUrl = work.kind === 'scene' ? getSceneBilibiliLink(work.order, work.media.length > 0) : '';
      return {
        ...work,
        title: detail?.title || work.title,
        tags: detail?.tags || work.tags,
        cover: detail?.cover || work.cover,
        description: detail?.description || '',
        bilibiliUrl,
        bilibiliEmbed: getBilibiliEmbedUrl(bilibiliUrl),
        media: work.media.sort((a, b) => a.sequence - b.sequence)
      };
    });
}

function mediaMarkup(media, title, active) {
  const activeClass = active ? ' active' : '';
  const coverClass = media.isCover ? ' work-media__cover' : ''; 
  if (media.type === 'video') {
    return `<video class="work-media__item work-media__video${activeClass}${coverClass}" src="${media.src}" muted loop playsinline preload="metadata" aria-label="${title}"></video>`;
  }
  return `<img class="work-media__item${activeClass}${coverClass}" src="${media.src}" alt="${title}" loading="lazy" onerror="this.classList.add('img--ph')" />`;
}

function getFeaturedSceneRank(work) {
  const tags = work.tags.join(' ');
  if (/二次元|风格化/.test(tags)) return 1;
  if (/\bUE\b|UE\d|Unreal/i.test(tags)) return 2;
  if (/轻量化/.test(tags)) return 3;
  return 4;
}

function renderWorkCards(kind, containerId, metaLabel, limit, sortMode) {
  const container = document.getElementById(containerId);
  if (!container) return [];

  const works = getWorks(kind);
  let visibleWorks = sortMode === 'featured-scene'
    ? [...works].sort((a, b) => getFeaturedSceneRank(a) - getFeaturedSceneRank(b) || a.order - b.order)
    : works;
  visibleWorks = typeof limit === 'number' ? visibleWorks.slice(0, limit) : visibleWorks;
  window.WORK_COLLECTIONS = window.WORK_COLLECTIONS || {};
  window.WORK_COLLECTIONS[kind] = works;
  if (kind === 'scene') window.SCENE_WORKS = works;

  container.innerHTML = visibleWorks.map(work => {
    const workIndex = works.indexOf(work);
    const hasVideo = work.media.some(item => item.type === 'video');
    const hasVideoCover = Boolean(work.cover && hasVideo);
    const previewMedia = work.cover
      ? [{ src: work.cover, type: 'image', isCover: true }, ...work.media.filter(item => item.type === 'video')]
      : work.media;
    const media = previewMedia.length
      ? previewMedia.map((item, index) => mediaMarkup(item, work.title, index === 0)).join('')
      : `<div class="work-media__item work-media__placeholder work-media__bilibili-cover active" data-bvid="${getBilibiliBvid(work.bilibiliUrl)}"><span>B站视频展示</span></div>`;
    const dots = previewMedia.length > 1 && !hasVideoCover ? `
      <div class="scene-carousel__dots">
        ${previewMedia.map((_, index) => `<span class="${index === 0 ? 'active' : ''}"></span>`).join('')}
      </div>
    ` : '';
    const tags = [
      ...work.tags.map(tag => `<span class="tag">${tag}</span>`),
      ...(work.bilibiliUrl ? ['<span class="tag tag--bilibili">B站视频</span>'] : [])
    ].join('');
    const countText = work.bilibiliUrl && !work.media.length ? 'B站视频' : (work.media.length > 1 ? `${work.media.length} 个素材` : (hasVideo ? '视频展示' : '单张展示'));
    const background = getWorkBackground(work);
    const backgroundMarkup = background ? `<p class="card__desc">${getBackgroundExcerpt(background)}</p>` : '';
    const bilibiliPlayMarkup = work.bilibiliUrl ? '<span class="work-media__bilibili-play" aria-hidden="true">▶</span>' : '';

    return `
      <article class="card scene-card work-card${hasVideo ? ' work-card--video' : ''}${hasVideoCover ? ' work-card--cover-video' : ''}${background ? ' work-card--case' : ''}" data-kind="${kind}" data-work-index="${workIndex}" role="button" tabindex="0" aria-label="查看${work.title}作品">
        <div class="card__img ${kind === 'ai' ? 'card__img--wide' : ''} scene-carousel work-media">
          ${media}
          ${bilibiliPlayMarkup}
          ${dots}
        </div>
        <div class="card__body">
          <h3>${work.title}</h3>
          <p class="card__meta">${metaLabel} / ${countText}</p>
          ${backgroundMarkup}
          <div class="tags">${tags}</div>
        </div>
      </article>
    `;
  }).join('');

  return visibleWorks;
}

function startWorkCarousels() {
  document.querySelectorAll('.work-card').forEach(card => {
    if (card.classList.contains('work-card--cover-video')) return;
    const mediaItems = [...card.querySelectorAll('.work-media__item')];
    const dots = [...card.querySelectorAll('.scene-carousel__dots span')];
    if (mediaItems.length <= 1) return;

    let index = 0;
    window.setInterval(() => {
      const current = mediaItems[index];
      if (current.tagName === 'VIDEO') current.pause();
      current.classList.remove('active');
      dots[index]?.classList.remove('active');
      index = (index + 1) % mediaItems.length;
      mediaItems[index].classList.add('active');
      if (mediaItems[index].tagName === 'VIDEO' && card.matches(':hover')) {
        mediaItems[index].play().catch(() => {});
      }
      dots[index]?.classList.add('active');
    }, 2600);
  });
}

function bindVideoHoverPlayback() {
  document.querySelectorAll('.work-card--video').forEach(card => {
    const videos = [...card.querySelectorAll('video')];
    const cover = card.querySelector('.work-media__cover');
    card.addEventListener('mouseenter', () => {
      if (card.classList.contains('work-card--cover-video')) {
        const video = videos[0];
        if (!video) return;
        cover?.classList.remove('active');
        video.classList.add('active');
        video.currentTime = 0;
        video.play().catch(() => {});
        return;
      }
      const activeVideo = videos.find(item => item.classList.contains('active')) || videos[0];
      activeVideo?.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      videos.forEach(item => {
        item.pause();
        if (card.classList.contains('work-card--cover-video')) item.classList.remove('active');
      });
      if (card.classList.contains('work-card--cover-video')) cover?.classList.add('active');
    });
  });
}

function hydrateBilibiliCovers() {
  document.querySelectorAll('.work-media__bilibili-cover[data-bvid]').forEach(async cover => {
    const bvid = cover.dataset.bvid;
    if (!bvid || cover.dataset.loaded) return;
    cover.dataset.loaded = 'true';
    try {
      const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
      const result = await response.json();
      const image = result?.data?.pic;
      if (!image) return;
      cover.style.backgroundImage = `linear-gradient(90deg,rgba(10,24,54,.58),rgba(10,24,54,.18)),url("${image}")`;
      cover.classList.add('loaded');
    } catch (error) {
      cover.dataset.loaded = 'failed';
    }
  });
}

let workModal = null;
let modalWork = null;
let modalMediaIndex = 0;

function createWorkModal() {
  if (workModal) return workModal;

  workModal = document.createElement('div');
  workModal.className = 'scene-modal';
  workModal.innerHTML = `
    <div class="scene-modal__panel" role="dialog" aria-modal="true" aria-label="作品预览">
      <button class="scene-modal__close" type="button" aria-label="关闭">×</button>
      <div class="scene-modal__viewer">
        <span class="scene-modal__count"></span>
        <button class="scene-modal__arrow scene-modal__arrow--prev" type="button" aria-label="上一张">‹</button>
        <img class="scene-modal__img" alt="" />
        <video class="scene-modal__video" playsinline preload="metadata"></video>
        <iframe class="scene-modal__bilibili" title="B站视频展示" allowfullscreen scrolling="no" frameborder="0"></iframe>
        <button class="scene-modal__play" type="button" aria-label="播放视频">▶</button>
        <button class="scene-modal__arrow scene-modal__arrow--next" type="button" aria-label="下一张">›</button>
        <a class="scene-modal__origin" href="#" target="_blank" rel="noopener">查看原图</a>
      </div>
      <div class="scene-modal__body">
        <div class="scene-modal__info">
          <h3 class="scene-modal__title"></h3>
          <div class="tags scene-modal__tags"></div>
        </div>
        <div class="scene-modal__case" hidden>
          <span class="scene-modal__case-label">项目背景</span>
          <p class="scene-modal__case-text"></p>
        </div>
      </div>
      <div class="scene-modal__actions">
        <button class="btn scene-modal__bottom-prev" type="button">← 上一张</button>
        <button class="btn scene-modal__bottom-next" type="button">下一张 →</button>
      </div>
    </div>
  `;
  document.body.appendChild(workModal);

  workModal.addEventListener('click', event => {
    if (event.target === workModal) closeWorkModal();
  });
  workModal.querySelector('.scene-modal__close').addEventListener('click', closeWorkModal);
  workModal.querySelector('.scene-modal__arrow--prev').addEventListener('click', () => switchWorkModalMedia(-1));
  workModal.querySelector('.scene-modal__arrow--next').addEventListener('click', () => switchWorkModalMedia(1));
  workModal.querySelector('.scene-modal__bottom-prev').addEventListener('click', () => switchWorkModalMedia(-1));
  workModal.querySelector('.scene-modal__bottom-next').addEventListener('click', () => switchWorkModalMedia(1));
  workModal.querySelector('.scene-modal__play').addEventListener('click', toggleModalVideoPlayback);
  workModal.querySelector('.scene-modal__video').addEventListener('click', toggleModalVideoPlayback);
  workModal.querySelector('.scene-modal__video').addEventListener('play', () => {
    workModal.querySelector('.scene-modal__play').classList.add('playing');
  });
  workModal.querySelector('.scene-modal__video').addEventListener('pause', () => {
    workModal.querySelector('.scene-modal__play').classList.remove('playing');
  });

  return workModal;
}

function updateWorkModal() {
  if (!workModal || !modalWork) return;
  const media = modalWork.media;
  const current = media[modalMediaIndex] || media[0];
  const hasBilibili = Boolean(modalWork.bilibiliEmbed);
  const hasMultiple = media.length > 1;
  const hasMixedMedia = media.length > 1 && media.some(item => item.type === 'video') && media.some(item => item.type === 'image');
  const isVideo = Boolean(current && current.type === 'video') && !hasBilibili;
  const image = workModal.querySelector('.scene-modal__img');
  const modalVideo = workModal.querySelector('.scene-modal__video');
  const bilibiliFrame = workModal.querySelector('.scene-modal__bilibili');
  const playButton = workModal.querySelector('.scene-modal__play');
  const origin = workModal.querySelector('.scene-modal__origin');

  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalVideo.load();
  bilibiliFrame.removeAttribute('src');
  image.removeAttribute('src');

  workModal.classList.toggle('scene-modal--video', isVideo);
  workModal.classList.toggle('scene-modal--mixed', hasMixedMedia);
  workModal.classList.toggle('scene-modal--bilibili', hasBilibili);
  workModal.querySelector('.scene-modal__count').textContent = `${modalMediaIndex + 1} / ${media.length}`;
  workModal.querySelector('.scene-modal__title').textContent = modalWork.title;
  const modalTags = [...modalWork.tags.map(tag => `<span class="tag">${tag}</span>`), ...(hasBilibili ? ['<span class="tag tag--bilibili">B站视频</span>'] : [])].join('');
  workModal.querySelector('.scene-modal__tags').innerHTML = modalTags;
  const background = getWorkBackground(modalWork);
  const casePanel = workModal.querySelector('.scene-modal__case');
  workModal.querySelector('.scene-modal__case-label').textContent = modalWork.kind === 'scene' ? '项目说明' : '项目背景';
  workModal.querySelector('.scene-modal__case-text').textContent = background;
  casePanel.hidden = !background;
  workModal.classList.toggle('scene-modal--case', Boolean(background));
  if (hasBilibili) {
    origin.href = modalWork.bilibiliUrl;
    origin.textContent = '打开B站';
  } else if (current) {
    origin.href = current.src;
    origin.textContent = isVideo ? '查看原视频' : '查看原图';
  }

  if (hasBilibili) {
    bilibiliFrame.src = getBilibiliEmbedUrl(modalWork.bilibiliUrl, true);
  } else if (isVideo) {
    modalVideo.src = current.src;
    modalVideo.load();
    playButton.classList.remove('playing');
  } else if (current) {
    image.src = current.src;
    image.alt = modalWork.title;
  }

  workModal.querySelectorAll('.scene-modal__arrow,.scene-modal__bottom-prev,.scene-modal__bottom-next').forEach(button => {
    button.disabled = !hasMultiple || hasBilibili;
    button.hidden = !hasMultiple || hasBilibili;
  });
  workModal.querySelector('.scene-modal__count').hidden = !hasMultiple || hasBilibili;
}

function openWorkModal(kind, workIndex, mediaIndex = 0) {
  const works = window.WORK_COLLECTIONS?.[kind] || [];
  modalWork = works[workIndex];
  if (!modalWork) return;

  createWorkModal();
  modalMediaIndex = mediaIndex;
  updateWorkModal();
  workModal.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeWorkModal() {
  workModal?.querySelector('.scene-modal__video')?.pause();
  workModal?.querySelector('.scene-modal__bilibili')?.removeAttribute('src');
  workModal?.classList.remove('open');
  document.body.classList.remove('modal-open');
}

function switchWorkModalMedia(step) {
  if (!modalWork || modalWork.media.length <= 1) return;
  const current = modalWork.media[modalMediaIndex];
  if (current.type === 'video') return;
  modalMediaIndex = (modalMediaIndex + step + modalWork.media.length) % modalWork.media.length;
  updateWorkModal();
}

function toggleModalVideoPlayback() {
  const modalVideo = workModal?.querySelector('.scene-modal__video');
  if (!modalVideo || !workModal?.classList.contains('scene-modal--video')) return;
  if (modalVideo.paused) {
    modalVideo.play().catch(() => {});
  } else {
    modalVideo.pause();
  }
}

function bindWorkCardModal() {
  document.querySelectorAll('.work-card').forEach(card => {
    const kind = card.dataset.kind;
    const workIndex = Number(card.dataset.workIndex);
    card.addEventListener('click', () => openWorkModal(kind, workIndex));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openWorkModal(kind, workIndex);
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (!workModal?.classList.contains('open')) return;
    if (event.key === 'Escape') closeWorkModal();
    if (event.key === 'ArrowLeft') switchWorkModalMedia(-1);
    if (event.key === 'ArrowRight') switchWorkModalMedia(1);
    if (event.key === ' ') {
      event.preventDefault();
      toggleModalVideoPlayback();
    }
  });
}

renderWorkCards('scene', 'sceneCards', '场景作品', 6, 'featured-scene');
renderWorkCards('ai', 'aiCards', 'AI解决案例', 4);
renderWorkCards('scene', 'allSceneCards', '场景作品');
renderWorkCards('ai', 'allAiCaseCards', 'AI解决案例');
hydrateBilibiliCovers();
startWorkCarousels();
bindVideoHoverPlayback();
bindWorkCardModal();

// 背景空白区域樱花花瓣拖尾：canvas 粒子层，不影响点击和阅读
const petalCanvas = document.createElement('canvas');
petalCanvas.className = 'petal-canvas';
document.body.appendChild(petalCanvas);

const petalCtx = petalCanvas.getContext('2d');
const petals = [];
let lastPetalTime = 0;
let lastFrameTime = performance.now();
let lastMouseX = null;
let lastMouseY = null;

function resizePetalCanvas() {
  const ratio = window.devicePixelRatio || 1;
  petalCanvas.width = Math.floor(window.innerWidth * ratio);
  petalCanvas.height = Math.floor(window.innerHeight * ratio);
  petalCanvas.style.width = window.innerWidth + 'px';
  petalCanvas.style.height = window.innerHeight + 'px';
  petalCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
resizePetalCanvas();
window.addEventListener('resize', resizePetalCanvas, { passive: true });

function isBlankBackgroundTarget(target) {
  return !target.closest('a,button,input,textarea,select,video,img,svg,.nav,.hero__content,.card,.about,.tools,.resume__col,.scene-work,.scene-group,.scene-modal');
}

function createPetalParticle(x, y, dx, dy) {
  if (petals.length > 80) petals.shift();
  const size = 16 + Math.random() * 13;
  const speed = Math.hypot(dx, dy) || 1;
  const trailX = speed ? -dx / speed : 0;
  const trailY = speed ? -dy / speed : 0;
  petals.push({
    x: x + (Math.random() - 0.5) * 10,
    y: y + (Math.random() - 0.5) * 10,
    size,
    vx: trailX * (0.18 + Math.random() * 0.34) + (Math.random() - 0.5) * 0.18,
    vy: trailY * (0.18 + Math.random() * 0.34) + (Math.random() - 0.5) * 0.18,
    drag: 0.965,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.035,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.008 + Math.random() * 0.012,
    life: 0,
    maxLife: 650 + Math.random() * 450,
    alpha: 0.5 + Math.random() * 0.2
  });
}

function drawPetal(petal) {
  const fadeIn = Math.min(1, petal.life / 160);
  const fadeOut = Math.max(0, 1 - (petal.life - petal.maxLife * 0.58) / (petal.maxLife * 0.42));
  const alpha = petal.alpha * fadeIn * fadeOut;
  if (alpha <= 0) return;

  petalCtx.save();
  petalCtx.globalAlpha = alpha;
  petalCtx.translate(petal.x, petal.y);
  petalCtx.rotate(petal.angle);
  petalCtx.scale(1, 0.72 + Math.sin(petal.sway) * 0.08);

  const w = petal.size;
  const h = petal.size * 0.72;
  const gradient = petalCtx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  gradient.addColorStop(0, '#fff8fb');
  gradient.addColorStop(0.48, '#ffd6e4');
  gradient.addColorStop(1, '#f4a7c4');

  petalCtx.fillStyle = gradient;
  petalCtx.beginPath();
  petalCtx.moveTo(0, -h / 2);
  petalCtx.bezierCurveTo(w / 2, -h / 2, w / 2, h / 4, 0, h / 2);
  petalCtx.bezierCurveTo(-w / 2, h / 8, -w / 2, -h / 3, 0, -h / 2);
  petalCtx.fill();

  petalCtx.strokeStyle = 'rgba(221, 118, 154, .22)';
  petalCtx.lineWidth = 1;
  petalCtx.beginPath();
  petalCtx.moveTo(0, -h / 2 + 2);
  petalCtx.quadraticCurveTo(-w * 0.08, 0, 0, h / 2 - 2);
  petalCtx.stroke();
  petalCtx.restore();
}

function animatePetals(now) {
  const dt = Math.min(32, now - lastFrameTime);
  lastFrameTime = now;
  petalCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = petals.length - 1; i >= 0; i -= 1) {
    const p = petals[i];
    p.life += dt;
    p.sway += p.swaySpeed * dt;
    p.vx += Math.sin(p.sway) * 0.0015 * dt;
    p.vy += Math.cos(p.sway) * 0.0008 * dt;
    p.vx *= p.drag;
    p.vy *= p.drag;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.angle += p.spin * dt;

    drawPetal(p);
    if (p.life > p.maxLife) petals.splice(i, 1);
  }
  requestAnimationFrame(animatePetals);
}
requestAnimationFrame(animatePetals);

document.addEventListener('mousemove', (event) => {
  if (!isBlankBackgroundTarget(event.target)) {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    return;
  }

  const dx = lastMouseX === null ? 0 : event.clientX - lastMouseX;
  const dy = lastMouseY === null ? 0 : event.clientY - lastMouseY;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  const now = performance.now();
  if (now - lastPetalTime < 24) return;
  lastPetalTime = now;
  createPetalParticle(event.clientX, event.clientY, dx, dy);
}, { passive: true });
