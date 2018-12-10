import {define} from 'xtal-latx/define.js';
import {XtallatX, disabled} from 'xtal-latx/xtal-latx.js';

export interface IContext{
    rootEl: any,
    stack: any[],
    processChildren: boolean;
    leaf: any,
    el: Element | null,
}

export function instantiateTemplate(template: HTMLTemplateElement, data: {[key: string] : any}){
    const instance = template.content.cloneNode(true) as HTMLDocument;
    for(const key in data){
        const val = data[key];
        instance.querySelectorAll(key).forEach(el =>{
            switch(typeof val){
                case 'string':
                    el.innerHTML = val;
                    break;
                case 'function':
                    val(el);
                    break;
                case 'object':
                    Object.assign(el, val);
                    break;
            }
        })
    }
}

export function transfer(target: HTMLElement, source: HTMLElement, attribs: string[] | null = null){
    Object.assign(target.dataset, source.dataset);
    target.className = source.className;
    if(attribs !== null){
        attribs.forEach(attrib =>{
            const srcAttrib = source.getAttribute(attrib);
            if(srcAttrib !== null){
                target.setAttribute(attrib, srcAttrib);
            }
            
        })
    }
}

export class H2H_TF extends XtallatX(HTMLElement){
    static get is(){
        return 'h2h-tf';
    }
    static get observedAttributes(){
        return [disabled];
    }
    _transform! : {[key: string] : (context: IContext) => void }

    get transform(){
        return this._transform;
    }
    set transform(nv){
        this._transform = nv;
        this.onPropsChange();
    }

    _getTarget : (h: H2H_TF) => Element | null = t => {
        let candidate = t.previousElementSibling;
        if(!candidate) candidate = t.parentElement
        return candidate;
    }
    get getTarget(){
        return this._getTarget;
    }
    set getTarget(nv){
        this._getTarget = nv;
    }



    _c!: boolean;
    connectedCallback(){
        this.style.display = 'none';
        this._upgradeProperties([disabled, 'transform', 'target']);
        this._c = true;
        this.onPropsChange();
    }
    value!: any;
    onPropsChange(){
        if(this._disabled || !this._c || !this._transform) return;
        const target = this._getTarget(this);
        if(target === null){
            setTimeout(() =>{
                this.onPropsChange()
            }, 50);
            return;
        }
        const div = document.createElement('div');
        this.value = div;
        const context  = {
            rootEl: this.value, 
            stack: [],
            leaf: this.value,
            processChildren: false,
            el: null,
        } as IContext;
        
        this.process(target, context);
        this.de('value', {
            value: this.value
        })
    }

    process(target: Element, context: IContext){
        for(const selector in this._transform){
            if(target.matches && target.matches(selector)){
                const transformTemplate = this._transform[selector];
                context.processChildren = false;
                context.el = target;
                transformTemplate(context);
                if(context.processChildren && target.childNodes){
                    target.childNodes.forEach(node =>{
                        if(!(<any>node).matches) return;
                        this.process((<any>node) as Element, context)
                    });
                    const s = context.stack;
                    s.pop();
                    context.leaf = s.length > 0 ? s[s.length -1] : null;
                }
            }
        }
    }
}

define(H2H_TF)