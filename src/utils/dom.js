//funciones utilitarias


//funcion para querySelector
export function qs(selector, root = document) {
    const el = root.querySelector(selector);
    if(!el) throw new Error(`Element not found: "${selector}"`);
    return el;
}

// querySelector All
export function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}

//funcion para traer informacion del dataset
export function dataset(el, key) {
    return el.dataset[key] ?? null;
}

// funcion que no permite volver visble algo
export function setVisible(el, visible) {
    el.classList.toggle('hidden', !visible);
}