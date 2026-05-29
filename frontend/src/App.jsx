import { AnimatePresence } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AnimatePresence mode="wait">
      <AppRoutes />
    </AnimatePresence>
  );
}

export default App;
