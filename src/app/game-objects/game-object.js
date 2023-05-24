import PlayArea from 'app/game-objects/board/models/play-area';
import { setStyle } from "app/utils/set-style";
export default class GameObject {
    constructor({ domEl = document.createElement('div'), parent = GameObject.container, className = "", inContainer = false } = {}) {
        this.translateY = ({ rows = 0, duration = 0 } = {}) => {
            this.domEl.style.transitionDuration = `${duration}s`;
            this.domEl.style.transform =
                `translateY(${rows * PlayArea.squareSize}px)`;
        };
        this.domEl = domEl;
        if (inContainer) {
            this.container = parent = new GameObject();
        }
        if (className) {
            this.className = className;
        }
        parent.append(this.domEl);
    }
    static remove(gameObject) {
        this.container.domEl.removeChild(gameObject.domEl);
    }
    set domEl(domEl) {
        if (domEl instanceof HTMLElement) {
            this.domElement = domEl;
        }
        else if (typeof domEl === "object") {
            const [key] = Object.keys(domEl);
            this.domElement = this[key] = domEl[key];
        }
    }
    get domEl() {
        return this.domElement;
    }
    set className(className) {
        this.domEl.className = className;
        this.container?.domEl.setAttribute("class", `${className}-container`);
    }
    append(el) {
        this.domEl.append(el);
    }
    set style(config) {
        setStyle.call(this, { element: this.domEl, styles: config });
    }
    set zIndex(zIndex) {
        const { domEl } = (this?.container || this);
        domEl.style.zIndex = zIndex;
    }
    onClick(callback) {
        this.domEl.addEventListener("click", callback);
    }
}
GameObject.container = new GameObject({
    domEl: document.createElement('main'),
    parent: document.querySelector("body")
});
