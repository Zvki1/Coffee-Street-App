
import { BrowserRouter, Route, Routes } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Home from './Pages/Home/Home';

function App() {

  return (
    <>

      <BrowserRouter>

        {/* navbar   */}
        <Navbar/>

        <Routes>
          <Route path='/' element={<Home/>} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
