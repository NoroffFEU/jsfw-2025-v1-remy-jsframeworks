import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from './ContactPage';

describe('ContactPage', () => {
  it('renders all input fields', () => {
    render(<ContactPage />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<ContactPage />);

    const submitBtn = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitBtn);

    // These messages are taken from the actual DOM in the error output
    expect(
      await screen.findByText(/full name is required\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/email is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/subject is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/message is required\./i)).toBeInTheDocument();

    // The general "fix errors" message at the bottom
    expect(
      screen.getByText(/please fix the errors above before submitting/i)
    ).toBeInTheDocument();
  });

  it('submits successfully with valid data', async () => {
    render(<ContactPage />);

    const fullName = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const email = screen.getByLabelText(/email/i) as HTMLInputElement;
    const subject = screen.getByLabelText(/subject/i) as HTMLInputElement;
    const message = screen.getByLabelText(/message/i) as HTMLTextAreaElement;
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    await userEvent.type(fullName, 'John Doe');
    await userEvent.type(email, 'john@example.com');
    await userEvent.type(subject, 'Hello');
    await userEvent.type(message, 'This is a test message.');

    await userEvent.click(submitBtn);

    // onSubmit waits with setTimeout – just wait until the form resets.
    await waitFor(() => {
      expect(fullName.value).toBe('');
      expect(email.value).toBe('');
      expect(subject.value).toBe('');
      expect(message.value).toBe('');
    });

    // No error messages should be present
    expect(
      screen.queryByText(/please fix the errors above before submitting/i)
    ).not.toBeInTheDocument();
  });
});