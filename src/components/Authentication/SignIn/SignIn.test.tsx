import { act, fireEvent, render, screen } from "@testing-library/react";
import { SignIn } from "./SignIn";
import React from "react";
import { useRouter } from "next/router";

// Import Firebase initialization
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "@/utils/firebase/firebaseConfig";


// Initialize Firebase
initializeApp(firebaseConfig);

// Mock the useRouter hook
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('SignIn component', () => {
    beforeEach(() => {
        // Reset the mock implementation before each test
        (useRouter as jest.Mock).mockClear();
    });

    it('should render', () => {
        // Mock the useRouter hook to return dummy data
        (useRouter as jest.Mock).mockReturnValue({
            query: { callbackUrl: '/some/callback/url' },
        });

        render(<SignIn />);
        expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    });

    //TODO :it('should render error when Submit button clicked with empty fields', () => {
    //     (useRouter as jest.Mock).mockReturnValue({
    //         query: { callbackUrl: '/some/callback/url' },
    //     });

    //     render(<SignIn />);

    //     act(() => {

    //         //click button action 
    //         const button: any = screen.getByRole('button')

    //         fireEvent.click(button)
    //     })
        
    //     expect(screen.getByTestId('sign-in-error')).toBeInTheDocument()

    // })
});
