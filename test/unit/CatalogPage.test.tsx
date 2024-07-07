import { CartApi, ExampleApi, LOCAL_STORAGE_CART_KEY } from "../../src/client/api";
import { CartState, CheckoutFormData, CheckoutResponse, Product, ProductShortInfo } from "../../src/common/types";
import { Catalog } from "../../src/client/pages/Catalog";
import { renderApp, basename } from "../utils";
import React from "react";
import axios from "axios";
import { Application } from "../../src/client/Application";
import { getByRole, getByText, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';


// jest.mock('../../src/client/api', () => {
//     const originalModule = jest.requireActual('../../src/client/api');

//     return{
//         ...originalModule,
//         ExampleApi: class {
//             getProducts = jest.fn().mockResolvedValue({ data: mockProducts });
//             getProductById = originalModule.ExampleApi.prototype.getProductById; // or jest.fn() if you want to mock it too
//             checkout = originalModule.ExampleApi.prototype.checkout; // or jest.fn() if you want to mock it too
//         }
//     }
// })

describe('Страница каталога', () => {
    const mockProducts: ProductShortInfo[] = [
        { id: 0, name: 'Product 1', price: 100 },
        { id: 1, name: 'Product 2', price: 200 },
        { id: 2, name: 'Product 3', price: 300 },
        { id: 3, name: 'Product 4', price: 400 },
        { id: 4, name: 'Product 5', price: 500 },
    ];

    afterEach(() => {
        jest.clearAllMocks();
    })

    // aggregate error
    it('ссылка "Catalog" в навигации должна быть активной', () => {
        const { container } = renderApp(<Application />, [`${basename}/catalog`]);
        const link = screen.getAllByRole('link', { name: /catalog/i })[0];

        // screen.logTestingPlaygroundURL();
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass('active');
    })

    describe('Список товаров', () => {

        it('должен отображаться индикатор загрузки когда список товаров пуст', async () => {
            ExampleApi.prototype.getProducts = jest.fn().mockResolvedValue({ data: [] });
    
            const { container, getByText, getAllByTestId } = renderApp(<Catalog />);
    
            expect(ExampleApi.prototype.getProducts).toHaveBeenCalled();
            await waitFor(() => {
                expect(getByText(/loading/i)).toBeInTheDocument()
            });
        })

        it('должен отображаться список товаров магазина', async () => {
            // mockedAxios.get.mockResolvedValue({ data: products });
    
            // (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({ data: [{id: 1, name: 'Product 1', price: 100}] });
    
            ExampleApi.prototype.getProducts = jest.fn().mockResolvedValue({ data: mockProducts });
        
            const { container, getByText } = renderApp(<Catalog />);
    
            expect(ExampleApi.prototype.getProducts).toHaveBeenCalled();
            expect(getByText(/loading/i)).toBeInTheDocument();
    
            // jest.spyOn(ExampleApi.prototype, 'getProducts').mockResolvedValue({ data: mockProducts });
            await waitFor(() => {
                expect(container.querySelectorAll('.ProductItem').length).toBe(5);
                // screen.logTestingPlaygroundURL();
            });
        })

        it('должны отображаться данные о продуктах: название, цена, ссылка на страницу товара', async () => {
            ExampleApi.prototype.getProducts = jest.fn().mockResolvedValue({ data: mockProducts });

            const { container, getByText } = renderApp(<Catalog />);

            // jest.spyOn(ExampleApi.prototype, 'getProducts').mockResolvedValue({ data: mockProducts });
            await waitFor(() => {
                Object.entries(mockProducts).forEach(([id, item], index) => {
                    const card = screen.getAllByTestId(index)[1];
                    expect(card).toBeInTheDocument();
                    
                    expect(card).toHaveTextContent(item.name);
                    expect(card).toHaveTextContent(`$${item.price}`);
                    const detailsLink = within(card).getByRole('link', { name: /details/i });
                    expect(detailsLink).toHaveAttribute('href', `${basename}/catalog/${item.id}`);
                });
                // screen.logTestingPlaygroundURL();
            });
        })

        it('должна отображаться соответствующая надпись для товаров, которые находятся в корзине', async () => {
            const mockCart: CartState = {
                0: {
                    name: 'Product 1',
                    price: 100,
                    count: 2,
                },
                3: {
                    name: 'Product 4',
                    price: 400,
                    count: 3,
                }
            }
            jest.spyOn(CartApi.prototype, 'getState').mockReturnValue(mockCart);
            ExampleApi.prototype.getProducts = jest.fn().mockResolvedValue({ data: mockProducts });


            const {container} = renderApp(<Catalog/>);

            await waitFor(() => {
                screen.logTestingPlaygroundURL();
                // for(let index of Object.keys(mockCart)) {
                //     const card = screen.getAllByTestId(index)[1];
                //     expect(card).toHaveTextContent(/item in cart/i);
                // }
                Object.entries(mockProducts).forEach(([id, item], index) => {
                    const card = screen.getAllByTestId(id)[1];
                    
                    if (Object.keys(mockCart).includes(id)) {
                        expect(card).toHaveTextContent(/item in cart/i);
                    } else expect(card).not.toHaveTextContent(/item in cart/i);
                    // if()
                });
                // expect(container.querySelector('.ProductItem .CartBadge')).toBeInTheDocument();
            })
        })

    })

    // jest.mock('axios');
    // const mockedAxios = axios as jest.Mocked<typeof axios>;
    
    // let mockGetProducts: jest.Mock;
    
    // beforeEach(() => {
    //     mockGetProducts = jest.fn(); // Mock function for getProducts
        
    //     // Mock ExampleApi class
    //     jest.spyOn(ExampleApi.prototype, 'getProducts').mockImplementation(mockGetProducts);
    // });
})