"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}
