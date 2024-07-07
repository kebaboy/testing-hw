import { basename } from "./utils";

describe('Каталог товаров:', () => {
    it('для всех товаров корректно отображаются данные: название, цена, ссылка на страницу товара', async ({browser}) => {
        await browser.url(`${basename}/catalog`);
        const products = await browser.$$('.ProductItem');

        for (const product of products) {
            const name = await product.$('.ProductItem-Name');
            const price = await product.$('.ProductItem-Price');
            const link = await product.$('.ProductItem-DetailsLink');
            const nameText = await name.getText();
            const priceText = await price.getText();
            const linkHref = await link.getAttribute('href');
            expect(nameText).toBeTruthy();
            expect(priceText).toBeTruthy();
            expect(linkHref).toBeTruthy()
        }
    })
    it('для товаров из корзины должен отображаться соответствующая надпись', async ({browser}) => {
        await browser.url(`${basename}/catalog/0`);
        const add = await browser.$('.ProductDetails-AddToCart');

        await add.click();

        await browser.url(`${basename}/catalog`);
        const badge = await browser.$('.ProductItem .CartBadge');
        expect(badge).toExist()
    })
})