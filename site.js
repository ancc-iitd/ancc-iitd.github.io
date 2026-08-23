/* ============================================================
   ANCC IITD — shared site script
   Navbar + footer are injected here so there is a single
   source of truth across every page.
   ============================================================ */

/* ---------- Site config ---------- */
const NAV_LINKS = [
  { href: 'index.html',     label: 'Home',              page: 'home' },
  { href: 'csot.html',      label: 'CSOT 2026',         page: 'csot' },
  { href: 'contests.html',  label: 'Contests',          page: 'contests' },
  // { href: 'pod.html',     label: 'Problem of the Day', page: 'pod' },
  // { href: 'caic_points.html', label: 'CAIC Points',   page: 'caic' },
  { href: 'team2026.html',  label: 'Team 2026',         page: 'team2026' },
  { href: 'team2025.html',  label: 'Team 2025',         page: 'team2025' },
  { href: 'team2024.html',  label: 'Team 2024',         page: 'team2024' },
  { href: 'socp.html',      label: 'SoCP 2021',         page: 'socp' },
];

const SOCIALS = [
  { cls: 'youtube-link',   icon: 'fab fa-youtube',   href: 'https://www.youtube.com/channel/UC7XoOZ3Ip7i8-78jYLjAC2Q', label: 'YouTube' },
  { cls: 'instagram-link', icon: 'fab fa-instagram', href: 'https://www.instagram.com/ancc.iitd/',                       label: 'Instagram' },
  { cls: 'linkedin-link',  icon: 'fab fa-linkedin-in', href: 'https://www.linkedin.com/company/algorithms-and-coding-club-iit-delhi', label: 'LinkedIn' },
  // Facebook intentionally hidden — uncomment to re-enable.
  // { cls: 'facebook-link', icon: 'fab fa-facebook-f', href: 'https://www.facebook.com/anciitd', label: 'Facebook' },
  { cls: 'email-link',     icon: 'fas fa-envelope',  href: 'mailto:ancclubiitd@gmail.com',                               label: 'Email' },
];

const BRAND_LOGO = 'images/transparent-logo.png';
const PARTNER_LOGO = 'images/jump_logo.jpg';

/* ---------- Floating particles ---------- */
function createParticles(count = 40) {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 20 + 's';
    p.style.animationDuration = (Math.random() * 10 + 15) + 's';
    container.appendChild(p);
  }
}

/* ---------- Social links markup ---------- */
function socialRowHTML(extraClass = '') {
  return `<div class="social-row ${extraClass}">` + SOCIALS.map(s =>
    `<a class="social-link ${s.cls}" href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}" title="${s.label}"><i class="${s.icon}"></i></a>`
  ).join('') + `</div>`;
}

/* ---------- Navbar ---------- */
function buildNav() {
  const mount = document.getElementById('site-nav');
  if (!mount) return;
  const active = document.body.dataset.page || '';

  const links = NAV_LINKS.map(l =>
    `<li class="nav-item">
       <a class="nav-link${l.page === active ? ' active' : ''}" href="${l.href}">${l.label}</a>
     </li>`
  ).join('');

  mount.innerHTML = `
    <nav class="navbar navbar-expand-sm navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand my-0" href="index.html">
          <img src="${BRAND_LOGO}" alt="ANCC Logo" class="brand-logo">
        </a>

        <div class="d-flex d-sm-none align-items-center ms-auto">
          <a class="nav-link me-3 p-0" href="#" aria-label="Partner">
            <img src="${PARTNER_LOGO}" alt="JUMP Trading" class="partner-logo">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                  aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-sm-0">${links}</ul>
          <div class="navbar-nav ms-auto d-none d-sm-flex">
            <a class="nav-link p-0" href="#" aria-label="Partner">
              <img src="${PARTNER_LOGO}" alt="JUMP Trading" class="partner-logo">
            </a>
          </div>
        </div>
      </div>
    </nav>`;
}

