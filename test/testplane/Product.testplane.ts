import { basename } from "./utils";

describe('Товар:', () => {
    afterEach(async ({browser}) => {
        await browser.execute(() => {
            try {
                localStorage.clear();
            } catch (e) { }
        });
    })
    it('при добавлении товара в корзину должен увеличивать количество товаров корзины в шапке', async ({browser}) => {
        await browser.url(`${basename}/catalog/0`);
        const add = await browser.$('.ProductDetails-AddToCart');

        await add.click();
        const link1 = await browser.$(`[href="${basename}/cart"]`);
        const cartCount1 = await link1.getText();
        await browser.url(`${basename}/catalog/1`);

        await add.click();
        const link2 = await browser.$(`[href="${basename}/cart"]`);
        const cartCount2 = await link2.getText();
    
        expect(cartCount1).toEqual('Cart (1)')
        expect(cartCount2).toEqual('Cart (2)')
    })
    it('при повторном добавлении товара в корзину количество товаров в шапке не изменяется', async ({browser}) => {
        await browser.url(`${basename}/catalog/0`);
        const add = await browser.$('.ProductDetails-AddToCart');

        await add.click();
        await add.click();

        const link = await browser.$(`[href="${basename}/cart"]`);
        const cartCount = await link.getText();
        expect(cartCount).toEqual('Cart (1)')
    })
    it('если товар уже в корзине, то при повторном добавлении в корзину, количество и стоимость товара увеличиваются', async ({browser}) => {
        await browser.url(`${basename}/catalog/0`);
        const add = await browser.$('.ProductDetails-AddToCart');
        const price = await browser.$('.ProductDetails-Price');
        const productPrice = +(await price.getText()).slice(1);

        await add.click();
        await add.click();

        await browser.url('/hw/store/cart');
        const productCount = await browser.$('.Cart-Count');
        const productTotal = await browser.$('.Cart-Total');
        expect(await productCount.getText()).toEqual('2')
        expect(await productTotal.getText()).toEqual('$' + productPrice * 2)
    })

    it('cервер возвращает товар', async ({browser}) => {
        await browser.url(`${basename}/catalog/2`);
        const product = await browser.$('.ProductDetails');

        await product.waitForExist();
        expect(product).toExist()
    })
})