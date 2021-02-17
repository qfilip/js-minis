import * as renderer from './render.js';

export function toggleAutoScroll() {
    cfgEventAutoScroll = !cfgEventAutoScroll;
    renderer.renderCfgScrollBtnText();

    window.localStorage.setItem('cfgScroll', cfgEventAutoScroll);
}