/* ---------- Footer ---------- */
function buildFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  const year = new Date().getFullYear();
  mount.innerHTML = `
    <footer class="footer text-white py-4">
      <div class="container text-center">
        ${socialRowHTML('justify-content-center')}
        <p class="mb-0">Copyright © ${year} ANCC IIT Delhi</p>
      </div>
    </footer>`;
}

/* ---------- Auto-fill hero social rows ---------- */
function fillSocialPlaceholders() {
  document.querySelectorAll('[data-social-row]').forEach(el => {
    el.innerHTML = socialRowHTML('justify-content-center');
  });
}

/* ---------- Google Drive image links ---------- */
function convertGoogleDriveLink(url) {
  if (!url || url.trim() === '') return '';
  if (url.includes('drive.google.com/uc?export=view&id=')) return url;

  let fileId = '';
  if (url.includes('drive.google.com/file/d/')) {
    const m = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (m) fileId = m[1];
  } else if (url.includes('drive.google.com/open?id=')) {
    const m = url.match(/id=([a-zA-Z0-9-_]+)/);
    if (m) fileId = m[1];
  } else if (url.match(/^[a-zA-Z0-9-_]+$/)) {
    fileId = url;
  }

  return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=s200?authuser=0` : url;
}

/* ---------- Google Sheet (TSV) fetch + parse ---------- */
function parseTSV(text) {
  const lines = text.split(/\r\n|\r|\n/).filter(l => l.trim() !== '');
  if (lines.length === 0) return { headers: [], rows: [], records: [], cells: [] };

  const cells = lines.map(line => line.split('\t')); // every line, incl. the first
  const headers = cells[0].map(h => h.trim());
  const rows = cells.slice(1);                        // data rows (header skipped)
  const records = rows.map(cols => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cols[i] || '').trim(); });
    return obj;
  });
  return { headers, rows, records, cells };
}

async function fetchSheet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheet request failed (${res.status})`);
  return parseTSV(await res.text());
}

/* ---------- Codeforces user info ----------
   One batched call feeds both the ordering (by max rating) and the handle
   colours. The API rejects the whole batch when a single handle is unknown,
   so drop the handle it names and retry; give up rather than stall the page,
   in which case cards keep sheet order and the default colour.            */
async function fetchCodeforcesInfo(handles, timeoutMs = 6000) {
  const info = new Map();
  let pending = [...new Set(handles.filter(Boolean))];

  for (let attempt = 0; pending.length && attempt < 5; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch('https://codeforces.com/api/user.info?handles=' + pending.join(';'),
                              { signal: controller.signal });
      const cf = await res.json();
      if (cf.status === 'OK') {
        cf.result.forEach(u => info.set(u.handle.toLowerCase(), u));
        break;
      }
      const unknown = (cf.comment || '').match(/User with handle (\S+) not found/i);
      if (!unknown) break;
      pending = pending.filter(h => h.toLowerCase() !== unknown[1].toLowerCase());
    } catch (e) {
      break;
    } finally {
      clearTimeout(timer);
    }
  }
  return info;
}

/* ---------- Codeforces rating colours ---------- */
function applyCodeforcesColors(info) {
  if (!info || info.size === 0) return;

  const RANK_COLOR = {
    'newbie': 'gray',
    'pupil': 'green',
    'specialist': 'cyan',
    'expert': 'blue',
    'candidate master': 'violet',
    'master': 'orange',
    'international master': 'orange',
    'grandmaster': 'red',
    'international grandmaster': 'fire',
    'legendary grandmaster': 'legendary',
  };

  // Match on the rendered handle, not position, so a dropped handle cannot
  // shift every colour after it.
  Array.from(document.getElementsByClassName('rated-user')).forEach(el => {
    const user = info.get(el.innerText.trim().toLowerCase());
    const color = RANK_COLOR[user && user.rank] || 'black';
    el.className = 'codeforces-link rated-user user-' + color;
  });
}

/* ---------- Profile URL normalisers ----------
   Rows come straight from the recruitment form, so a field may hold a full
   URL, a bare handle, a stand-in like "NA", or a plain name typed into the
   wrong box. Anything that is not a usable handle/URL is dropped so the card
   simply omits that icon instead of linking somewhere broken.            */
