import { render, screen } from "@testing-library/react";
import LeadForm from "@/components/lead-form";
import { Provider } from "react-redux";
import { store } from "@/store/store";

// Mock DOM APIs needed for Radix UI
beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn();
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe("LeadForm", () => {
  const renderForm = () => {
    render(
      <Provider store={store}>
        <LeadForm />
      </Provider>
    );
  };

  it("renders all form fields correctly", () => {
    renderForm();

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("LinkedIn /Personal Website URL")
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
