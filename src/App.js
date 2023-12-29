import './App.css';
import Patientinfo from './Componenets/Patientinfo';
import Patientscreen from './Componenets/Patientscreen';
import { Route,Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
function App() {
  return (
    <>
         <ToastContainer/>
     <Routes>
      <Route path="/patientScreen" element={<Patientscreen/>}></Route>
        <Route path="/" element={<Patientinfo/>}></Route>
      </Routes> 

    </>
  );
}

export default App;
