import { useState } from 'react';
import './App.css';
import Decrypt from './Pages/Decrypt';

function App() {
  const [credentials, setCredentials] = useState(localStorage.getItem("credentials"))

  return (
    <Decrypt></Decrypt>
  )
}

export default App;
