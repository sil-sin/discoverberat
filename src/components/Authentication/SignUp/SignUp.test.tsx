import { act, fireEvent, render, screen } from "@testing-library/react";
import { SignUp } from "./SignUp";
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

describe('SignUp component', () => {
    beforeEach(() => {
        // Reset the mock implementation before each test
        (useRouter as jest.Mock).mockClear();
    });

    it('should render from', () => {
        // Mock the useRouter hook to return dummy data
        (useRouter as jest.Mock).mockReturnValue({
            query: { callbackUrl: '/some/callback/url' },
        });

        render(<SignUp />);
        expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
    });
})