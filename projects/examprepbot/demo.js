// Browse saved questions and slide images without a model or PDF server.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const form = $('filters');
  const week = $('week-filter');
  const type = $('type-filter');
  const search = $('search-filter');
  const list = $('question-list');
  const detail = $('question-detail');
  const status = $('demo-status');
  let data;
  let selectedId;
  let visible = [];

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function showSource(label, panel) {
    const page = data.pages[label];
    if (!page) return;
    panel.replaceChildren(element('strong', `[${label}] · Source slide`),
      element('p', `${data.course.toUpperCase()} · PDF page ${page.page}`));
    if (page.image) {
      const figure = element('figure', undefined, 'source-slide');
      const loading = element('p', 'Loading slide…', 'slide-status');
      loading.setAttribute('role', 'status');
      const link = element('a');
      link.href = page.image;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', `Open source slide ${label} at full size in a new tab`);
      const image = element('img');
      image.alt = `${data.course.toUpperCase()} source slide ${label}, PDF page ${page.page}`;
      image.width = page.width;
      image.height = page.height;
      image.decoding = 'async';
      image.hidden = true;
      const caption = element('figcaption');
      const fullSize = element('a', 'Open full-size slide ↗');
      fullSize.href = page.image;
      fullSize.target = '_blank';
      fullSize.rel = 'noopener';
      caption.append(fullSize);
      caption.hidden = true;
      image.addEventListener('load', () => {
        loading.hidden = true;
        image.hidden = false;
        caption.hidden = false;
      });
      image.addEventListener('error', () => {
        image.hidden = true;
        caption.hidden = true;
        loading.hidden = false;
        loading.replaceChildren(document.createTextNode('The slide could not be loaded. '));
        const retry = element('button', 'Try again', 'btn');
        retry.type = 'button';
        retry.addEventListener('click', () => {
          loading.textContent = 'Loading slide…';
          image.src = `${page.image}?retry=${Date.now()}`;
        });
        loading.append(retry);
      });
      link.append(image);
      figure.append(loading, link, caption);
      panel.append(figure);
      image.src = page.image;
    } else {
      panel.append(element('p', 'A slide preview is not available for this reference.'));
    }
    const file = element('p');
    file.append(element('code', page.source));
    panel.append(file);
    panel.hidden = false;
    detail.querySelectorAll('.citation').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.label === label));
    });
  }

  function answerText(text, panel) {
    const fragment = document.createDocumentFragment();
    // A small safe renderer for the formatting present in the export; never inject HTML.
    for (const paragraph of text.split(/\n\s*\n/)) {
      const p = element('p');
      const tokens = /(\[W\d+(?:-\d+)?(?: Tut)? p\.\d+\]|\*\*[^*]+\*\*|`[^`]+`)/g;
      let end = 0;
      for (const match of paragraph.matchAll(tokens)) {
        p.append(document.createTextNode(paragraph.slice(end, match.index)));
        const token = match[0];
        if (token.startsWith('[W') && data.pages[token.slice(1, -1)]) {
          const label = token.slice(1, -1);
          const button = element('button', token, 'citation');
          button.type = 'button';
          button.dataset.label = label;
          button.setAttribute('aria-label', `View source ${label}`);
          button.setAttribute('aria-controls', 'source-reference');
          button.setAttribute('aria-pressed', 'false');
          button.addEventListener('click', () => showSource(label, panel));
          p.append(button);
        } else if (token.startsWith('**')) {
          p.append(element('strong', token.slice(2, -2)));
        } else if (token.startsWith('`')) {
          p.append(element('code', token.slice(1, -1)));
        } else {
          p.append(document.createTextNode(token));
        }
        end = match.index + token.length;
      }
      p.append(document.createTextNode(paragraph.slice(end)));
      fragment.append(p);
    }
    return fragment;
  }

  function renderQuestion(question) {
    detail.replaceChildren();
    const topic = data.weeks.find(item => item.week === question.week)?.topic || '';
    detail.append(element('p', `Week ${question.week} / ${topic}`, 'question-topic'));
    const tags = element('div', undefined, 'question-tags');
    tags.append(element('span', question.type), element('span', `${question.marks} marks`));
    const heading = element('h3', question.question);
    heading.id = 'selected-question';
    detail.setAttribute('aria-labelledby', heading.id);
    detail.append(tags, heading);

    const answer = element('div', undefined, 'answer');
    const source = element('div', undefined, 'source-reference');
    source.id = 'source-reference';
    source.hidden = true;
    source.setAttribute('role', 'region');
    source.setAttribute('aria-label', 'Cited source slide');
    answer.append(element('h4', 'Saved model answer'), answerText(question.answer, source), source);
    detail.append(answer);
    // Open the first cited slide so the evidence is visible without a click.
    const first = answer.querySelector('.citation');
    if (first) showSource(first.dataset.label, source);
  }

  function select(question) {
    selectedId = question.id;
    list.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-current', String(button.dataset.id === selectedId));
    });
    renderQuestion(question);
  }

  function filter() {
    const query = search.value.trim().toLowerCase();
    visible = data.questions.filter(question => {
      const topic = data.weeks.find(item => item.week === question.week)?.topic || '';
      return (!week.value || question.week === Number(week.value)) &&
        (!type.value || question.type === type.value) &&
        (!query || `${question.question} ${topic}`.toLowerCase().includes(query));
    });
    list.replaceChildren();
    status.textContent = `${visible.length} of ${data.questions.length} questions · ${data.course.toUpperCase()} · Saved output`;
    $('practice-layout').hidden = visible.length === 0;
    $('demo-empty').hidden = visible.length !== 0;
    if (!visible.length) {
      selectedId = null;
      detail.replaceChildren();
      return;
    }
    for (const question of visible) {
      const li = element('li');
      const button = element('button', undefined, 'question-option');
      button.type = 'button';
      button.dataset.id = question.id;
      button.append(element('small', `Week ${question.week} · ${question.type} · ${question.marks} marks`),
        element('span', question.question));
      button.addEventListener('click', () => select(question));
      li.append(button);
      list.append(li);
    }
    select(visible.find(question => question.id === selectedId) || visible[0]);
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', event => {
    event.preventDefault();
    week.value = '';
    type.value = '';
    search.value = '';
    filter();
  });
  week.addEventListener('change', filter);
  type.addEventListener('change', filter);
  search.addEventListener('input', filter);

  async function load() {
    $('practice').setAttribute('aria-busy', 'true');
    try {
      const response = await fetch('data/questions.json');
      if (!response.ok) throw new Error(`Question data: HTTP ${response.status}`);
      data = await response.json();
      for (const item of data.weeks) {
        const option = element('option', `Week ${item.week} · ${item.topic}`);
        option.value = item.week;
        week.append(option);
      }
      form.hidden = false;
      filter();
    } catch (error) {
      status.replaceChildren(document.createTextNode('The question set could not be loaded. '));
      const retry = element('button', 'Try again', 'btn');
      retry.type = 'button';
      retry.addEventListener('click', load);
      status.append(retry);
      console.error(error);
    } finally {
      $('practice').setAttribute('aria-busy', 'false');
    }
  }
  load();
})();
