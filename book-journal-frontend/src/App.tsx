import './App.css';
import { AppLayout } from './components/AppLayout';
import { BookProvider } from './context/BookContext';

function App() {
  return (
    <BookProvider>
      <AppLayout />
    </BookProvider>
  );
}

export default App;