const PLACEHOLDER_VALUES = ['na', 'n/a', 'nil', 'none', 'nan', 'null', '-', '--'];

function cleanValue(value) {
  value = (value || '').replace(/\s+/g, ' ').trim();
  return PLACEHOLDER_VALUES.includes(value.toLowerCase()) ? '' : value;
}

function ensureHttp(url) {
  url = (url || '').trim();
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : 'https://' + url.replace(/^\/+/, '');
}

function githubUrl(value) {
  value = cleanValue(value);
  if (!value) return '';
  if (/github\.com/i.test(value)) return ensureHttp(value);   // full or protocol-less URL
  value = value.replace(/^@/, '');
  return /^[\w-]+$/.test(value) ? 'https://github.com/' + value : '';
}

function linkedinUrl(value) {
  value = cleanValue(value);
  if (!value) return '';
  if (/linkedin\.com/i.test(value)) return ensureHttp(value);  // full or protocol-less URL
  // A bare vanity slug ("gandem-nitin-941b13229") is a profile; a name is not.
  return /^[\w.-]+$/.test(value) ? 'https://www.linkedin.com/in/' + value : '';
}

function instagramUrl(value) {
  value = cleanValue(value).replace(/^@/, '');
  if (!value) return '';
  if (/instagram\.com/i.test(value)) return ensureHttp(value);
  return /^[\w.]+$/.test(value) ? 'https://www.instagram.com/' + value : '';
}

