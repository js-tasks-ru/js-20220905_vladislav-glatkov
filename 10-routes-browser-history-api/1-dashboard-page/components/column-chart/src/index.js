import fetchJson from '../../../utils/fetch-json.js';
//https://course-js.javascript.ru/api/dashboard/orders?from={}&to={}

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    element;
    chartHeight = 50;
    data = [];
    subElements = {};
    values = [];

    constructor({
      label = '',
      link = '',
      url = '',
      range = {
        from: new Date(),
        to: new Date(),
      },
     
      formatHeading = data => data} = {}) {
      this.label = label;
      this.link = link;
      this.url = new URL(url, BACKEND_URL);
      this.formatHeading = formatHeading;
      this.from = range.from;
      this.to = range.to;
      this.render();
      
    }

    async fetchColumnChart() {
      this.element?.classList?.add("column-chart_loading");
      const urlQueryString = new URL(this.url);
      urlQueryString.searchParams.set("from", this.from.toISOString());
      urlQueryString.searchParams.set("to", this.to.toISOString());
    
      await fetchJson(urlQueryString)
        .then((data) => {
          this.values = Object.values(data);
          this.data = data; 
          if (this.values.length) {
            this.element?.classList?.remove("column-chart_loading");
          }
          this.renderColumnChart();
        });
 
      return this.data;
    }
  
    getLink() {
      return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
    }
    
    getColumnProps() {
      const maxValue = Math.max(...this.values);
      const scale = this.chartHeight / maxValue;
  
      return this.values.map(item => {
        const percent = (item / maxValue * 100).toFixed(0) + '%';
        const value = String(Math.floor(item * scale));
  
        return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
      }).join('');
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

    getTemplate() {
     
      return (`
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">
             Total ${this.label}
            ${this.getLink()}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
              ${this.getHeader()}
            </div>
            <div data-element="body" class="column-chart__chart">
            ${this.getColumnProps()}
            </div>
          </div>
        </div>
      </div>
      `);
    }

    renderColumnChart() {
      const { body, header } = this.subElements;
      body.innerHTML = this.getColumnProps();
      header.innerHTML = this.getHeader();
    }

    getHeader() {
      const headerValue = this.values.reduce(
        (prev, curr) => (prev += parseInt(curr)),
        0
      );
      return this.formatHeading(headerValue);
    }
  
    render() {
      const element = document.createElement("div"); 
      element.innerHTML = this.getTemplate();
      this.element = element.firstElementChild;
      this.subElements = this.getSubElements();
      this.fetchColumnChart();
    }
  
    async update(from, to) {
      this.from = from;
      this.to = to;
      this.data = await this.fetchColumnChart();
      return this.data;
    }

    destroy() {
      this.remove();
    }
  
    remove() {
      this.element?.remove();
    }
}