import { CartApi, ExampleApi } from "../../src/client/api";
import { CartState } from "../../src/common/types";
import { Catalog } from "../../src/client/pages/Catalog";
import { renderApp, basename } from "../utils";
import React from "react";
import { Application } from "../../src/client/Application";
import { findByText, fireEvent, getByText, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockCartApi } from "./mocks/CartApi";
import { initStore } from "../../src/client/store";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { Cart } from "../../src/client/pages/Cart";
import { time } from "console";
import userEvent from "@testing-library/user-event";


// jest.mock('../../src/client/api', () => {
//     const originalModule = jest.requireActual('../../src/client/api');

//     return{
//         ...originalModule,
//         // CartApi: jest.fn(() => new MockCartApi(mockCart)),
//         CartApi: jest.fn().mockImplementation(() => {
//             return {
//                 getState: jest.fn().mockReturnValue(mockCart),
//                 setState: jest.fn().mockImplementation(() => {}),
//             };
//         }),
//     }
// })

describe('Страница корзины', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ссылка "Cart" в навигации должна быть активной', () => {
        const { container } = renderApp(<Application />, [`${basename}/cart`]);
        const cartLink = screen.getAllByRole('link', { name: /cart/i })[0];

        // screen.logTestingPlaygroundURL();
        expect(cartLink).toBeInTheDocument();
        expect(cartLink).toHaveClass('active');
    })

    describe('Корзина с товарами', () => {
        
        describe('Непустая корзина с товарами', () => {
            const mockCart: CartState = {
                0: {
                    name: 'Product 1',
                    price: 100,
                    count: 2,
                },
                1: {
                    name: 'Product 2',
                    price: 200,
                    count: 1,
                },
                2: {
                    name: 'Product 3',
                    price: 300,
                    count: 3,
                }
            }

            beforeAll(() => {
                jest.spyOn(CartApi.prototype, 'getState').mockReturnValue(mockCart);
            })

            it('должен отображаться список добавленных позиций c корректными данными: название, цена, количество', () => {
                const { container } = renderApp(<Cart />);
                // screen.logTestingPlaygroundURL();

                Object.entries(mockCart).forEach(([id, item], index) => {
                    const row = screen.getByTestId(index);
                    expect(row).toBeInTheDocument();
        
                    const nameCell = row.querySelector(`.Cart-Name`);
                    const priceCell = row.querySelector(`.Cart-Price`);
                    const countCell = row.querySelector(`.Cart-Count`);
                    
                    expect(nameCell).toHaveTextContent(item.name);
                    expect(priceCell).toHaveTextContent(`$${item.price}`);
                    expect(countCell).toHaveTextContent(`${item.count}`);        
                });
        
                expect(container.querySelectorAll('[data-testid]').length).toBe(Object.keys(mockCart).length);
            })

            it('должна корректно рассчитываться итоговая стоимость для каждой позиций в корзине', () => {
                const { container } = renderApp(<Cart />);
                // screen.logTestingPlaygroundURL();

                Object.entries(mockCart).forEach(([id, item], index) => {
                    const row = screen.getByTestId(index);

                    const totalCell = row.querySelector(`.Cart-Total`);
                    
                    expect(totalCell).toHaveTextContent(`$${item.price * item.count}`);
        
                });
            });

            it('должна корректно рассчитываться итоговая стоимость всех позиций в корзине', () => {
                const { container } = renderApp(<Cart />);
                // screen.logTestingPlaygroundURL();
        
                expect(container.querySelector('.Cart-OrderPrice')).toHaveTextContent(`$${Object.values(mockCart).reduce((sum, item) => sum + item.price * item.count, 0)}`);
            });

            it('должна отображаться кнопка очистки корзины', () => {
                const { container } = renderApp(<Cart />);
                // screen.logTestingPlaygroundURL();

                const clearCartButton = screen.getByRole('button', { name: /clear shopping cart/i });

                expect(clearCartButton).toBeInTheDocument();
            });

            it('при клике на кнопку отчистки, в корзине не должно быть товаров', () => {
                jest.spyOn(CartApi.prototype, 'setState').mockImplementation(() => {});
                const { container } = renderApp(<Cart />);

                // screen.logTestingPlaygroundURL();

                const clearCartButton = screen.getByRole('button', { name: /clear shopping cart/i });
                fireEvent.click(clearCartButton);

                expect(container.querySelectorAll('[data-testid]').length).toBe(0);

                // screen.logTestingPlaygroundURL();
            })

            it('в навигационной панели рядом с разделом "Cart" должно отображаться количество товаров в корзине', () => {
                const { container } = renderApp(<Application />);
                const cartLink = screen.getByRole('link', { name: /cart/i });

                expect(cartLink).toBeInTheDocument();
                expect(cartLink).toHaveTextContent(`Cart (${Object.keys(mockCart).length})`);
            })
        })

        describe('Пустая корзина c товарами', () => {
            beforeAll(() => {
                jest.spyOn(CartApi.prototype, 'getState').mockReturnValue({});
            })

            it('должны отображаться сообщение о пустой корзине и ссылка на каталог', () => {
                const { container } = renderApp(<Cart />);
                screen.logTestingPlaygroundURL();

                expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
                const secondLink = screen.getByRole('link', { name: /catalog/i });
                expect(secondLink).toBeInTheDocument();
                expect(secondLink).toHaveAttribute('href', `${basename}/catalog`);
                expect(container.querySelectorAll('[data-testid]').length).toBe(0);
                expect(screen.queryByRole('button', { name: /clear shopping cart/i })).not.toBeInTheDocument();
            })

            it('в навигационной панели рядом с разделом "Cart" не должно отображаться количество товаров в корзине', () => {
                const { container } = renderApp(<Application />);
                const cartLink = screen.getByRole('link', { name: /cart/i });

                expect(cartLink).toBeInTheDocument();
                expect(cartLink.textContent).toBe(`Cart`);
            })
        })
    })

    describe('Форма оформления заказа', () => {
        const mockCart = {
            0: {
                name: 'Product 1',
                price: 100,
                count: 2,
            }
        }

        beforeAll(() => {
            ExampleApi.prototype.checkout = jest.fn().mockResolvedValue({ data: { id: 1 } });
        })


        it('должна отображаться, если корзина не пустая', () => {
            // check all inputs
            // jest.spyOn(CartApi.prototype, 'getState').mockReturnValue({
            //     0: {
            //         name: 'Product 1',
            //         price: 100,
            //         count: 2,
            //     },
            // });
            jest.spyOn(CartApi.prototype, 'getState').mockReturnValue(mockCart);
            const { container } = renderApp(<Cart />);

            screen.logTestingPlaygroundURL();
            
            expect(screen.getByRole('heading', { name: /сheckout/i })).toBeInTheDocument();
            expect(container.querySelector('.Form')).toBeInTheDocument();
            const inputName = container.querySelector('#f-name');
            expect(inputName).toBeInTheDocument();
            expect(inputName).toHaveValue('');
            const inputPhone = container.querySelector('#f-phone');
            expect(inputPhone).toBeInTheDocument();
            expect(inputPhone).toHaveValue('');
            const inputAddress = container.querySelector('#f-address');
            expect(inputAddress).toBeInTheDocument();
            expect(inputAddress).toHaveValue('');
        })

        it('не должна отображаться, если корзина пустая', () => {
            jest.spyOn(CartApi.prototype, 'getState').mockReturnValue({});
            const { container } = renderApp(<Cart />);

            screen.logTestingPlaygroundURL();
            
            expect(screen.queryByRole('heading', { name: /сheckout/i })).not.toBeInTheDocument();
            expect(container.querySelector('.Form')).not.toBeInTheDocument();
        })

        it('после успешной отправки должна выводить сообщение с номером заказа и очищать корзину', async () => {
            const mockOrderId = 1;
            jest.spyOn(CartApi.prototype, 'getState').mockReturnValue(mockCart);
            jest.spyOn(CartApi.prototype, 'setState').mockImplementation(() => {});
            const { container } = renderApp(<Cart />);

            screen.logTestingPlaygroundURL();

            const inputName = container.querySelector('#f-name');
            await userEvent.type(inputName as HTMLElement, 'Test User');
            
            const inputPhone = container.querySelector('#f-phone');
            await userEvent.type(inputPhone as HTMLElement, '88888888888');

            const inputAddress = container.querySelector('#f-address');
            await userEvent.type(inputAddress as HTMLElement, 'Test Address');

            const submitBtn = container.querySelector('.Form-Submit');
            await userEvent.click(submitBtn as HTMLElement);

            await waitFor(() => {
                expect(ExampleApi.prototype.checkout).toHaveBeenCalledTimes(1);
                expect(ExampleApi.prototype.checkout).toHaveBeenCalledWith({ name: 'Test User', phone: '88888888888', address: 'T' }, mockCart);
                expect(container.querySelector('.Cart-SuccessMessage')).toBeInTheDocument();
                expect(container.querySelector('.Cart-SuccessMessage')).toHaveTextContent(`${mockOrderId}`);
                expect(container.querySelectorAll('[data-testid]').length).toBe(0);

                screen.logTestingPlaygroundURL();
            });
        })
        it('должна проверять что имя пользователя не пустое', async () => {
            const { container } = renderApp(<Cart/>);
            const submit = screen.getByText('Checkout');
            await userEvent.click(submit);
    
            expect(ExampleApi.prototype.checkout).not.toHaveBeenCalled();
            expect(CartApi.prototype.setState).not.toHaveBeenCalled();
            expect(screen.getByText('Please provide your name')).toBeInTheDocument();
        })
        it('должна проверять что телефон пользователя валидный', async () => {
            const {container} = renderApp(<Cart/>);
    
            const inputPhone = container.querySelector('input#f-phone');
            await userEvent.type(inputPhone as HTMLElement, 'not valid phone');
            const submit = screen.getByText('Checkout');
            await userEvent.click(submit);
            
            expect(ExampleApi.prototype.checkout).not.toHaveBeenCalled();
            expect(CartApi.prototype.setState).not.toHaveBeenCalled();
            expect(screen.getByText('Please provide a valid phone')).toBeInTheDocument();
        })
        it('должна проверять что адрес пользователя не пустой', async () => {
            const { container } = renderApp(<Cart/>);
            const submit = screen.getByText('Checkout');
            await userEvent.click(submit);
    
            expect(ExampleApi.prototype.checkout).not.toHaveBeenCalled();
            expect(CartApi.prototype.setState).not.toHaveBeenCalled();
            expect(screen.getByText('Please provide a valid address')).toBeInTheDocument();
        })
    })
})