function codeforcesHandle(value) {
  value = cleanValue(value);
  const m = value.match(/codeforces\.com\/profile\/([^/?#]+)/i);
  const handle = (m ? m[1] : value).replace(/^@/, '');          // extract handle from URL or use as-is
  return /^[\w.-]+$/.test(handle) ? handle : '';
}

/* ---------- Team sheet columns ----------
   Older rosters are hand-kept sheets; newer ones are form-response sheets
   whose headers differ in wording and case ("Handle" vs "Codeforces handle",
   "photoUrl" vs "Photo (Size limit : 10 MB)"). Match exactly, then by prefix. */
const TEAM_COLUMNS = {
  name:       ['Name'],
  position:   ['Position'],
  codeforces: ['Handle', 'Codeforces handle'],
  github:     ['Github Username', 'Github username'],
  linkedin:   ['LinkedIn Profile', 'LinkedIn profile'],
  instagram:  ['Instagram username'],
  photo:      ['photoUrl', 'Photo'],
};

function sheetField(record, candidates) {
  const keys = Object.keys(record);
  for (const want of candidates) {
    const w = want.toLowerCase();
    const key = keys.find(k => k.toLowerCase() === w) ||
                keys.find(k => k.toLowerCase().startsWith(w));
    if (key) return record[key];
  }
  return '';
}

/* Form sheets abbreviate the top roles; cards show the full title. Expanded
   once when a row is read, so the label and the sort key stay in step. */
const POSITION_LABELS = {
  'oc': 'Overall Coordinator',
  'co-oc': 'Co-Overall Coordinator',
};

function positionLabel(position) {
  return POSITION_LABELS[position.toLowerCase()] || position;
}

/* Seniority order; anything unrecognised sorts to the end. */
const POSITION_ORDER = [
  'overall coordinator', 'co-overall coordinator', 'panel member',
  'ctm & treasurer', 'ctm',
  'coordinator',
  'executive', 'representative',
];

function positionRank(position) {
  const i = POSITION_ORDER.indexOf(position.toLowerCase());
  return i === -1 ? POSITION_ORDER.length : i;
}

/* ---------- Team cards (shared by index and every team page) ---------- */
function generateTeamCard(member) {
  const directPhotoUrl = convertGoogleDriveLink(member.photo);
  const initials = member.name.split(' ').map(w => w.charAt(0)).join('').toUpperCase();
  const cfHandle = codeforcesHandle(member.codeforces);
  const linkedin = linkedinUrl(member.linkedin);
  const github = githubUrl(member.github);
  const instagram = instagramUrl(member.instagram);

  let card = "<div class='team-card fade-in'>";
  card += "<div class='card-photo-section'>";
  if (directPhotoUrl) {
    card += `<img src='${directPhotoUrl}' alt='${member.name}' class='profile-photo loading'
             onload="this.classList.remove('loading'); this.nextElementSibling.style.display='none';"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
    card += `<div class='profile-photo-placeholder' style='display:none;'>${initials}</div>`;
  } else {
    card += `<div class='profile-photo-placeholder'>${initials}</div>`;
  }
  card += "</div>";

  card += "<div class='card-header-custom'>";
  card += "<h5 class='card-name'>" + member.name + "</h5>";
  card += "<p class='card-position'>" + member.position + "</p>";
  card += "</div>";

  // Icons live in their own row so the handle pill never wraps up beside them
  // on members who filled in fewer profiles.
  let icons = "";
  if (linkedin)   icons += "<a target='_blank' rel='noopener' href='" + linkedin + "' class='social-link linkedin-link' title='LinkedIn'><i class='fab fa-linkedin-in'></i></a>";
  if (github)     icons += "<a target='_blank' rel='noopener' href='" + github + "' class='social-link github-link' title='GitHub'><i class='fab fa-github'></i></a>";
  if (instagram)  icons += "<a target='_blank' rel='noopener' href='" + instagram + "' class='social-link instagram-link' title='Instagram'><i class='fab fa-instagram'></i></a>";

  card += "<div class='card-links'>";
  if (icons)      card += "<div class='card-icons'>" + icons + "</div>";
  if (cfHandle)   card += "<a target='_blank' rel='noopener' href='https://codeforces.com/profile/" + cfHandle + "' class='codeforces-link rated-user user-black' title='Codeforces'>" + cfHandle + "</a>";
  card += "</div>";

  card += "</div>";
  return card;
}

async function loadTeam(sheetUrl) {
  const loading = document.getElementById('loading');
  const teamH = document.getElementById('teamH');
  const team = document.getElementById('team');
  try {
    const { records } = await fetchSheet(sheetUrl);
    if (loading) loading.style.display = 'none';
    if (teamH) teamH.style.display = 'block';

    const members = records
      .map(r => ({
        name:       cleanValue(sheetField(r, TEAM_COLUMNS.name)),
        position:   positionLabel(cleanValue(sheetField(r, TEAM_COLUMNS.position))),
        codeforces: sheetField(r, TEAM_COLUMNS.codeforces),
        github:     sheetField(r, TEAM_COLUMNS.github),
        linkedin:   sheetField(r, TEAM_COLUMNS.linkedin),
        instagram:  sheetField(r, TEAM_COLUMNS.instagram),
        photo:      sheetField(r, TEAM_COLUMNS.photo),
      }))
      .filter(m => m.name);

    const info = await fetchCodeforcesInfo(members.map(m => codeforcesHandle(m.codeforces)));
    const maxRating = m => {
      const user = info.get(codeforcesHandle(m.codeforces).toLowerCase());
      return user && typeof user.maxRating === 'number' ? user.maxRating : -1;
    };

    // Strongest max rating first inside each position group; unrated members
    // and anyone without a usable handle fall to the end of their group.
    members.sort((a, b) =>
      positionRank(a.position) - positionRank(b.position) || maxRating(b) - maxRating(a));

    team.innerHTML = members.map(m => generateTeamCard(m)).join('');

    team.classList.add('stagger-animation');
    team.querySelectorAll('.team-card').forEach((card, i) => {
      card.style.animationDelay = (i * 0.1) + 's';
      card.style.transform = 'translateY(50px)';
    });

    applyCodeforcesColors(info);
  } catch (e) {
    if (loading) loading.innerHTML = '<p class="text-danger">Could not load the team right now. Please try again later.</p>';
  }
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  buildFooter();
  fillSocialPlaceholders();
  createParticles();
});
