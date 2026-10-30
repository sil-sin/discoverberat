import { act, fireEvent, render, screen } from "@testing-library/react";
import { ContactForm } from "./ContactForm";
import React from "react";
import { useRouter } from "next/navigation";

// Import Firebase initialization
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "@/lib/firebase/client";


// Initialize Firebase
initializeApp(firebaseConfig);

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/app/contact/actions', () => ({ sendContactMessage: jest.fn() }));

describe('ContactForm component', () => {
    beforeEach(() => {
        // Reset the mock implementation before each test
        (useRouter as jest.Mock).mockClear();
    });

    it('should render', () => {
        // Mock the useRouter hook to return dummy data
        (useRouter as jest.Mock).mockReturnValue({
            query: { callbackUrl: '/some/callback/url' },
        });

        render(<ContactForm />);
        expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    });

})