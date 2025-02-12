import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
