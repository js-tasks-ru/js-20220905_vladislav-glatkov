class Tooltip {
  static tooltip = null;
  constructor() {
    if (!Tooltip.tooltip) {
      Tooltip.tooltip = this;
    } else {
      return Tooltip.tooltip;
    }
  }
  getTemplate(tooltip) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = tooltip;
    wrapper.classList.add("tooltip");
    return wrapper;
  }
  initialize () {
    document.addEventListener('pointerover', this.createTooltip);
    document.addEventListener('pointerout', this.removeTooltip);
  }
  render(tooltip) {
    this.element = this.getTemplate(tooltip);
    document.body.append(this.element);
  }
  createTooltip = (event) => {
    const eventTarget = event.target.closest("[data-tooltip]");
    if (!eventTarget) return;
    document.body.addEventListener("pointermove", this.motionTooltip);
    this.render(event.target.dataset.tooltip);
  }
  motionTooltip = (event) => {
    const y = event.clientY;
    const x = event.clientX;
    this.element.style.top = y + "px";
    this.element.style.left = x + "px";
  };

  removeTooltip = (event) => {
    this.remove();
    document.body.removeEventListener(
      "pointermove",
      this.motionTooltip
    );
  }
  removeEventListeners() {
    document.removeEventListener("poniterover", this.createTooltip);
    document.removeEventListener("pointerout", this.removeTooltip);
  }
  remove() {
    this.element?.remove();
  }
  destroy() {
    this.remove();
    this.removeEventListeners();
    Tooltip.tooltip = null;
  }
}

export default Tooltip;
