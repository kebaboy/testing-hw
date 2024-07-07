import { basename } from "./utils";

describe('Корзина:', () => {
    it('cодержимое корзины сохраняется между перезагрузками страницы', async ({browser}) => {
        await browser.url(`${basename}/catalog/0`);
        const addBtn = await browser.$('.ProductDetails-AddToCart');

        await addBtn.click();

        await browser.url(`${basename}/cart`);
        const cartTable = await browser.$('.Cart-Table');
        await cartTable.waitForExist()
        expect(cartTable).toExist()
    })
})