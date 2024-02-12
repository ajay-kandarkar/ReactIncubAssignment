import './App.css';
import PatientScreen from './Componenets/PatientScreen';
import { Route,Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PatientInfo from './Componenets/Patientinfo';
function App() {
  return (
    <>
         <ToastContainer/>
     <Routes>
      <Route path="/patientScreen" element={<PatientScreen/>}></Route>
        <Route path="/" element={ <PatientInfo/>}></Route>
      </Routes> 
    </>
  );
}

export default App;
