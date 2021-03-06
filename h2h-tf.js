import { define } from 'xtal-latx/define.js';
import { XtallatX, disabled } from 'xtal-latx/xtal-latx.js';
export function instantiateTemplate(template, data) {
    const instance = template.content.cloneNode(true);
    for (const key in data) {
        const val = data[key];
        instance.querySelectorAll(key).forEach(el => {
            switch (typeof val) {
                case 'string':
                    el.innerHTML = val;
                    break;
                case 'function':
                    val(el);
                    break;
                case 'object':
                    if (Array.isArray(val)) {
                        val.forEach(pair => {
                            el.setAttribute(pair[0], pair[1]);
                        });
                    }
                    else {
                        Object.assign(el, val);
                    }
                    break;
            }
        });
    }
    return instance;
}
export function transfer(target, source, attribs = null) {
    Object.assign(target.dataset, source.dataset);
    target.className = source.className;
    if (attribs !== null) {
        attribs.forEach(attrib => {
            const srcAttrib = source.getAttribute(attrib);
            if (srcAttrib !== null) {
                target.setAttribute(attrib, srcAttrib);
            }
        });
    }
}
export class H2H_TF extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._getTarget = t => {
            let candidate = t.previousElementSibling;
            if (!candidate)
                candidate = t.parentElement;
            return candidate;
        };
    }
    static get is() {
        return 'h2h-tf';
    }
    static get observedAttributes() {
        return [disabled];
    }
    get transform() {
        return this._transform;
    }
    set transform(nv) {
        this._transform = nv;
        this.onPropsChange();
    }
    get getTarget() {
        return this._getTarget;
    }
    set getTarget(nv) {
        this._getTarget = nv;
    }
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties([disabled, 'transform', 'target']);
        this._c = true;
        this.onPropsChange();
    }
    onPropsChange() {
        if (this._disabled || !this._c || !this._transform)
            return;
        const target = this._getTarget(this);
        if (target === null) {
            setTimeout(() => {
                this.onPropsChange();
            }, 50);
            return;
        }
        const div = document.createElement('div');
        this.value = div;
        const context = {
            rootEl: this.value,
            stack: [],
            leaf: this.value,
            processChildren: false,
            el: null,
        };
        this.process(target, context);
        this.de('value', {
            value: this.value
        });
        console.log(this.value);
    }
    process(target, context) {
        for (const selector in this._transform) {
            if (target.matches && target.matches(selector)) {
                const transformTemplate = this._transform[selector];
                context.processChildren = false;
                context.el = target;
                transformTemplate(context);
                if (context.processChildren && target.childNodes) {
                    target.childNodes.forEach(node => {
                        if (!node.matches)
                            return;
                        this.process(node, context);
                    });
                    const s = context.stack;
                    s.pop();
                    context.leaf = s.length > 0 ? s[s.length - 1] : null;
                }
            }
        }
    }
}
define(H2H_TF);
//# sourceMappingURL=h2h-tf.js.map