import { fireEvent, screen, waitFor } from "@testing-library/react";
import { ProductItem } from "../../../src/client/components/ProductItem";
import { Product, ProductShortInfo } from "../../../src/common/types";
import React from "react";
import { basename, renderApp } from "../../utils";
import '@testing-library/jest-dom';
import { ExampleApi } from "../../../src/client/api";
import { Application } from "../../../src/client/Application";

// describe('Карточка продукта', () => {

//     it('должен отображать информацию о продукте', () => {
//         const mockProduct: ProductShortInfo = {
//             id: 1,
//             name: 'Product 1',
//             price: 100,
//         };

//         const { container } = render(<ProductItem product={mockProduct} />);

//         expect(container).toMatchSnapshot();
//     })
// })

describe('ProductItem', () => {
    const mockProduct: ProductShortInfo = {
        id: 1,
        name: 'Product',
        price: 100,
    };
    
    
    beforeEach(() => {
        renderApp(<ProductItem product={mockProduct} />);
    })

    it('корректно отображает данные о товаре', () => {
        const productName = screen.getByText(mockProduct.name);
        const productPrice = screen.getByText(`$${mockProduct.price}`);
    
        expect(productName).toBeInTheDocument();
        expect(productPrice).toBeInTheDocument();
    });
    
    it('отображает ссылку на страницу товара', () => {
        const detailsLink = screen.getByRole('link', { name: /details/i });
        expect(detailsLink).toHaveAttribute('href', `${basename}/catalog/${mockProduct.id}`);
    });
    
    // it('Details link opens product details page', () => {
    //     const detailsLink = screen.getByRole('link', { name: /details/i });
    //     fireEvent.click(detailsLink);

    //     expect(detailsLink).toHaveAttribute('href', `${basename}/catalog/${mockProduct.id}`);
    // });

    // it('renders CartBadge with correct product id', () => {
    //     const cartBadge = screen.getByTestId(`cart-badge-${mockProduct.id}`);
    //     expect(cartBadge).toBeInTheDocument();
    // });

});

describe('ProductItem & Product', () => {
    it('при клике на ссылку должна открываться страница продукта с корректными данными', async () => {
        const mockProductDetails: Product = {
            id: 1,
            name: 'Product',
            price: 100,
            description: 'comfortable product',
            material: 'cotton',
            color: 'lavender',
        };

        // ExampleApi.prototype.getProducts = jest.fn().mockResolvedValue({ data: [mockProduct] });
        // ExampleApi.prototype.getProductById = jest.fn().mockResolvedValue({ data: mockProductDetails });

        // const { container, getByText, getAllByTestId } = renderApp(<Application />, [basename + '/catalog']);

        // waitFor(() => {
        //     screen.logTestingPlaygroundURL();
        // })

        const mockProducts: ProductShortInfo[] = [
            { id: 1, name: 'Product', price: 100 },
        ];

        ExampleApi.prototype.getProducts = jest.fn().mockResolvedValue({ data: mockProducts });
        ExampleApi.prototype.getProductById = jest.fn().mockResolvedValue({ data: mockProductDetails });
        const { container, getByText, getAllByTestId } = renderApp(<Application />, [basename + '/catalog']);
        expect(ExampleApi.prototype.getProducts).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            const detailsLink = screen.getByRole('link', { name: /details/i });
            expect(detailsLink).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('link', { name: /details/i }));

        await waitFor(() => {
            expect(ExampleApi.prototype.getProductById).toHaveBeenCalledWith(mockProductDetails.id);
            expect(ExampleApi.prototype.getProductById).toHaveBeenCalledTimes(1);

            expect(getByText(mockProductDetails.name)).toBeInTheDocument();
            expect(getByText(`$${mockProductDetails.price}`)).toBeInTheDocument();
            expect(getByText(mockProductDetails.description)).toBeInTheDocument();
            expect(getByText(mockProductDetails.color)).toBeInTheDocument();
            expect(getByText(mockProductDetails.material)).toBeInTheDocument();
        }); 

        screen.logTestingPlaygroundURL();
        
    })
})




