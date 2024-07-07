// check cur url

import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Home } from "../../src/client/pages/Home";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { basename, renderApp } from "../utils";
import { Application } from "../../src/client/Application";

describe('Страница условий доставки', () => {
    it('должна иметь статическое содержание', () => {
        const {container} = renderApp(<Application/>, [`${basename}/delivery`]);

        expect(container).toMatchSnapshot('Страница условий доставки');
    })

    it('ссылка "Delivery" в навигации должна быть активной', () => {
        const { container } = renderApp(<Application />, [`${basename}/delivery`]);
        const link = screen.getAllByRole('link', { name: /delivery/i })[0];

        // screen.logTestingPlaygroundURL();
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass('active');
    })
})