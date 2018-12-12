import {H2H_TF, instantiateTemplate} from './h2h-tf.js';
import {define} from 'xtal-latx/define.js';

const containerTemplate = document.createElement('template');
containerTemplate.innerHTML = /* html */`
    <input aria-controls='[nav]' aria-haspopup='true' aria-labelledby='[menu]' id='x' role='[button]' tabindex='[1]' type='checkbox'>
    <label class='[down]' for='[link-top]' id='[menu]' role='none' tabindex='-1'>[Menu]</label>
    <ul aria-labelledby='[menu]' id='[nav]' role='menu'>
        <li role='none'></li>
    </ul>
`;
const containerTemplateSettings : {[key: string] : string[]} = {
    'input': ['id', 'aria-controls', 'role', 'tabindex']
}
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
                const fs = context.el as HTMLFieldSetElement;
                for(const key in containerTemplateSettings){
                    const item = templ.querySelector(key) as HTMLElement;
                    const vals = fs.dataset.attribs!.split(',');
                    const attribs = containerTemplateSettings[key];
                    attribs.forEach((attrib, idx) =>{
                        item.setAttribute(attrib, vals[idx]);
                    })
                }
                const legend = fs.querySelector('legend') as HTMLLegendElement;
                const label = templ.querySelector('label') as HTMLLabelElement;
                label.innerHTML = legend.innerHTML;
                // ip.id = fs.dataset.id!;
                context.leaf.appendChild(templ);
                context.leaf = context.leaf.querySelector('li');
                context.stack.push(context.leaf);
                context.processChildren = true;
            }

            
        }
        super.connectedCallback();
    }
}
define(test_1);