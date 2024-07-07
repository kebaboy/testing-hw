import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Application } from '../../src/client/Application';
import { ApplicationState, initStore } from '../../src/client/store';
import { CartApi, ExampleApi } from '../../src/client/api';
import { renderApp } from '../utils';
import '@testing-library/jest-dom'

jest.mock('../../src/client/pages/Home', () => ({
    Home: () => <div>Home Page</div>,
}));
jest.mock('../../src/client/pages/Catalog', () => ({
    Catalog: () => <div>Catalog Page</div>,
}));
jest.mock('../../src/client/pages/Product', () => ({
    Product: () => <div>Product Page</div>,
}));
jest.mock('../../src/client/pages/Delivery', () => ({
    Delivery: () => <div>Delivery Page</div>,
}));
jest.mock('../../src/client/pages/Contacts', () => ({
    Contacts: () => <div>Contacts Page</div>,
}));
jest.mock('../../src/client/pages/Cart', () => ({
    Cart: () => <div>Cart Page</div>,
}));


describe('Router', () => {
    it('отображает главную страницу и переходит к остальным страницам', () => {
        renderApp(<Application />);

        expect(screen.getByText('Home Page')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Catalog'));
        expect(screen.getByText('Catalog Page')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Delivery'));
        expect(screen.getByText('Delivery Page')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Contacts'));
        expect(screen.getByText('Contacts Page')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cart'));
        expect(screen.getByText('Cart Page')).toBeInTheDocument();
    });
});