import { ReactNode } from "react";
import { CartApi, ExampleApi } from "../src/client/api";
import { initStore } from "../src/client/store";
import React from "react";
import { Provider } from 'react-redux';
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export const basename = '/hw/store';

const pages = [
    { route: '/', name: 'Home' },
    { route: '/catalog', name: 'Catalog' },
    { route: '/catalog/1', name: 'Product' },
    { route: '/delivery', name: 'Delivery' },
    { route: '/contacts', name: 'Contacts' },
    { route: '/cart', name: 'Cart' },
];


export const renderApp = (component: ReactNode, initialEntries: string[] = [basename]) => {
    const api = new ExampleApi(basename);
    const cartApi = new CartApi();
    const store = initStore(api, cartApi);
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={initialEntries} basename={basename} >
                {component}
            </MemoryRouter>
        </Provider>,
    )
};