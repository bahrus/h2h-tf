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
type selectorAttribArray = {[key: string]:string[]};
const containerTemplateSettings : {[key: string] : selectorAttribArray} = {
    'input': {
        '.': ['id', 'aria-controls', 'role', 'tabindex']
    },
    'label':{
        'legend': ['id', '.className', '.innerHTML', 'for']
    }
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
                //const fs = context.el as HTMLFieldSetElement;
                for(const key in containerTemplateSettings){
                    const item = templ.querySelector(key) as HTMLElement;
                    const rules = containerTemplateSettings[key];
                    //const vals = fs.dataset.attribs!.split(',');
                    for(var src in rules){
                        let srcEl: HTMLElement;
                        if(src === '.'){
                            srcEl = context.el as HTMLElement;
                        }else{
                            srcEl = context.el!.querySelector(src) as HTMLElement;
                        }
                        const attribs = srcEl.dataset.attribs;
                        if(!attribs) continue;
                        const vals = attribs.split(',');
                        const ruleCategory = rules[src];

                        ruleCategory.forEach((rule, idx) =>{
                            if(rule.startsWith('.')){
                                (<any>item)[rule.substr(1)] = vals[idx];
                            }else{
                                item.setAttribute(rule, vals[idx]);
                            }
                            
                        })
                    }
                    
                }
                
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