import '@testing-library/jest-dom';
import React from "react";
import { basename, renderApp } from "../utils";
import { Application } from "../../src/client/Application";
import { screen } from '@testing-library/react';

describe('Страница контактов', () => {
    it('должна иметь статическое содержание', () => {
        const {container} = renderApp(<Application/>, [`${basename}/contacts`]);

        expect(container).toMatchSnapshot('Страница контактов');
    })

    it('ссылка "Contacts" в навигации должна быть активной', () => {
        const { container } = renderApp(<Application />, [`${basename}/contacts`]);
        const link = screen.getAllByRole('link', { name: /contacts/i })[0];

        // screen.logTestingPlaygroundURL();
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass('active');
    })
})