




import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Welcome from './Pages/Welcome';




const App:React.FC = () => {


    return (
      <>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/welcome" element={<Welcome />}/>

        </Routes>

      </BrowserRouter>
      
      
      
      
      </>
    )
}
export default App;
