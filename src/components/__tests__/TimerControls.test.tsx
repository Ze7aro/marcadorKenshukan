import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimerControls } from "../TimerControls";
import { describe, it, expect, vi } from "vitest";

describe("TimerControls Component", () => {
    const defaultProps = {
        selectedTime: 180,
        isRunning: false,
        hasWinner: false,
        onSelectTime: vi.fn(),
        onStart: vi.fn(),
        onStop: vi.fn(),
        onReset: vi.fn(),
    };

    it("should render time selection buttons", () => {
        render(<TimerControls {...defaultProps} />);
        expect(screen.getByText("3:00")).toBeInTheDocument();
    });

    it("should call onSelectTime when a time button is clicked", async () => {
        const user = userEvent.setup();
        render(<TimerControls {...defaultProps} />);
        const button3min = screen.getByText("3:00");
        await user.click(button3min);
        expect(defaultProps.onSelectTime).toHaveBeenCalledWith(180);
    });

    it("should show 'Iniciar' when not running", () => {
        render(<TimerControls {...defaultProps} />);
        expect(screen.getByText("Iniciar")).toBeInTheDocument();
    });

    it("should show 'Reanudar' when running is true", () => {
        render(<TimerControls {...defaultProps} isRunning={true} />);
        expect(screen.getByText("Reanudar")).toBeInTheDocument();
    });

    it("should disable buttons when hasWinner is true", () => {
        render(<TimerControls {...defaultProps} hasWinner={true} />);
        const startButton = screen.getByText("Iniciar");
        expect(startButton).toBeDisabled();
        expect(screen.getByText("3:00")).toBeDisabled();
    });

    it("should call control handlers", async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TimerControls {...defaultProps} />);

        await user.click(screen.getByText("Iniciar"));
        expect(defaultProps.onStart).toHaveBeenCalled();

        // Rerender with running to enable Stop button
        rerender(<TimerControls {...defaultProps} isRunning={true} />);

        const stopButton = screen.getByText("Detener");
        expect(stopButton).not.toBeDisabled();

        await user.click(stopButton);
        expect(defaultProps.onStop).toHaveBeenCalled();
    });
});
