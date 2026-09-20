import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <CustomerAuthProvider>
      <AppRoutes />
    </CustomerAuthProvider>
  );
}
