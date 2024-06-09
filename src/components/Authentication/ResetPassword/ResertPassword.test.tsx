import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ResetPassword } from './ResetPassword';

describe('ResetPassword', () => {
    test('renders without crashing', () => {
        render(<ResetPassword onSubmit={() => { }} onChange={() => { }} />);
    });

    test('displays the correct title', () => {
        const { getByText } = render(<ResetPassword onSubmit={() => { }} onChange={() => { }} />);
        expect(screen.getAllByText('Reset Password')[0]).toBeInTheDocument();
    });


    it('calls the onChange function when the email input value changes', () => {
        const onChange = jest.fn();
        const { getByPlaceholderText } = render(<ResetPassword onSubmit={() => { }} onChange={onChange} />);
        const emailInput = getByPlaceholderText('Email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            target: expect.objectContaining({
                value: 'test@example.com'
            })
        }));
    });

    it('calls the onSubmit function when the "Reset Password" button is clicked', () => {
        const onSubmit = jest.fn();
        render(<ResetPassword onSubmit={onSubmit} onChange={() => { }} />);
        const resetPasswordButton: any = screen.getByTitle('button');
        fireEvent.click(resetPasswordButton);
        expect(onSubmit).toHaveBeenCalled();
    });
});