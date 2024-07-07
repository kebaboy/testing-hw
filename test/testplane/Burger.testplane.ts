import { basename } from "./utils";

describe('Меню бургер:', () => {
    it('появляется на ширине меньше 576px', async ({browser}) => {
        await browser.url(`${basename}`);

        await browser.setWindowSize(575, 713);

        const toggler = await browser.$('.Application-Toggler.navbar-toggler');
        const menu = await browser.$('.Application-Menu.collapse');
        const isTogglerDisplayed = await toggler.getCSSProperty('display');
        const isMenuDisplayed = await menu.getCSSProperty('display');
        expect(isTogglerDisplayed.value).toEqual('block');
        expect(isMenuDisplayed.value).toEqual('none');
    })
    it('должно открываться при нажатии', async ({browser}) => {
        await browser.url(`${basename}`);
        await browser.setWindowSize(575, 713);
        const toggler = await browser.$('.Application-Toggler.navbar-toggler');

        await toggler.click()

        const menu = await browser.$('.Application-Menu');
        const isMenuDisplayed = await menu.getCSSProperty('display');
        expect(isMenuDisplayed.value).toEqual('block');
    })
    it('должно закрываться при выборе элемента из меню', async ({browser}) => {
        await browser.url(`${basename}/delivery`);
        await browser.setWindowSize(575, 713);
        const toggler = await browser.$('.Application-Toggler.navbar-toggler');
        await toggler.click();
        const contactsLink = await browser.$(`[href="${basename}/contacts"]`);

        await contactsLink.click();
        
        const menu = await browser.$('.Application-Menu.navbar-collapse');
        const isMenuDisplayed = await menu.getCSSProperty('display');
        expect(isMenuDisplayed.value).toEqual('none');
    })
})