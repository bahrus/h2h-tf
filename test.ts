import {H2H_TF, instantiateTemplate} from './h2h-tf.js';
import {define} from 'xtal-latx/define.js';

const containerTemplate = document.createElement('template');
containerTemplate.innerHTML = /* html */`
    <input aria-controls='[nav]' aria-haspopup='true' aria-labelledby='[menu]' id='[link-top]' role='[button]' tabindex='[1]' type='checkbox'>
    <label class='[down]' for='[link-top]' id='[menu]' role='none' tabindex='-1'>[Menu]</label>
    <ul aria-labelledby='[menu]' id='[nav]' role='menu'>
        <li role='none'></li>
    </ul>
`
export class test_1 extends H2H_TF{
    static get is(){return 'test-1';}
    connectedCallback(){
        this.transform = {
            'nav': (context) =>{
                const nav = (context.el as HTMLElement).cloneNode(false) as HTMLElement;
                nav.setAttribute('role', 'menu');
                context.leaf.appendChild(nav);
                context.leaf = nav;
                context.stack.push(nav);
                context.processChildren = true;
            },
            'fieldset': (context) =>{
                const templ = instantiateTemplate(containerTemplate, {});
                context.leaf.appendChild(templ);
                context.leaf = context.leaf.querySelector('li');
                context.stack.push(context.leaf);
                context.processChildren = true;
            }
            // 'li': (context) =>{
            //     innerText = context.el.firstChild.nodeValue;
            //     const span = document.createElement('span');
            //     span.innerText = innerText;
            //     context.leaf.appendChild(span); 
            //     context.leaf = span;
            //     context.stack.push(span);
            //     context.processChildren = true;
                
            // }            
        }
        super.connectedCallback();
    }
}
define(test_1);