import { act, fireEvent, render, screen } from "@testing-library/react";
import { SignIn } from "./SignIn";
import React from "react";
import { useRouter } from "next/navigation";

// Import Firebase initialization
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "@/utils/firebase/firebaseConfig";


// Initialize Firebase
initializeApp(firebaseConfig);

// Mock the useRouter hook
// next/jest does not load .env.local in tests, so the real getAuth fails without an API key
jest.mock('firebase/auth', () => ({
    ...jest.requireActual('firebase/auth'),
    getAuth: jest.fn(() => ({})),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: () => new URLSearchParams('callbackUrl=/some/callback/url'),
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
