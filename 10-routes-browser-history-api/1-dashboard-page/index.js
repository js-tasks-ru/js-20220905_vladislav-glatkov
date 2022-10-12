import RangePicker from "./components/range-picker/src/index.js";
import SortableTable from "./components/sortable-table/src/index.js";
import ColumnChart from "./components/column-chart/src/index.js";
import header from "./bestsellers-header.js";

import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru/";

export default class Page {
  element;
  subElements = {};
  components = {};

  async render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
    await this.createComponents();
    this.initComponents();
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

  async createComponents() {
    const now = new Date();
    const to = new Date();
    const from = new Date(now.setMonth(now.getMonth() - 1));
    this.components.rangePicker = new RangePicker({
      from,
      to,
    });

    this.components.ordersChart = new ColumnChart({
      url: "api/dashboard/orders",
      range: {
        from,
        to,
      },
      label: "orders",
      link: "#",
    });

    this.components.salesChart = new ColumnChart({
      url: "api/dashboard/sales",
      range: {
        from,
        to,
      },
      formatHeading: (data) => `$${data}`,
    });

    this.components.customersChart = new ColumnChart({
      url: "api/dashboard/orders",
      range: {
        from,
        to,
      },
      label: "orders",
      link: "#",
    });

    this.components.sortableTable = new SortableTable(header, {
      url: `api/dashboard/bestsellers?from=${from.toISOString()}&to=${to.toISOString()}`,
      isSortLocally: true,
    });
  }

  initComponents() {
    Object.entries(this.components).forEach(([key, value]) => {
      if (this.subElements[key]) {
        this.subElements[key].append(value.element);
      }
    });
  }

  initEventListeners() {
    this.components.rangePicker.element.addEventListener(
      "date-select",
      (event) => {
        const { from, to } = event.detail;
        this.update(from, to);
      }
    );
    document.addEventListener("pointerdown", this.changeAsideMenu);
  }

  changeAsideMenu = (event) => {
    const target = event.target.closest(".sidebar__toggler");
    if (target) {
      document.body.classList.toggle("is-collapsed-sidebar");
    }
  };

  async update(from, to) {
    const data = await this.fetchData(from, to);
    const { sortableTable, ordersChart, salesChart, customersChart } =
      this.components;

    sortableTable.update(data);
    ordersChart.update(from, to);
    salesChart.update(from, to);
    customersChart.update(from, to);
  }

  fetchData(from, to) {
    const url = `${BACKEND_URL}api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`;

    return fetchJson(url);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
    this.element = null;
    Object.values(this.components).forEach((item) => item.destroy());
    this.components = {};
  }
}
