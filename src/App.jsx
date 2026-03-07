import AppRoutes from "./routes/AppRoutes";
import AuthInitializer from "./components/AuthInitializer";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthInitializer>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border-theme)',
            borderRadius: '1rem',
            padding: '1rem',
            fontSize: '14px',
            fontWeight: '600'
          },
          success: {
            iconTheme: {
              primary: '#FF7A00',
              secondary: '#FFF',
            },
          },
        }}
      />
    </AuthInitializer>
  );
}

export default App;