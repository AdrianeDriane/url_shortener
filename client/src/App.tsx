import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { AppRouter } from "./router";

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
