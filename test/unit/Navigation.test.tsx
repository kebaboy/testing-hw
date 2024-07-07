import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from "react";
import { Application } from "../../src/client/Application";
import '@testing-library/jest-dom';
import { basename, renderApp } from "../utils";
import { wait } from '@testing-library/user-event/dist/cjs/utils/index.js';
import { ExampleApi } from '../../src/client/api';
// import { CartApi } from '../../src/client/api';

describe('Функциональность навигационной панели', () => { 
    beforeEach(() => {
        const { container } = renderApp(<Application />);
        // screen.logTestingPlaygroundURL();
    });

    // it('название магазина является ссылкой на главную страницу', async () => {
    //     expect(screen.getByText('Kogtetochka store')).toHaveAttribute('href', basename);
    // })

    it('отображаются ссылки на каталог, условия доставки, контакты, корзину и главную страницу', () => {
        expect(screen.getByText('Kogtetochka store')).toBeInTheDocument();
        expect(screen.getByText('Kogtetochka store')).toHaveAttribute('href', basename);

        expect(screen.getByRole('link', { name: /catalog/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /catalog/i })).toHaveAttribute('href', `${basename}/catalog`);

        expect(screen.getByRole('link', { name: /delivery/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /delivery/i })).toHaveAttribute('href', `${basename}/delivery`);

        expect(screen.getByRole('link', { name: /contacts/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /contacts/i })).toHaveAttribute('href', `${basename}/contacts`);

        expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /cart/i })).toHaveAttribute('href', `${basename}/cart`);

    });

    it('при клике на ссылку "Kogtetochka store" должен переходить на главную страницу', async () => {
        const mainLink = screen.getByText('Kogtetochka store');
        
        fireEvent.click(mainLink);

        await waitFor(() => {
            expect(screen.getByText(/welcome/i)).toBeInTheDocument();
        })
        // expect(await screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    // change initial entries
    it('при клике на ссылку "Catalog" должен переходить на страницу каталога', async () => {
        ExampleApi.prototype.getProducts = jest.fn().mockResolvedValue({ data: [] });

        const catalogLink = screen.getByText('Catalog');
        
        fireEvent.click(catalogLink);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /catalog/i })).toBeInTheDocument();
        })
        // expect(await screen.findByRole('heading', { name: /catalog/i })).toBeInTheDocument();
    });

    it('при клике на ссылку "Delivery" должен переходить на страницу условий доставки', async () => {
        const deliveryLink = screen.getByText('Delivery');
        
        fireEvent.click(deliveryLink);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /delivery/i })).toBeInTheDocument();
        })
        // expect(await screen.findByRole('heading', { name: /delivery/i })).toBeInTheDocument();
    });

    it('при клике на ссылку "Contacts" должен переходить на страницу условий контактов', async () => {
        const contactsLink = screen.getByText('Contacts');
        
        fireEvent.click(contactsLink);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /contacts/i })).toBeInTheDocument();
        })

        // expect(await screen.findByRole('heading', { name: /contacts/i })).toBeInTheDocument();
    });

    it('при клике на ссылку "Cart" должен переходить на страницу корзины', async () => {
        const cartLink = screen.getByText('Cart');
        
        fireEvent.click(cartLink);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /cart/i })).toBeInTheDocument();
        })

        // expect(await screen.findByRole('heading', { name: /cart/i })).toBeInTheDocument();
    });

    it('навигационная ссылка становится активной при клике', async () => {
        const catalogLink = screen.getByText('Catalog');
        const deliveryLink = screen.getByText('Delivery');
        const contactsLink = screen.getByText('Contacts');
        const cartLink = screen.getByText('Cart');
    
        expect(catalogLink).not.toHaveClass('active');
        expect(deliveryLink).not.toHaveClass('active');
        expect(contactsLink).not.toHaveClass('active');
        expect(cartLink).not.toHaveClass('active');

        fireEvent.click(catalogLink);

        await waitFor(() => {
            expect(catalogLink).toHaveClass('active');
            expect(deliveryLink).not.toHaveClass('active');
            expect(contactsLink).not.toHaveClass('active');
            expect(cartLink).not.toHaveClass('active');
        })

        fireEvent.click(deliveryLink);
    
        await waitFor(() => {
            expect(deliveryLink).toHaveClass('active');
            expect(catalogLink).not.toHaveClass('active');
            expect(contactsLink).not.toHaveClass('active');
            expect(cartLink).not.toHaveClass('active');
        })
    
        fireEvent.click(contactsLink);
    
        await waitFor(() => {
            expect(contactsLink).toHaveClass('active');
            expect(catalogLink).not.toHaveClass('active');
            expect(deliveryLink).not.toHaveClass('active');
            expect(cartLink).not.toHaveClass('active');
        })
    
        fireEvent.click(cartLink);
    
        await waitFor(() => {
            expect(cartLink).toHaveClass('active');
            expect(catalogLink).not.toHaveClass('active');
            expect(deliveryLink).not.toHaveClass('active');
            expect(contactsLink).not.toHaveClass('active');
        })
    });
})

// anywhere
