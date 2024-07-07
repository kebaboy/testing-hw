import { basename } from "./utils";

// не успеваю написать скриншоты для остальных страниц и их состояний
describe('Screenshots:', () => {
    it('главная страница', async ({browser}) => {
        await browser.url(`${basename}`);
        const body = await browser.$('body');
        await body.waitForDisplayed();
        await body.assertView('plain');
    })
    it('страница условий доставки', async ({browser}) => {
        await browser.url(`${basename}/delivery`);
        const body = await browser.$('body');
        await body.waitForDisplayed();
        await body.assertView('plain');
    })
    it('страница контактов', async ({browser}) => {
        await browser.url(`${basename}/contacts`);
        const body = await browser.$('body');
        await body.waitForDisplayed();
        await body.assertView('plain');
    })
})