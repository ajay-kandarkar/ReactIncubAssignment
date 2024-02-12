import './App.css';
import PatientInfo from './Componenets/PatientInfo';
import PatientScreen from './Componenets/PatientScreen';
import { Route,Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <>
         <ToastContainer/>
     <Routes>
      <Route path="/patientScreen" element={<PatientScreen/>}></Route>
        <Route path="/" element={<PatientInfo/>}></Route>
      </Routes> 
    </>
  );
}

export default App;
