import {Tooltip} from "bootstrap";

export default {
    mounted(el, binding) {
        let tooltip = new Tooltip(el, {
            placement: binding.arg || 'top',
            title: binding.value,
            html: true,
        });
    }
}