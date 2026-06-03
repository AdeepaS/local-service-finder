import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AnimatePresence mode="wait">
      <AppRoutes />
      <Toaster position="bottom-right" />
    </AnimatePresence>
  );
}

export default App;
