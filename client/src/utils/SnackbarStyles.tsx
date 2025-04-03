import React, { forwardRef } from "react";
import { SnackbarKey, SnackbarMessage, SnackbarProvider } from "notistack";

// Custom Snackbar Component
interface CustomSnackbarProps {
    message: string | React.ReactNode;
}

const CustomSnackbar = forwardRef<HTMLDivElement, CustomSnackbarProps>(
    ({ message }, ref) => {
        return (
            <div
                ref={ref} // Forwarding the ref to the root element
                style={{
                    backgroundColor: "#161D29", // Custom blue color
                    color: "#fff",
                    padding: "12px",
                    borderRadius: "2px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                {message}
            </div>
        );
    }
);

// Props for CustomSnackbarProvider
interface CustomSnackbarProviderProps {
    children: React.ReactNode;
}

const CustomSnackbarProvider: React.FC<CustomSnackbarProviderProps> = ({ children }) => {
    return (
        <SnackbarProvider
            maxSnack={1}
            content={(key: SnackbarKey, message?: SnackbarMessage) => (
                <CustomSnackbar message={message || ""} />
            )}
        >
            {children}
        </SnackbarProvider>
    );
};

export default CustomSnackbarProvider;
