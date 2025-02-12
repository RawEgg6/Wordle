import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './home';
import Auth from './auth/auth';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Auth/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
