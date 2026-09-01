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
      '<p class="hero-summary">严谨研究，轻松交流。</p>' +
      '<div class="hero-essential" aria-label="研讨班关键信息">' +
        '<div class="hero-fact"><span>时间</span><strong>通常每周五 10:00–11:00</strong><small>北京时间 · 线上进行 · 中文分享</small></div>' +
        '<div class="hero-fact"><span>如何参与</span><strong>公众号「人工智能基础研究」</strong><small>回复「FAI」加入微信群，获取腾讯会议链接</small></div>' +
        '<div class="hero-cta">' +
          '<a class="hero-join" href="FAI/audience.html">查看更多参与方式 <span>→</span></a>' +
          '<a class="hero-schedule" href="#schedule">最近讲座 ↓</a>' +
        '</div>' +
      '</div>';

    var channels = document.createElement('section');
    channels.className = 'home-channels';
    channels.setAttribute('aria-label', 'FAI Seminar 官方入口');
    channels.innerHTML =
      '<div class="channel-intro"><strong>官方账号</strong></div>' +
      '<div class="channel-card">' +
        '<img src="./pic/gzhQRcode.jpg" width="96" height="96" alt="微信公众号人工智能基础研究二维码">' +
        '<div><span>微信公众号</span><strong>人工智能基础研究</strong><small>发送「FAI」加入微信群</small></div>' +
      '</div>' +
      '<a class="channel-card" href="https://space.bilibili.com/3493277124790919" target="_blank" rel="noopener noreferrer">' +
        '<img src="./pic/bilibiliQR.png" width="96" height="96" alt="B站 FAI-Seminar 二维码">' +
        '<div><span>B 站</span><strong>FAI-Seminar</strong><small>观看最新及往期讲座录播</small></div>' +
      '</a>';

    var stats = document.createElement('section');
    stats.className = 'community-stats';
    stats.setAttribute('aria-label', 'FAI Seminar 社区规模');
    stats.innerHTML =
      '<div class="community-stat"><strong>3,500+</strong><span>微信群成员</span></div>' +
      '<div class="community-stat"><strong>2万+</strong><span>B站粉丝</span></div>' +
      '<div class="community-stat"><strong>1万+</strong><span>公众号关注</span></div>' +
      '<div class="community-stat" aria-label="B站录播总播放，截至2026年8月29日超过43万次"><strong>43万+</strong><span>B站录播总播放</span></div>';

    content.insertBefore(hero, content.firstChild);
    hero.insertAdjacentElement('afterend', channels);
    channels.insertAdjacentElement('afterend', stats);
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
      var trigger = yearGroups[year].trigger;
      trigger.setAttribute('data-year', year);
      trigger.innerHTML = '<span class="year-label">' + year + '</span><span class="year-count">' + rows.length + ' TALKS</span>';
    });

    var latest = currentTable.rows[1];
    if (latest) {
      latest.classList.add('latest-row');
      var timeCell = latest.cells[0];
      if (timeCell) timeCell.insertAdjacentHTML('afterbegin', '<span class="latest-badge">最新</span>');
    }
  }

  function prepareArchiveSchedule() {
    var title = content.querySelector('#toptitle');
    var footer = content.querySelector('#footer');
    if (!title || !footer) return;

    var rawTables = Array.prototype.filter.call(content.querySelectorAll('table:not(#tlayout)'), function (table) {
      return !table.closest('.collapsible-container');
    });

    rawTables.forEach(function (table) {
      var labelNodes = [];
      var cursor = table.previousSibling;
      var year = '';
      while (cursor && cursor !== title) {
        if (cursor.nodeType === 1 && (cursor.tagName === 'TABLE' || cursor.classList.contains('collapsible-container'))) break;
        labelNodes.unshift(cursor);
        var match = (cursor.textContent || '').match(/(20\d{2})/);
        if (match) {
          year = match[1];
          break;
        }
        cursor = cursor.previousSibling;
      }
      if (!year) return;

      var container = document.createElement('div');
      container.className = 'collapsible-container';
      var trigger = document.createElement('div');
      trigger.className = 'collapsible-trigger';
      trigger.textContent = year;
      var panel = document.createElement('div');
      panel.className = 'collapsible-content';
      table.parentNode.insertBefore(container, table);
      container.appendChild(trigger);
      container.appendChild(panel);
      panel.appendChild(table);
      labelNodes.forEach(function (node) {
        if (node.parentNode === content) node.remove();
      });
    });

    var yearGroups = {};
    Array.prototype.slice.call(content.querySelectorAll(':scope > .collapsible-container')).forEach(function (container) {
      var trigger = container.querySelector(':scope > .collapsible-trigger');
      var table = container.querySelector('table');
      var yearMatch = trigger ? trigger.textContent.match(/(20\d{2})/) : null;
      if (!trigger || !table || !yearMatch) return;
      var year = yearMatch[1];

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

    var years = Object.keys(yearGroups).sort(function (left, right) { return Number(right) - Number(left); });
    years.forEach(function (year) {
      var group = yearGroups[year];
      var rows = Array.prototype.slice.call(group.table.rows, 1);
      rows.sort(function (left, right) {
        function dateKey(row) {
          var match = row.cells[0] && row.cells[0].textContent.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
          return match ? Number(match[1]) * 100 + Number(match[2]) : -1;
        }
        return dateKey(right) - dateKey(left);
      });
      rows.forEach(function (row) { group.table.tBodies[0].appendChild(row); });

      group.trigger.setAttribute('data-year', year);
      group.trigger.setAttribute('data-default-open', 'true');
      group.trigger.innerHTML = '<span class="year-label">' + year + '</span><span class="year-count">' + rows.length + ' TALKS</span>';
      content.insertBefore(group.container, footer);
    });
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
      if (trigger.getAttribute('data-collapsible-ready') === 'true') return;
      var panel = trigger.nextElementSibling;
      if (!panel) return;
      var panelId = 'historical-talks-' + (index + 1);
      var defaultOpen = trigger.getAttribute('data-default-open') === 'true';
      var triggerLabel = trigger.getAttribute('data-year') || trigger.textContent.trim();
      if (!trigger.querySelector('.year-label')) {
        var talkCount = Math.max(0, panel.querySelectorAll('table tr').length - 1);
        trigger.innerHTML = '<span class="year-label">' + triggerLabel + '</span><span class="year-count">' + talkCount + ' TALKS</span>';
      }
      panel.id = panelId;
      panel.classList.toggle('expanded', defaultOpen);
      panel.hidden = !defaultOpen;
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('aria-controls', panelId);
      trigger.setAttribute('aria-expanded', String(defaultOpen));
      trigger.setAttribute('aria-label', (defaultOpen ? '收起 ' : '展开 ') + triggerLabel + ' 讲座');
      trigger.setAttribute('data-collapsible-ready', 'true');

      function setExpanded(expanded) {
        panel.classList.toggle('expanded', expanded);
        panel.hidden = !expanded;
        trigger.setAttribute('aria-expanded', String(expanded));
        trigger.setAttribute('aria-label', (expanded ? '收起 ' : '展开 ') + triggerLabel + ' 讲座');
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
    var savedExpandedStates = new Map();
    var wasSearching = false;

    function setGroupExpanded(table, expanded) {
      var container = table.closest('.collapsible-container');
      if (!container) return;
      var trigger = container.querySelector(':scope > .collapsible-trigger');
      var panel = container.querySelector(':scope > .collapsible-content');
      if (!trigger || !panel) return;
      panel.classList.toggle('expanded', expanded);
      panel.hidden = !expanded;
      trigger.setAttribute('aria-expanded', String(expanded));
      trigger.setAttribute('aria-label', (expanded ? '收起 ' : '展开 ') + (trigger.getAttribute('data-year') || trigger.textContent.trim()) + ' 讲座');
    }

    function update() {
      var query = input.value.trim().toLowerCase();
      var searching = Boolean(query);
      var visible = 0;
      if (searching && !wasSearching) {
        tables.forEach(function (table) {
          var trigger = table.closest('.collapsible-container') && table.closest('.collapsible-container').querySelector(':scope > .collapsible-trigger');
          if (trigger) savedExpandedStates.set(table, trigger.getAttribute('aria-expanded') === 'true');
        });
      }
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
        if (searching) setGroupExpanded(table, hasVisible);
      });
      if (!searching && wasSearching) {
        tables.forEach(function (table) {
          if (savedExpandedStates.has(table)) setGroupExpanded(table, savedExpandedStates.get(table));
        });
        savedExpandedStates.clear();
      }
      wasSearching = searching;
    }
    input.addEventListener('input', update);
    update();
  }

  function loadUpcomingTalks() {
    var section = document.getElementById('upcoming-talks');
    var grid = document.getElementById('upcoming-talks-grid');
    var status = document.getElementById('upcoming-talks-status');
    if (!section || !grid || !status) return;
    section.classList.remove('legacy-intro');

    function localDateKey(date) {
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var day = String(date.getDate()).padStart(2, '0');
      return year + '-' + month + '-' + day;
    }

    function textNode(tag, className, value) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      node.textContent = value || '';
      return node;
    }

    function renderTalk(talk) {
      var article = document.createElement('article');
      article.className = 'upcoming-talk-card';
      if (talk.speaker_photo) article.classList.add('has-photo');

      var dateValue = new Date(talk.date + 'T12:00:00+08:00');
      var calendar = document.createElement('time');
      calendar.className = 'upcoming-calendar';
      calendar.dateTime = talk.date + 'T' + talk.start_time + ':00+08:00';
      calendar.appendChild(textNode('span', '', (dateValue.getMonth() + 1) + '月'));
      calendar.appendChild(textNode('strong', '', String(dateValue.getDate()).padStart(2, '0')));
      calendar.appendChild(textNode('small', '', new Intl.DateTimeFormat('zh-CN', { weekday: 'short' }).format(dateValue)));

      var copy = document.createElement('div');
      copy.className = 'upcoming-talk-copy';
      var timing = textNode('p', 'upcoming-talk-time', talk.start_time + '–' + talk.end_time + ' · 北京时间 · ' + talk.venue);
      var heading = textNode('h3', '', talk.title_zh || talk.title_en || talk.title);
      var englishTitle = talk.title_en && talk.title_en !== heading.textContent
        ? textNode('p', 'upcoming-title-en', talk.title_en)
        : null;
      var speakerLine = document.createElement('p');
      speakerLine.className = 'upcoming-speaker';
      if (talk.speaker_homepage) {
        var speakerLink = textNode('a', '', talk.speaker_name);
        speakerLink.href = talk.speaker_homepage;
        speakerLink.target = '_blank';
        speakerLink.rel = 'noopener noreferrer';
        speakerLine.appendChild(speakerLink);
      } else {
        speakerLine.appendChild(textNode('strong', '', talk.speaker_name));
      }
      speakerLine.appendChild(document.createTextNode(' · ' + talk.speaker_affiliation));
      var abstract = textNode('p', 'upcoming-abstract', talk.abstract);
      var links = document.createElement('div');
      links.className = 'upcoming-links';
      if (talk.wechat_url) {
        var wechat = textNode('a', '', '公众号介绍 ↗');
        wechat.href = talk.wechat_url;
        wechat.target = '_blank';
        wechat.rel = 'noopener noreferrer';
        links.appendChild(wechat);
      }
      if (talk.video_url) {
        var video = textNode('a', '', '观看录播 ↗');
        video.href = talk.video_url;
        video.target = '_blank';
        video.rel = 'noopener noreferrer';
        links.appendChild(video);
      }
      if (talk.paper_url) {
        var paperLabel = talk.paper_title ? '论文：' + talk.paper_title + ' ↗' : '查看相关论文 ↗';
        var paper = textNode('a', '', paperLabel);
        paper.href = talk.paper_url;
        paper.target = '_blank';
        paper.rel = 'noopener noreferrer';
        links.appendChild(paper);
      }
      copy.appendChild(timing);
      copy.appendChild(heading);
      if (englishTitle) copy.appendChild(englishTitle);
      copy.appendChild(speakerLine);
      copy.appendChild(abstract);
      copy.appendChild(links);
      article.appendChild(calendar);
      article.appendChild(copy);
      if (talk.speaker_photo) {
        var portrait = document.createElement('img');
        portrait.className = 'upcoming-speaker-photo';
        portrait.src = talk.speaker_photo;
        portrait.alt = talk.speaker_name + '的讲者照片';
        portrait.loading = 'lazy';
        portrait.referrerPolicy = 'no-referrer';
        article.appendChild(portrait);
      }
      return article;
    }

    function scheduleTableForYear(year) {
      var match = null;
      content.querySelectorAll('.collapsible-trigger[data-year]').forEach(function (trigger) {
        if (trigger.getAttribute('data-year') === year) {
          var container = trigger.closest('.collapsible-container');
          match = container && container.querySelector('table');
        }
      });
      if (match) return match;

      var templateTable = content.querySelector('.collapsible-container table');
      var scheduleHeading = document.getElementById('schedule');
      if (!templateTable || !templateTable.rows[0] || !scheduleHeading) return null;

      var container = document.createElement('div');
      container.className = 'collapsible-container';
      var trigger = document.createElement('div');
      trigger.className = 'collapsible-trigger';
      trigger.setAttribute('data-year', year);
      trigger.setAttribute('data-default-open', 'true');
      trigger.innerHTML = '<span class="year-label">' + year + '</span><span class="year-count">0 TALKS</span>';
      var panel = document.createElement('div');
      panel.className = 'collapsible-content';
      var table = document.createElement('table');
      var body = document.createElement('tbody');
      body.appendChild(templateTable.rows[0].cloneNode(true));
      table.appendChild(body);
      panel.appendChild(table);
      container.appendChild(trigger);
      container.appendChild(panel);

      var inserted = false;
      var groups = Array.prototype.slice.call(content.querySelectorAll('.collapsible-container'));
      groups.forEach(function (group) {
        if (inserted) return;
        var groupTrigger = group.querySelector(':scope > .collapsible-trigger[data-year]');
        if (groupTrigger && Number(groupTrigger.getAttribute('data-year')) < Number(year)) {
          group.parentNode.insertBefore(container, group);
          inserted = true;
        }
      });
      if (!inserted && groups.length) groups[groups.length - 1].insertAdjacentElement('afterend', container);
      else if (!inserted) scheduleHeading.insertAdjacentElement('afterend', container);

      enhanceTables();
      enhanceCollapsibles();
      return table;
    }

    function scheduleCell(row, label) {
      var cell = document.createElement('td');
      cell.setAttribute('data-label', label);
      var value = document.createElement('span');
      value.className = 'cell-value';
      cell.appendChild(value);
      row.appendChild(cell);
      return value;
    }

    function externalLink(label, url) {
      var link = textNode('a', '', label);
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      return link;
    }

    function renderScheduleRow(talk) {
      var row = document.createElement('tr');
      row.setAttribute('data-live-talk', 'true');
      row.setAttribute('data-admin-talk-id', talk.id);
      scheduleCell(row, '时间').textContent = talk.date.slice(5).replace('-', '/');

      var speaker = scheduleCell(row, '讲者');
      if (talk.speaker_homepage) speaker.appendChild(externalLink(talk.speaker_name, talk.speaker_homepage));
      else speaker.appendChild(document.createTextNode(talk.speaker_name));
      speaker.appendChild(document.createElement('br'));
      speaker.appendChild(document.createTextNode('(' + talk.speaker_affiliation + ')'));

      var title = scheduleCell(row, '主题');
      title.appendChild(document.createTextNode(talk.title_zh || talk.title_en || talk.title));
      if (talk.title_en && talk.title_en !== title.textContent) {
        title.appendChild(document.createElement('br'));
        var englishTitle = textNode('span', 'schedule-title-en', talk.title_en);
        title.appendChild(englishTitle);
      }

      var talkInfo = scheduleCell(row, '讲座信息');
      if (talk.wechat_url) talkInfo.appendChild(externalLink('Talk Info', talk.wechat_url));
      var paper = scheduleCell(row, '论文');
      if (talk.paper_url) paper.appendChild(externalLink('[1]', talk.paper_url));
      var video = scheduleCell(row, '视频');
      if (talk.video_url) video.appendChild(externalLink('B站', talk.video_url));
      return row;
    }

    function scheduleDateKey(row) {
      var match = row.cells[0] && row.cells[0].textContent.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
      return match ? Number(match[1]) * 100 + Number(match[2]) : -1;
    }

    function updateScheduleTable(table) {
      var rows = Array.prototype.slice.call(table.rows, 1);
      rows.sort(function (left, right) { return scheduleDateKey(right) - scheduleDateKey(left); });
      rows.forEach(function (row) { table.tBodies[0].appendChild(row); });
      table.querySelectorAll('.latest-badge').forEach(function (badge) { badge.remove(); });
      rows.forEach(function (row) { row.classList.remove('latest-row'); });
      if (rows[0] && rows[0].cells[0]) {
        rows[0].classList.add('latest-row');
        var badge = textNode('span', 'latest-badge', '最新');
        var timeValue = rows[0].cells[0].querySelector('.cell-value') || rows[0].cells[0];
        timeValue.insertBefore(badge, timeValue.firstChild);
      }
      var container = table.closest('.collapsible-container');
      var count = container && container.querySelector(':scope > .collapsible-trigger .year-count');
      if (count) count.textContent = rows.length + ' TALKS';
    }

    function syncPublishedTalksToSchedule(talks) {
      var touched = [];
      content.querySelectorAll('tr[data-live-talk="true"]').forEach(function (row) {
        var table = row.closest('table');
        if (table && touched.indexOf(table) === -1) touched.push(table);
        row.remove();
      });
      talks.filter(function (talk) { return talk.date; }).forEach(function (talk) {
        var year = talk.date.slice(0, 4);
        var table = scheduleTableForYear(year);
        if (!table || !table.tBodies.length) return;
        var dateLabel = talk.date.slice(5).replace('-', '/');
        var duplicate = Array.prototype.some.call(table.rows, function (row, index) {
          return index > 0 && row.getAttribute('data-live-talk') !== 'true' &&
            row.cells[0] && row.cells[0].textContent.indexOf(dateLabel) !== -1 &&
            row.cells[1] && row.cells[1].textContent.indexOf(talk.speaker_name) !== -1;
        });
        if (!duplicate) table.tBodies[0].appendChild(renderScheduleRow(talk));
        if (touched.indexOf(table) === -1) touched.push(table);
      });
      touched.forEach(updateScheduleTable);
    }

    function shanghaiDateKey(date) {
      try {
        var parts = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
        }).formatToParts(date);
        var values = {};
        parts.forEach(function (part) { values[part.type] = part.value; });
        return values.year + '-' + values.month + '-' + values.day;
      } catch (error) {
        return localDateKey(date);
      }
    }

    fetch('/api/public/talks', { cache: 'no-store', headers: { Accept: 'application/json' } })
      .then(function (response) {
        if (!response.ok) throw new Error('public talk feed unavailable');
        return response.json();
      })
      .then(function (payload) {
        var publishedTalks = payload.talks || [];
        syncPublishedTalksToSchedule(publishedTalks);
        var today = shanghaiDateKey(new Date());
        var shanghaiNoon = new Date(today + 'T12:00:00+08:00');
        var daysFromMonday = (shanghaiNoon.getUTCDay() + 6) % 7;
        var weekStart = new Date(shanghaiNoon.getTime() - daysFromMonday * 86400000).toISOString().slice(0, 10);
        var weekEnd = new Date(shanghaiNoon.getTime() + (6 - daysFromMonday) * 86400000).toISOString().slice(0, 10);
        var talks = publishedTalks.filter(function (talk) {
          return talk.date && talk.date >= weekStart && talk.date <= weekEnd;
        }).sort(function (left, right) {
          return (left.date + left.start_time).localeCompare(right.date + right.start_time);
        });
        grid.textContent = '';
        talks.forEach(function (talk) { grid.appendChild(renderTalk(talk)); });
        section.hidden = talks.length === 0;
        status.textContent = talks.length ? '本周共 ' + talks.length + ' 场讲座。' : '';
      })
      .catch(function () {
        /* GitHub Pages 没有上海站点 API；保留仓库中已写入的公开讲座。 */
        section.hidden = !grid.querySelector('.upcoming-talk-card');
      });
  }

  function refreshFooter() {
    var footer = content.querySelector('#footer-text');
    if (footer) footer.innerHTML = '© FAI Seminar · Foundational Artificial Intelligence · 保持好奇，开放交流。';
  }

  enhanceNavigation();
  if (isArchive) {
    loadCompleteArchive().then(function () {
      normalizeInstitutions();
      prepareArchiveSchedule();
      enhanceTables();
      enhanceCollapsibles();
      addArchiveSearch();
      refreshFooter();
    });
  } else {
    if (isHome) {
      buildHomeHero();
      loadUpcomingTalks();
    }
    normalizeInstitutions();
    refreshPeople();
    if (isHome) prepareHomeSchedule();
    enhanceTables();
    enhanceCollapsibles();
    refreshFooter();
  }
})();
