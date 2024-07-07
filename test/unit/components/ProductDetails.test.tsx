import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ProductDetails } from "../../../src/client/components/ProductDetails";
import { CartState, Product } from "../../../src/common/types";
import React from "react";
import { basename, renderApp } from "../../utils";
import '@testing-library/jest-dom';
import { CartApi, ExampleApi } from "../../../src/client/api";
import { MockCartApi } from "../mocks/CartApi";
import { Application } from "../../../src/client/Application";

const mockProductDetails: Product = {
    id: 1,
    name: 'Product 1',
    price: 100,
    description: 'comfortable product',
    material: 'cotton',
    color: 'lavender',
};

describe('ProductDetails', () => {

    // beforeEach(() => {
    //     const { container } = renderApp(<ProductDetails product={mockProductDetails} />, [`${basename}/catalog/${mockProductDetails.id}`]);
    // });

    it('должен отображать информацию о продукте и кнопку добавления в корзину', () => {    
        const { container } = renderApp(<ProductDetails product={mockProductDetails} />, [`${basename}/catalog/${mockProductDetails.id}`]);
    
        const productName = screen.getByText(mockProductDetails.name);
        const productPrice = screen.getByText(`$${mockProductDetails.price}`);
        const productDescription = screen.getByText(mockProductDetails.description);
        const productMaterial = screen.getByText(mockProductDetails.material);
        const productColor = screen.getByText(mockProductDetails.color);
        const addButton = screen.getByRole('button', { name: /add to cart/i });
    
        expect(productName).toBeInTheDocument();
        expect(productPrice).toBeInTheDocument();
        expect(productDescription).toBeInTheDocument();
        expect(productMaterial).toBeInTheDocument();
        expect(productColor).toBeInTheDocument();
        expect(addButton).toBeInTheDocument();

        // screen.logTestingPlaygroundURL();
    })

    it('должен отображать, что продукт добавлен в корзину для товара из корзины', () => {
        const mockCart: CartState = {
            1: {
                name: 'Product 1',
                price: 100,
                count: 2,
            },
        };
        jest.spyOn(CartApi.prototype, 'getState').mockReturnValue(mockCart);
        const { container } = renderApp(<ProductDetails product={mockProductDetails} />, [`${basename}/catalog/${mockProductDetails.id}`]);

        // screen.logTestingPlaygroundURL();
        const badge = container.querySelector('.CartBadge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent('Item in cart');
    })

    it('должен отображать, что продукт добавлен в корзину после добавления товара в корзину', () => {
        const mockCart: CartState = {
            1: {
                name: 'Product 1',
                price: 100,
                count: 2,
            },
        };
        jest.spyOn(CartApi.prototype, 'getState').mockReturnValue({});
        jest.spyOn(CartApi.prototype, 'setState').mockImplementation(() => mockCart);
        const { container } = renderApp(<ProductDetails product={mockProductDetails} />, [`${basename}/catalog/${mockProductDetails.id}`]);
        
        expect(container.querySelector('.CartBadge')).not.toBeInTheDocument();

        const addButton = screen.getByRole('button', { name: /add to cart/i });
        fireEvent.click(addButton);

        expect(container.querySelector('.CartBadge')).toBeInTheDocument();
        expect(container.querySelector('.CartBadge')).toHaveTextContent('Item in cart');
    })

    // it('при добавлении товара в корзину должен увеличивать количество товаров корзины в шапке', async () => {
    //     // const mockCart: CartState = {
    //     //     1: {
    //     //         name: 'Product 1',
    //     //         price: 100,
    //     //         count: 2,
    //     //     },
    //     // };
    //     jest.spyOn(CartApi.prototype, 'getState').mockReturnValue({});
    //     jest.spyOn(CartApi.prototype, 'setState').mockImplementation(() => {});
    //     ExampleApi.prototype.getProductById = jest.fn().mockResolvedValue({ data: mockProductDetails });
    //     const { container } = renderApp(<Application />, [`${basename}/catalog/${mockProductDetails.id}`]);
        
    //     waitFor(() => {
    //         expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
    //         expect(screen.getByRole('link', { name: /cart/i })).toHaveTextContent('Cart');
            
    //     })
    
    //     screen.logTestingPlaygroundURL();

    //     const addButton = screen.getByRole('button', { name: /add to cart/i });
    //     // fireEvent.click(addButton);

    //     // screen.logTestingPlaygroundURL();


    //     // expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
    //     // expect(screen.getByRole('link', { name: /cart/i })).toHaveTextContent('Cart (1)');

    // })
})