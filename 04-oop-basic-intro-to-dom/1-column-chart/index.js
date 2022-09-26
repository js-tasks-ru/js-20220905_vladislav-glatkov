export default class ColumnChart {
  
  chartHeight = 50;
  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = data => data} = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = formatHeading(value);
    this.render();
  }

  
  getLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
  }
  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      const percent = (item / maxValue * 100).toFixed(0) + '%';
      const value = String(Math.floor(item * scale));

      return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
    }).join('');
  }
  getClassName(data) {
    return this.data.length === 0 ? 'column-chart column-chart_loading' : 'column-chart';
  }
  getTemplate() {
   
    return (`
      <div class="${this.getClassName(this.data)}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
           Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.value}
          </div>
          <div data-element="body" class="column-chart__chart">
          ${this.getColumnProps(this.data)}
          </div>
        </div>
      </div>
    </div>
    `);
  }

  render() {
    const element = document.createElement("div"); 
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.elementColumns = this.element.querySelector('.column-chart__chart');
  }

  update(newData = []) {
    this.data = newData;
    this.elementColumns.innerHTML = this.getColumnProps(this.data);
    if (!this.data.length) {
      this.element.className = this.getClassName(this.data);
    } else {
      this.element.className = this.getClassName(this.data);
    }

  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  remove() {
    this.element.remove();
    this.elementColumns.remove();
  }

  destroy() {
    this.remove();
  }
}


