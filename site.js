(function () {
  'use strict';

  var body = document.body;
  var content = document.getElementById('layout-content');
  var menu = document.getElementById('layout-menu');
  if (!content || !menu) return;

  var path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  var file = path.split('/').pop() || 'index.html';
  var isHome = file === '' || file === 'index.html';
  var isArchive = file === 'previous.html';
  body.classList.add(isHome ? 'page-home' : isArchive ? 'page-archive' : 'page-info');

  var skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#layout-content';
  skip.textContent = '跳到主要内容';
  document.body.insertBefore(skip, document.body.firstChild);

  function enhanceNavigation() {
    var logo = menu.querySelector(':scope > img');
    var items = Array.prototype.slice.call(menu.querySelectorAll(':scope > .menu-item'));
    if (!logo || !items.length) return;

    var homeHref = items[0].querySelector('a').getAttribute('href');
    var brand = document.createElement('a');
    brand.className = 'brand-link';
    brand.href = homeHref;
    brand.setAttribute('aria-label', 'FAI Seminar 首页');
    logo.parentNode.insertBefore(brand, logo);
    brand.appendChild(logo);

    var copy = document.createElement('span');
    copy.className = 'brand-copy';
    copy.innerHTML = '<strong>FAI Seminar</strong><span>FOUNDATIONAL ARTIFICIAL INTELLIGENCE</span>';
    brand.appendChild(copy);

    var links = document.createElement('nav');
    links.className = 'nav-links';
    links.id = 'site-navigation';
    links.setAttribute('aria-label', '主要导航');
    items.forEach(function (item) { links.appendChild(item); });
    menu.appendChild(links);

    var toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', '打开导航');
    toggle.setAttribute('aria-controls', 'site-navigation');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
    brand.insertAdjacentElement('afterend', toggle);

    toggle.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
      toggle.textContent = open ? '×' : '☰';
    });

    links.addEventListener('click', function () {
      body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '打开导航');
      toggle.textContent = '☰';
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && body.classList.contains('nav-open')) toggle.click();
    });

    var aliases = { '': 'index.html' };
    links.querySelectorAll('a').forEach(function (link) {
      var target = link.getAttribute('href').split('#')[0].split('/').pop().toLowerCase();
      if ((aliases[file] || file) === target) {
        link.classList.add('current');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function buildHomeHero() {
    var title = content.querySelector('#toptitle');
    if (!title) return;

    var scheduleHeading = Array.prototype.find.call(content.children, function (node) {
      return node.tagName === 'H1' && /日程安排|Schedule/i.test(node.textContent);
    });

    var cursor = title.nextSibling;
    while (cursor && cursor !== scheduleHeading) {
      var next = cursor.nextSibling;
      if (cursor.nodeType === 1) cursor.classList.add('legacy-intro');
      else if (cursor.nodeType === 3 && cursor.textContent.trim()) {
        var span = document.createElement('span');
        span.className = 'legacy-intro';
        cursor.parentNode.replaceChild(span, cursor);
        span.textContent = cursor.textContent;
      }
      cursor = next;
    }
    title.classList.add('legacy-intro');

    var hero = document.createElement('section');
    hero.className = 'page-hero home-hero';
    hero.innerHTML =
      '<span class="hero-kicker">International Seminar on Foundational Artificial Intelligence</span>' +
      '<h1>FAI Seminar <span>线上中文研讨班</span></h1>' +
      '<p class="hero-summary">每期邀请一位研究者分享近期工作，聚焦机器学习理论与人工智能基础。</p>' +
      '<div class="hero-essential" aria-label="研讨班关键信息">' +
        '<div class="hero-fact"><span>时间</span><strong>通常每周五 10:00–11:00</strong><small>北京时间 · 线上进行 · 中文分享</small></div>' +
        '<div class="hero-fact"><span>如何参与</span><strong>公众号「人工智能基础研究」</strong><small>回复「FAI」加入微信群，获取腾讯会议链接</small></div>' +
        '<div class="hero-cta">' +
          '<a class="hero-join" href="FAI/audience.html">查看参与方式 <span>→</span></a>' +
          '<a class="hero-schedule" href="#schedule">最近讲座 ↓</a>' +
        '</div>' +
      '</div>';

    var channels = document.createElement('section');
    channels.className = 'home-channels';
    channels.setAttribute('aria-label', 'FAI Seminar 官方入口');
    channels.innerHTML =
      '<div class="channel-intro"><span>官方入口</span><strong>扫码参与与观看</strong></div>' +
      '<div class="channel-card">' +
        '<img src="./pic/gzhQRcode.jpg" width="96" height="96" alt="微信公众号人工智能基础研究二维码">' +
        '<div><span>微信公众号</span><strong>人工智能基础研究</strong><small>发送「FAI」加入微信群</small></div>' +
      '</div>' +
      '<a class="channel-card" href="https://space.bilibili.com/3493277124790919" target="_blank" rel="noopener noreferrer">' +
        '<img src="./pic/bilibiliQR.png" width="96" height="96" alt="B站 FAI-Seminar 二维码">' +
        '<div><span>B 站</span><strong>FAI-Seminar</strong><small>观看最新及往期讲座录播</small></div>' +
      '</a>';

    content.insertBefore(hero, content.firstChild);
    hero.insertAdjacentElement('afterend', channels);
    if (scheduleHeading) scheduleHeading.id = 'schedule';
  }

  function prepareHomeSchedule() {
    var heading = document.getElementById('schedule');
    var currentTable = heading ? heading.nextElementSibling : null;
    while (currentTable && currentTable.tagName !== 'TABLE') currentTable = currentTable.nextElementSibling;
    if (!heading || !currentTable || !currentTable.tBodies.length) return;
    heading.textContent = '讲座 / Talks';

    var currentLabel = '';
    var cursor = heading.nextSibling;
    var labelNodes = [];
    while (cursor && cursor !== currentTable) {
      var next = cursor.nextSibling;
      currentLabel += cursor.textContent || '';
      labelNodes.push(cursor);
      cursor = next;
    }
    var currentYearMatch = currentLabel.match(/(20\d{2})/);
    var currentYear = currentYearMatch ? currentYearMatch[1] : String(new Date().getFullYear());

    var currentContainer = document.createElement('div');
    currentContainer.className = 'collapsible-container';
    var currentTrigger = document.createElement('div');
    currentTrigger.className = 'collapsible-trigger';
    currentTrigger.textContent = currentYear;
    currentTrigger.setAttribute('data-default-open', 'true');
    var currentPanel = document.createElement('div');
    currentPanel.className = 'collapsible-content';
    currentTable.parentNode.insertBefore(currentContainer, currentTable);
    currentContainer.appendChild(currentTrigger);
    currentContainer.appendChild(currentPanel);
    currentPanel.appendChild(currentTable);
    labelNodes.forEach(function (node) { node.remove(); });

    var yearGroups = {};
    content.querySelectorAll('.collapsible-container').forEach(function (container) {
      var trigger = container.querySelector(':scope > .collapsible-trigger');
      var table = container.querySelector('table');
      var yearMatch = trigger ? trigger.textContent.match(/(20\d{2})/) : null;
      if (!trigger || !table || !yearMatch) return;
      var year = yearMatch[1];
      trigger.textContent = year;

      if (!yearGroups[year]) {
        yearGroups[year] = { container: container, table: table, trigger: trigger };
        return;
      }

      var targetBody = yearGroups[year].table.tBodies[0];
      Array.prototype.slice.call(table.rows, 1).forEach(function (row) {
        targetBody.appendChild(row);
      });
      container.remove();
    });

    Object.keys(yearGroups).forEach(function (year) {
      var table = yearGroups[year].table;
      var rows = Array.prototype.slice.call(table.rows, 1);
      rows.sort(function (left, right) {
        function dateKey(row) {
          var match = row.cells[0] && row.cells[0].textContent.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
          return match ? Number(match[1]) * 100 + Number(match[2]) : -1;
        }
        return dateKey(right) - dateKey(left);
      });
      rows.forEach(function (row) { table.tBodies[0].appendChild(row); });
    });

    var latest = currentTable.rows[1];
    if (latest) {
      latest.classList.add('latest-row');
      var timeCell = latest.cells[0];
      if (timeCell) timeCell.insertAdjacentHTML('afterbegin', '<span class="latest-badge">最新</span>');
    }
  }

  function enhanceTables() {
    var tables = content.querySelectorAll('table');
    tables.forEach(function (table) {
      if (table.id === 'tlayout' || table.closest('.table-shell')) return;
      var firstRow = table.rows[0];
      if (!firstRow) return;
      var labels = Array.prototype.map.call(firstRow.cells, function (cell, index) {
        var label = cell.textContent.trim();
        var fallback = ['时间', '讲者', '主题', '讲座信息', '论文', '视频'];
        return label || fallback[index] || '信息';
      });
      Array.prototype.forEach.call(table.rows, function (row, rowIndex) {
        if (rowIndex === 0) return;
        Array.prototype.forEach.call(row.cells, function (cell, index) {
          cell.setAttribute('data-label', labels[index] || '信息');
          if (!cell.querySelector(':scope > .cell-value')) {
            var value = document.createElement('span');
            value.className = 'cell-value';
            while (cell.firstChild) value.appendChild(cell.firstChild);
            cell.appendChild(value);
          }
        });
      });
      table.classList.add('responsive-table');
      var shell = document.createElement('div');
      shell.className = 'table-shell';
      table.parentNode.insertBefore(shell, table);
      shell.appendChild(table);
    });
  }

  function normalizeInstitutions() {
    var replacements = [
      ['(RUC)', '(中国人民大学)'],
      ['(PKU)', '(北京大学)'],
      ['(THU)', '(清华大学)'],
      ['(SJTU)', '(上海交通大学)'],
      ['(Tongji)', '(同济大学)'],
      ['(HKU)', '(香港大学)'],
      ['(Hkust)', '(香港科技大学)'],
      ['(港城大)', '(香港城市大学)'],
      ['(港中文)', '(香港中文大学)'],
      ['(港中深)', '(香港中文大学(深圳))'],
      ['(上海AI Lab)', '(上海人工智能实验室)'],
      ['(上海 AI Lab)', '(上海人工智能实验室)'],
      ['(Berkeley)', '(UC Berkeley)'],
      ['(UCB)', '(UC Berkeley)'],
      ['(Columbia U)', '(Columbia)'],
      ['(Princeton )', '(Princeton)']
    ];

    var targets = content.querySelectorAll('table:not(#tlayout) td:nth-child(2), .home-avatar > div');
    targets.forEach(function (target) {
      target.innerHTML = target.innerHTML
        .replace(/（/g, '(')
        .replace(/）/g, ')')
        .replace(/\(中国科学<br\s*\/?>(?:\s*)技术大学\)/gi, '(中国科学技术大学)')
        .replace(/\(香港中文<br\s*\/?>(?:\s*)大学\)/gi, '(香港中文大学)');

      replacements.forEach(function (pair) {
        if (target.innerHTML.indexOf(pair[0]) !== -1) {
          target.innerHTML = target.innerHTML.split(pair[0]).join(pair[1]);
        }
      });
    });
  }

  function refreshPeople() {
    if (!isHome) return;
    var organizerSection = content.querySelector('[data-people="organizers"]');
    var contributorSection = content.querySelector('[data-people="contributors"]');
    if (!organizerSection || !contributorSection) return;

    var overrides = {
      '滕佳烨': { homepage: 'http://www.tengjiaye.com/' },
      '温凯越': { homepage: 'https://whenwen.github.io/' },
      '吕凯风': { homepage: 'https://kaifeng.ac/' },
      '马梓业': { homepage: 'https://gavenma.github.io/' },
      '张华清': {
        homepage: 'https://huggingface.co/zhqwqwq',
        image: './pic/zhang-huaqing.webp?v=20260828',
        institution: '(清华大学)'
      },
      '刘方辉': {
        homepage: 'https://ins.sjtu.edu.cn/people/fanghui/',
        image: './pic/liu-fanghui.webp',
        institution: '(上海交通大学)'
      },
      '刘逸舟': {
        homepage: 'https://liuyz0.github.io/',
        image: './pic/liu-yizhou.webp',
        institution: '(MIT)'
      },
      '张辉帅': {
        homepage: 'https://huishuai-git.github.io/',
        image: './pic/zhang-huishuai.webp',
        institution: '(北京大学)'
      },
      '雷云文': { homepage: 'https://leiyw.github.io/', institution: '(香港大学)' },
      'Peter Chen': { homepage: 'https://peterlaulukchen.github.io/', institution: '(Columbia)' },
      '游凯超': { homepage: 'https://youkaichao.github.io/about' },
      '席浩诚': { homepage: 'https://haochengxi.github.io/', institution: '(UC Berkeley)' },
      '刘冰彬': {
        homepage: 'https://clarabing.github.io/',
        image: './pic/bingbin.jpg',
        institution: '(Harvard)'
      },
      '孙卓': {
        homepage: 'https://jz-fun.github.io/',
        image: './pic/zhuo-sun.webp',
        institution: '(上海财经大学)'
      },
      '陈焕然': {
        homepage: 'https://huanranchen.github.io/',
        image: './pic/chen-huanran.webp?v=20260828-2',
        institution: '(清华大学)'
      }
    };

    var cards = {};
    [organizerSection, contributorSection].forEach(function (section) {
      section.querySelectorAll('li').forEach(function (item) {
        var link = item.querySelector('.home-avatar a');
        var image = item.querySelector('img');
        var institution = item.querySelector('.home-avatar div');
        if (!link) return;
        var name = link.textContent.trim();
        if (!cards[name]) {
          cards[name] = {
            name: name,
            homepage: link.getAttribute('href') || '',
            image: image ? image.getAttribute('src') : '',
            institution: institution ? institution.textContent.trim() : ''
          };
        }
      });
    });

    var talks = {};
    content.querySelectorAll('table:not(#tlayout) tr').forEach(function (row) {
      if (row.cells.length < 2) return;
      var speakerCell = row.cells[1];
      var link = speakerCell.querySelector('a');
      var name = link ? link.textContent.trim() : '';
      if (!name) {
        var firstLine = speakerCell.innerHTML.split(/<br\s*\/?\s*>/i)[0];
        var scratch = document.createElement('span');
        scratch.innerHTML = firstLine;
        name = scratch.textContent.trim();
      }
      if (!name || /讲者|speaker|\bbreak\b|休息|假期/i.test(name)) return;

      var parts = speakerCell.innerHTML.split(/<br\s*\/?\s*>/i);
      var institution = parts.length > 1 ? parts.slice(1).join(' ') : '';
      var institutionScratch = document.createElement('span');
      institutionScratch.innerHTML = institution;
      if (!talks[name]) {
        talks[name] = {
          name: name,
          homepage: link ? link.getAttribute('href') || '' : '',
          institution: institutionScratch.textContent.trim()
        };
      }
    });

    function personFor(name) {
      var card = cards[name] || {};
      var talk = talks[name] || {};
      var override = overrides[name] || {};
      var homepage = override.homepage || card.homepage || talk.homepage || '#';
      if (/scholar\.google|arxiv\.org/.test(homepage) && talk.homepage && !/scholar\.google|arxiv\.org/.test(talk.homepage)) {
        homepage = talk.homepage;
      }
      return {
        name: name,
        homepage: homepage,
        image: override.image || card.image || './pic/fai-og.jpg',
        institution: (override.institution || card.institution || talk.institution || '').replace(/（/g, '(').replace(/）/g, ')')
      };
    }

    function render(section, people, note) {
      section.innerHTML = '';
      if (note) {
        var description = document.createElement('p');
        description.className = 'people-note';
        description.textContent = note;
        section.appendChild(description);
      }
      var list = document.createElement('ul');
      people.forEach(function (person) {
        var item = document.createElement('li');
        var portrait = document.createElement('img');
        portrait.src = person.image;
        portrait.alt = person.name;
        portrait.loading = 'lazy';
        portrait.decoding = 'async';

        var copy = document.createElement('div');
        copy.className = 'home-avatar';
        var link = document.createElement('a');
        link.href = person.homepage;
        link.textContent = person.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        var affiliation = document.createElement('div');
        affiliation.textContent = person.institution;
        copy.appendChild(link);
        copy.appendChild(affiliation);
        item.appendChild(portrait);
        item.appendChild(copy);
        list.appendChild(item);
      });
      section.appendChild(list);
    }

    var organizerNames = ['陈焕然', '张华清', '温凯越', '马梓业', '吕凯风', '滕佳烨'];
    var collator = new Intl.Collator('zh-CN-u-co-pinyin', { sensitivity: 'base' });
    var surnameInitials = {
      '蔡': 'C', '陈': 'C', '戴': 'D', '翟': 'Z', '范': 'F', '付': 'F',
      '高': 'G', '顾': 'G', '何': 'H', '胡': 'H', '黄': 'H', '江': 'J',
      '金': 'J', '雷': 'L', '黎': 'L', '李': 'L', '刘': 'L', '卢': 'L',
      '陆': 'L', '吕': 'L', '罗': 'L', '马': 'M', '邱': 'Q', '尚': 'S',
      '石': 'S', '史': 'S', '苏': 'S', '孙': 'S', '滕': 'T', '汪': 'W',
      '王': 'W', '温': 'W', '吴': 'W', '席': 'X', '徐': 'X', '杨': 'Y',
      '游': 'Y', '俞': 'Y', '张': 'Z', '朱': 'Z', '邹': 'Z'
    };
    function initialFor(name) {
      return /^[A-Za-z]/.test(name) ? name.charAt(0).toUpperCase() : (surnameInitials[name.charAt(0)] || 'Z');
    }
    var contributorNames = Object.keys(talks).sort(function (left, right) {
      return initialFor(left).localeCompare(initialFor(right)) || collator.compare(left, right);
    });
    render(organizerSection, organizerNames.map(personFor));
    render(contributorSection, contributorNames.map(personFor));
  }

  function loadCompleteArchive() {
    return fetch('../index.html', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('无法读取主页讲座数据');
        return response.text();
      })
      .then(function (html) {
        var documentCopy = new DOMParser().parseFromString(html, 'text/html');
        var source = documentCopy.getElementById('layout-content');
        var scheduleHeading = Array.prototype.find.call(source ? source.children : [], function (node) {
          return node.tagName === 'H1' && /日程安排|Schedule/i.test(node.textContent);
        });
        var organizerHeading = source && source.querySelector('#organizers');
        var title = content.querySelector('#toptitle');
        var footer = content.querySelector('#footer');
        if (!source || !scheduleHeading || !organizerHeading || !title || !footer ||
            scheduleHeading.parentNode !== organizerHeading.parentNode) {
          throw new Error('主页讲座数据结构不完整');
        }

        var fragment = document.createDocumentFragment();
        var sourceNode = scheduleHeading.nextSibling;
        while (sourceNode && sourceNode !== organizerHeading) {
          fragment.appendChild(document.importNode(sourceNode, true));
          sourceNode = sourceNode.nextSibling;
        }

        var currentNode = title.nextSibling;
        while (currentNode && currentNode !== footer) {
          var nextNode = currentNode.nextSibling;
          currentNode.remove();
          currentNode = nextNode;
        }
        content.insertBefore(fragment, footer);
      })
      .catch(function () {
        /* 保留页面内的静态历史记录作为离线回退。 */
      });
  }

  function enhanceCollapsibles() {
    content.querySelectorAll('.collapsible-trigger').forEach(function (trigger, index) {
      var panel = trigger.nextElementSibling;
      if (!panel) return;
      var panelId = 'historical-talks-' + (index + 1);
      var defaultOpen = trigger.getAttribute('data-default-open') === 'true';
      panel.id = panelId;
      panel.classList.toggle('expanded', defaultOpen);
      panel.hidden = !defaultOpen;
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('aria-controls', panelId);
      trigger.setAttribute('aria-expanded', String(defaultOpen));
      trigger.setAttribute('aria-label', (defaultOpen ? '收起 ' : '展开 ') + trigger.textContent.trim() + ' 讲座');

      function setExpanded(expanded) {
        panel.classList.toggle('expanded', expanded);
        panel.hidden = !expanded;
        trigger.setAttribute('aria-expanded', String(expanded));
        trigger.setAttribute('aria-label', (expanded ? '收起 ' : '展开 ') + trigger.textContent.trim() + ' 讲座');
      }

      trigger.addEventListener('click', function () {
        setExpanded(trigger.getAttribute('aria-expanded') !== 'true');
      });
      trigger.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          trigger.click();
        }
      });
    });
  }

  function addArchiveSearch() {
    var title = content.querySelector('#toptitle');
    if (!title) return;
    var tables = Array.prototype.slice.call(content.querySelectorAll('table.responsive-table'));
    var rows = [];
    tables.forEach(function (table) {
      Array.prototype.slice.call(table.rows, 1).forEach(function (row) { rows.push(row); });
    });

    var tools = document.createElement('div');
    tools.className = 'archive-tools';
    tools.innerHTML = '<input class="archive-search" type="search" placeholder="搜索讲者、机构或讲座主题…" aria-label="搜索往期讲座"><span class="archive-count"></span>';
    title.insertAdjacentElement('afterend', tools);
    var input = tools.querySelector('input');
    var count = tools.querySelector('.archive-count');

    function update() {
      var query = input.value.trim().toLowerCase();
      var visible = 0;
      rows.forEach(function (row) {
        var match = !query || row.textContent.toLowerCase().indexOf(query) !== -1;
        row.hidden = !match;
        if (match) visible += 1;
      });
      count.textContent = query ? '找到 ' + visible + ' 场' : '共 ' + rows.length + ' 场';
      tables.forEach(function (table) {
        var shell = table.closest('.table-shell');
        var hasVisible = Array.prototype.slice.call(table.rows, 1).some(function (row) { return !row.hidden; });
        if (shell) shell.hidden = !hasVisible;
      });
    }
    input.addEventListener('input', update);
    update();
  }

  function refreshFooter() {
    var footer = content.querySelector('#footer-text');
    if (footer) footer.innerHTML = '© FAI Seminar · Foundational Artificial Intelligence · 保持好奇，开放交流。';
  }

  enhanceNavigation();
  if (isArchive) {
    loadCompleteArchive().then(function () {
      normalizeInstitutions();
      enhanceTables();
      enhanceCollapsibles();
      addArchiveSearch();
      refreshFooter();
    });
  } else {
    if (isHome) buildHomeHero();
    normalizeInstitutions();
    refreshPeople();
    if (isHome) prepareHomeSchedule();
    enhanceTables();
    enhanceCollapsibles();
    refreshFooter();
  }
})();
