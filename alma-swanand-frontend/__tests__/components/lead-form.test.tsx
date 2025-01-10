import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeadForm from "@/components/lead-form";
import { Provider } from "react-redux";
import { store } from "@/store/store";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify({ id: "123" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  )
) as jest.Mock;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("LeadForm", () => {
  const renderForm = () => {
    render(
      <Provider store={store}>
        <LeadForm />
      </Provider>
    );
  };

  it("validates email format", async () => {
    const user = userEvent.setup();
    renderForm();

    // Fill required fields to trigger validation
    await user.type(screen.getByLabelText(/First Name/i), "John");
    await user.type(screen.getByLabelText(/Last Name/i), "Doe");
    await user.type(screen.getByLabelText(/Email/i), "invalid");
    await user.type(
      screen.getByLabelText(/LinkedIn Profile/i),
      "https://linkedin.com/in/john"
    );
    await user.type(
      screen.getByLabelText(/How can we help you\?/i),
      "Test message content here"
    );

    await user.click(screen.getByRole("button", { name: /Submit/i }));

    await screen.findByText("Invalid email address");
  });

  it("validates LinkedIn URL format", async () => {
    const user = userEvent.setup();
    renderForm();

    // Fill required fields to trigger validation
    await user.type(screen.getByLabelText(/First Name/i), "John");
    await user.type(screen.getByLabelText(/Last Name/i), "Doe");
    await user.type(screen.getByLabelText(/Email/i), "john@example.com");
    await user.type(screen.getByLabelText(/LinkedIn Profile/i), "invalid-url");
    await user.type(
      screen.getByLabelText(/How can we help you\?/i),
      "Test message content here"
    );

    await user.click(screen.getByRole("button", { name: /Submit/i }));

    await screen.findByText("Invalid LinkedIn URL");
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();

    // Define fetch mock before rendering component
    const mockFetch = jest.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ id: "123" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    window.fetch = mockFetch;

    renderForm();

    // Fill all required fields with valid data
    await user.type(screen.getByLabelText(/First Name/i), "John");
    await user.type(screen.getByLabelText(/Last Name/i), "Doe");
    await user.type(screen.getByLabelText(/Email/i), "john@example.com");
    await user.type(
      screen.getByLabelText(/LinkedIn Profile/i),
      "https://linkedin.com/in/johndoe"
    );

    // Select country
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("United States"));

    // Select visa type
    await user.click(screen.getByLabelText("O-1"));

    await user.type(
      screen.getByLabelText(/How can we help you\?/i),
      "Test message content here"
    );

    // Submit form
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitButton);

    // Verify fetch was called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/submit-lead",
        expect.any(Object)
      );
    });
  });
});
