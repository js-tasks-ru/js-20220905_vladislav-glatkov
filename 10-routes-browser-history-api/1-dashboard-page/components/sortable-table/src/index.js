import fetchJson from '../../../utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  fieldValue = '';
  orderValue = '';
  loading = false;
  subElements = {};
  start = 0
  step = 20
  end = this.start + this.step;

  constructor(headerConfig = [], 
    {data = [],
      sorted = {orderValue: 'asc', fieldValue: 'title'}, 
      url = '', 
      isSortLocally = false} = {}) {
    this.headerConfig = headerConfig;
    this.data = [...data];
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.fieldValue = sorted.id;
    this.orderValue = sorted.order;
    this.url = new URL(url, BACKEND_URL);
    this.render();
    
  }

  getUrl({fieldValue = "title", orderValue = "asc", start = this.start, end = this.end} = {}) {
    const newUrl = new URL(this.url);
    newUrl.searchParams.set("_sort", fieldValue);
    newUrl.searchParams.set("_order", orderValue);
    newUrl.searchParams.set("_start", start);
    newUrl.searchParams.set("_end", end);
    return newUrl;
  }

  async sortOnServer(fieldValue = 'title', orderValue = 'asc') {
    this.fieldValue = fieldValue;
    this.orderValue = orderValue;
    this.data = await this.fetchData({fieldValue, orderValue});
    this.update();
  }

  async fetchData({fieldValue = this.fieldValue, orderValue = this.orderValue, start = this.start, end = this.end }) {
    const urlQueryString = this.getUrl({fieldValue, orderValue, start, end});
    const { table } = this.subElements;
  
    table.classList.add("sortable-table_loading");
    const fetch = await fetchJson(urlQueryString);
    table.classList.remove("sortable-table_loading");
    return fetch;
  }
  

  sortOnClient(fieldValue, orderValue) {
    if (orderValue !== 'asc' && orderValue !== 'desc') {
      console.error('Не правильные значния, проверь сортировку');
      return; 
    }
    this.fieldValue = fieldValue;
    this.orderValue = orderValue;
    let direction = 1;
    if (orderValue === 'desc') {
      direction = -1;
    }
    this.data.sort((a, b)=> {
      if (typeof a[fieldValue] === 'number') {
        return direction * (a[fieldValue] - b[fieldValue]);
      }
      if (typeof a[fieldValue] === 'string') {
        return direction * a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'], {caseFirst: 'upper'});
      }  
    });
    this.update();
  }

  onClickSort = (e) => {

    this.start = 0;
    this.end = this.start + this.step;
    
    const target = e.target.closest('[data-sortable = "true"]');
    if (target?.dataset?.sortable === "true") {
      const order = this.orderValue === "asc" ? "desc" : "asc";
      this.orderValue = order;
    }
    if (this.isSortLocally) {
      this.sortOnClient(target.dataset.id, this.orderValue);
    } else {
      this.sortOnServer(target.dataset.id, this.orderValue); 
    }
    
  }

  initEventListeners() {
    document.addEventListener('mousedown', this.onClickSort);
    window.addEventListener('scroll', this.dynamicScroll);
  }

  removeEventListeners = () => {
    document.addEventListener('mousedown', this.onClickSort);
    document.addEventListener('scroll', this.dynamicScroll);
  }

  dynamicScroll = async () => {
    const {bottom} = this.element.getBoundingClientRect();

    if (bottom < document.documentElement.clientHeight && !this.loading) {
      this.loading = true;
      this.start = this.end;
      this.end = this.start + this.step;
      const fetch = await this.fetchData({ start: this.start, end: this.end });
      this.data = [...this.data, ...fetch];
      
      this.loading = false;
      this.update();
    }
  }
 
  getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
    <div data-element='table' class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.getHeader()}
    </div>
    <div data-element="body" class="sortable-table__body">
      ${this.getBody(this.data)}
    </div>
    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>
    </div>
    </div>
    `; 
  }

  getBody(data) {
    return data.map((item) =>
      ` <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getBodyItem(item)}
        </a>`
    ).join('');
  }

  getBodyItem(item) {
    return this.headerConfig.map((data) => {
      return data.template ? data.template(item[data.id]) : `<div class="sortable-table__cell">${item[data.id]}</div>`;  
    }).join('');
  }

  getHeader() { 
    return this.headerConfig.map(
      (item)=>
        `<div class="sortable-table__cell"
            data-id="${item.id}" 
            data-sortable="${item.sortable}" 
            data-order="${this.fieldValue === item.id ? this.orderValue : ""}"}
         >
          <span>${item.title}</span>
          ${item.sortable ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>` : ''}
        </div>`
    ).join('');
  }

  async render() {
    if (this.element) this.remove();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
    this.fieldValue = 'title';
    this.orderValue = 'asc';

    this.initEventListeners();
    this.data = await this.fetchData({
      fieldValue: this.fieldValue,
      orderValue: this.orderValue,
      start: this.start,
      end: this.end,
    });
    if (this.isSortLocally) {
      this.sortOnClient(this.fieldValue, this.orderValue);
    } else {
      this.sortOnServer(this.fieldValue, this.orderValue); 
    }
  }

  getSubElements() {
    const subElements = {};
    const elements = this.element.querySelectorAll("[data-element]");
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      subElements[name] = subElement;
    }
    return subElements;
  }

  update(data) {
    if(data) {
      this.data = data;
      this.sortOnClient(this.fieldValue, this.orderValue);
    }
    this.element.innerHTML = this.getTemplate();
    this.subElements = this.getSubElements();
  }

  remove() {
    this.element?.remove(); 
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
    this.fieldValue = '';
    this.orderValue = '';
    this.loading = false;
    this.subElements = {};
  }
}
