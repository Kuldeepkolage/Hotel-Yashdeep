import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { CMSProvider } from "./context/CMSContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <CMSProvider>
      <CustomerAuthProvider>
        <AppRoutes />
      </CustomerAuthProvider>
    </CMSProvider>
  );
}
