import { MouseEvent } from "react";
import { cleanString } from ".";

const rippleEffectDuration = 300;
export const rippleEffect = (e: MouseEvent<HTMLAnchorElement>, color = "#fff"): Promise<void> => {
    return new Promise((resolve) => {
        if ("paintWorklet" in window.CSS === false) {
            resolve();
        }

        const $el = e.currentTarget;
        $el.classList.add('animating');

        const rect = $el.getBoundingClientRect();

        const [x, y] = [(e.clientX - rect.left), (e.clientY - rect.top)];
        const start = performance.now();

        requestAnimationFrame(function raf(now) {
            const count = Math.floor(now - start);
            $el.style.cssText = `--ripple-x: ${x}; --ripple-y: ${y}; --animation-tick: ${count}; --ripple-color: ${color}`;

            if (count > rippleEffectDuration) {
                $el.classList.remove('animating');
                $el.style.cssText = `--animation-tick: 0`;

                resolve();
                return;
            }
            requestAnimationFrame(raf);
        });
    })
}

export const loadPokemonPage = async (e: MouseEvent<HTMLAnchorElement>, pkmnTypes: string[]) => {
    if ("paintWorklet" in window.CSS === false) {
        return;
    }

    const $el = e.currentTarget;
    e.preventDefault();

    const href = $el.href;

    $el.removeAttribute("href");

    let rippleColor = window.getComputedStyle(document.body).getPropertyValue(`--type-${cleanString(pkmnTypes[0])}`);
    if (Math.random() > 0.5 && pkmnTypes[1]) {
        rippleColor = window.getComputedStyle(document.body).getPropertyValue(`--type-${cleanString(pkmnTypes[1])}`)
    }

    await rippleEffect(e, rippleColor);

    window.location.href = href;
}
