import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormField from "./FormField";

describe("FormField", () => {
  it("should render default input with label connected to input id", () => {
    render(<FormField id="email-field" label="Email Address" />);
    const input = screen.getByLabelText("Email Address");
    expect(input).toBeInTheDocument();
    expect(input.id).toBe("email-field");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("should render hint when hint prop is passed", () => {
    render(<FormField id="field-hint" label="Test Field" hint="This is a helpful hint" />);
    const hint = screen.getByText("This is a helpful hint");
    expect(hint).toBeInTheDocument();
    expect(hint.id).toBe("field-hint-hint");
    const input = screen.getByLabelText("Test Field");
    expect(input).toHaveAttribute("aria-describedby", "field-hint-hint");
  });

  it("should render error message and red border when error prop is passed", () => {
    render(<FormField id="field-err" label="Username" error="Username is required" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Username is required");
    expect(alert.id).toBe("field-err-error");
    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "field-err-error");
    expect(input).toHaveClass("border-red-600");
  });

  it("should link both error and hint in aria-describedby", () => {
    render(
      <FormField
        id="field-both"
        label="Password"
        hint="Min 6 chars"
        error="Too short"
      />
    );
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("aria-describedby", "field-both-error field-both-hint");
  });

  it("should support custom component and children", () => {
    render(
      <FormField id="select-field" label="Options" as="select" className="custom-select">
        <option value="1">Option 1</option>
      </FormField>
    );
    const select = screen.getByLabelText("Options");
    expect(select.tagName.toLowerCase()).toBe("select");
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(select).toHaveClass("custom-select");
  });
});
