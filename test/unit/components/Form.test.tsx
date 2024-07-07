import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Form, FormProps } from '../../../src/client/components/Form';
import '@testing-library/jest-dom'

describe('Form Component', () => {
    const mockSubmit = jest.fn();

    const setup = (props: Partial<FormProps> = {}) => {
        const utils = render(<Form onSubmit={mockSubmit} {...props} />);
        const nameInput = utils.getByLabelText('Name') as HTMLInputElement;
        const phoneInput = utils.getByLabelText('Phone') as HTMLInputElement;
        const addressInput = utils.getByLabelText('Address') as HTMLTextAreaElement;
        const submitButton = utils.getByText('Checkout') as HTMLButtonElement;

        return {
            ...utils,
            nameInput,
            phoneInput,
            addressInput,
            submitButton,
        };
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('отображается с начальным состоянием', () => {
        const { nameInput, phoneInput, addressInput, submitButton } = setup();

        expect(nameInput).toBeInTheDocument();
        expect(phoneInput).toBeInTheDocument();
        expect(addressInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();

        expect(submitButton).not.toBeDisabled();
    });

    it('валидирует введенные значения и показывает ошибки', () => {
        const { nameInput, phoneInput, addressInput, submitButton } = setup();

        
        fireEvent.change(nameInput, { target: { value: '' } });
        fireEvent.change(phoneInput, { target: { value: '12345' } });
        fireEvent.change(addressInput, { target: { value: '' } });

        fireEvent.click(submitButton); 

        expect(nameInput).toHaveClass('is-invalid'); 
        expect(phoneInput).toHaveClass('is-invalid');
        expect(addressInput).toHaveClass('is-invalid');

        
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
        fireEvent.change(addressInput, { target: { value: '123 Street' } });

        fireEvent.click(submitButton); 

        expect(nameInput).not.toHaveClass('is-invalid'); 
        expect(phoneInput).not.toHaveClass('is-invalid');
        expect(addressInput).not.toHaveClass('is-invalid');
    });

    it('отправляет введенные данные если они валидны', () => {
        const { nameInput, phoneInput, addressInput, submitButton } = setup();

        
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
        fireEvent.change(addressInput, { target: { value: '123 Street' } });

        fireEvent.click(submitButton); 

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        expect(mockSubmit).toHaveBeenCalledWith({
            name: 'John Doe',
            phone: '123-456-7890',
            address: '123 Street',
        });
    });
});
