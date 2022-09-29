export default class SortableTable {
  isSortLocally = true;
  fieldValue = '';
  orderValue = '';

  constructor(headerConfig = [], {data = [], sorted = {}} = {}) {
    this.headerConfig = headerConfig;
    this.data = [...data];
    this.sorted = sorted;
    this.fieldValue = sorted.id;
    this.orderValue = sorted.order;
    this.render();
    this.sort(this.fieldValue, this.orderValue);
  }

  sort (fieldValue, orderValue) {
    if (this.isSortLocally) {
      this.sortOnClient(fieldValue, orderValue);
    } else {
      this.sortOnServer();
    }
  }

  sortOnServer() {}

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
    const target = e.target.closest(".sortable-table__cell");

    if (target?.dataset?.sortable === "true") {
      const order = this.orderValue === "asc" ? "desc" : "asc";
      this.orderValue = sort;
      this.sort(target.dataset.id, this.orderValue);
    }
  }

  initEventListeners() {
    document.addEventListener('pointerdown', this.onClickSort);
  }

  removeEventListeners = () => {
    document.removeEventListener('pointerdown', this.onClickSort);
  };

  getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
    <div class="sortable-table">
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
      return data.template ? data.template() : `<div class="sortable-table__cell">${item[data.id]}</div>`;  
    }).join('');
  }

  getHeader() { 
    return this.headerConfig.map(
      (item)=>
        `<div class="sortable-table__cell"
            onclick="${(e)=>this.sort('price', 'asc')}"
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

  render() {
    if (this.element) this.remove();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
    this.initEventListeners();
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

  update() {
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
  }

}
