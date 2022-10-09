import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  element;
  subElements = {};
  components = {};
  url = new URL('api/dashboard/bestsellers', BACKEND_URL);
  now = new Date();
  to = new Date();
  from = new Date(this.now.setMonth(this.now.getMonth() - 1));

  async render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(); 
    this.initRangePicker();
    this.createOrdersChart();
    this.createSalesChart();
    this.createCustomersChart();
    this.createSortableTable();
    this.initEventListeners();
    return this.element;
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
    return `
    <div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Dashboard</h2>
        <!-- RangePicker component -->
        <div data-element="rangePicker">
        
        </div>
      </div>
      <div data-element="chartsRoot" class="dashboard__charts">
        <!-- column-chart components -->
        <div data-element="ordersChart" class="dashboard__chart_orders">
        </div>
        <div data-element="salesChart" class="dashboard__chart_sales">
        </div>
        <div data-element="customersChart" class="dashboard__chart_customers">
        </div>
      </div>

      <h3 class="block-title">Best sellers</h3>

      <div data-element="sortableTable">
      </div>
    </div>
    `;
  }

  initRangePicker() {
    const { rangePicker } = this.subElements;
    const from = this.from;
    const to = this.to;
    const picker = new RangePicker({
      from,
      to
    });
    rangePicker.append(picker.element);
    this.components.rangePicker = picker;
  }

  createOrdersChart() {
    const { ordersChart } = this.subElements; 
    const from = this.from;
    const to = this.to;

    const chart = new ColumnChart({
      url: 'api/dashboard/orders',
      range: {
        from,
        to
      },
      label: 'orders',
      link: '#'
    }); 

    ordersChart.append(chart.element);
    this.components.ordersChart = chart;
  }

  createSalesChart() {
    const { salesChart } = this.subElements; 
    const from = this.from;
    const to = this.to;

    const chart = new ColumnChart({
      url: 'api/dashboard/sales',
      range: {
        from,
        to
      },
      label: 'sales',
      formatHeading: data => `$${data}`
    }); 

    salesChart.append(chart.element);
    this.components.salesChart = chart;
  }

  createCustomersChart() {
    const { customersChart } = this.subElements; 
    const from = this.from;
    const to = this.to;

    const chart = new ColumnChart({
      url: 'api/dashboard/customers',
      range: {
        from,
        to
      },
      label: 'customers',
    }); 

    customersChart.append(chart.element);
    this.components.customersChart = chart;
  }

  createSortableTable() {
    const { sortableTable } = this.subElements; 

    const chart = new SortableTable(header, {
      url: `api/dashboard/bestsellers?from=${this.from.toISOString()}&to=${this.to.toISOString()}`,
      isSortLocally: true
    });
    //если ставить isSortLocally: false то перестает сортировать на серверной части
    

    sortableTable.append(chart.element);
    this.components.sortableTable = chart;
  }

  initEventListeners () {
    this.components.rangePicker.element.addEventListener('date-select', event => {
      const { from, to } = event.detail;

      this.update(from, to);
    });
  }

  async update(from, to) {
    const data = await this.fetchData(from, to);
    const {sortableTable, ordersChart, salesChart, customersChart} = this.components;

    sortableTable.update(data);
    ordersChart.update(from, to);
    salesChart.update(from, to);
    customersChart.update(from, to);
  }

  fetchData (from, to) {
    this.url.searchParams.set('_start', '1');
    this.url.searchParams.set('_end', '21');
    this.url.searchParams.set('_sort', 'title');
    this.url.searchParams.set('_order', 'asc');
    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());

    return fetchJson(this.url);
  }

  remove() {
    this.element?.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
    this.element = null;
    Object.values(this.components).forEach(item => item.destroy());
    this.components = {};
  }
}
