import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
function Patientinfo() {
    const [patientDetails, setPatientDetails] = useState([]);
    const [currentPatientId, setCurrentPatientId] = useState(null);
    const [searchPatient, setsearchPatient] = useState("");
    const [order, setOrder] = useState("Asc");
    const [patientInfo, setPatientInfo] = useState({
        name: "",
        email: "",
        DOB: "",
        gender: "",
        address: "",
        note: "",
        mobile_No: "",
        countryId: "",
        doctorId:"",
        isCheck: 1,
    });
    useEffect(() => {
        axios.get('http://localhost:8080/get-allpatient-details')
            .then((response) => {
                console.log('Data of get-patient', response.data);
                setPatientDetails(response.data);
            })
            .catch((error) => {
                console.error('error to get patientDetails', error);
            });
    }, []);
    const patientDetailsEdit = (index) => {
        setCurrentPatientId(patientDetails[index].Id);
        setPatientInfo({
            name: patientDetails[index].Name,
            email: patientDetails[index].Email,
            gender: patientDetails[index].Gender,
            countryId: patientDetails[index].CountryId,
            doctorId:patientDetails[index].CountryId,
            DOB: patientDetails[index].DOB,
            address: patientDetails[index].Address,
            note: patientDetails[index].Note,
            mobile_No: patientDetails[index].Mobile_No,
            isCheck:patientDetails[index].IsCheck
        });
    };
    const updatePatient = () => {
            const updatedPatientDetails = [...patientDetails];
            const existingPatient = updatedPatientDetails[currentPatientId];
            const updatedPatient = {
                ...existingPatient,
                Name: patientInfo?.name,
                Email: patientInfo?.email,
                DoctorId:patientInfo?.doctorId,
                Gender: patientInfo?.gender,
                CountryId: patientInfo.countryId,
                DOB: patientInfo.DOB,
                Address: patientInfo.address,
                Note: patientInfo.note,
                Mobile_No: patientInfo.mobile_No,
                IsCheck:patientInfo.isCheck,
            };
            axios.put(`http://localhost:8080/update-patient-details/${currentPatientId}`, updatedPatient)
                .then(response => {
                    window.location.reload();
                    toast.success("Successfully updated patient information", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    updatedPatientDetails[currentPatientId] = response.data;
                    setPatientDetails(updatedPatientDetails);
                })
                .catch(error => {
                    console.error('Error updating patient:', error);
                    toast.error("Failed to update patient. Please try again.", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                });
    };
    const PatientDetailsDelete = (patientId) => {
        setCurrentPatientId(patientId);
    };
    const confirmDelete = () => {
            const idToDeleted = currentPatientId;
            axios.delete(`http://localhost:8080/delete-patient/${idToDeleted}`)
                .then(() => {
                    const updatedPatientDetails = patientDetails.filter(
                        (_, patientId) => patientId !== idToDeleted
                    );
                    setPatientDetails(updatedPatientDetails);
                    window.location.reload();
                    handleCloseDeleteConfirmation();
                    toast.error("Patient Deleted  Successfully!!!", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                })
                .catch((error) => {
                    console.error('Error deleting patient:', error);
                    toast.error("Failed to delete patient. Please try again.", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                });
    };
    const navigate = useNavigate();
    const handleCloseDeleteConfirmation = () => {
        setCurrentPatientId(null);
    };
    const sorting = (patienetCol) => {
        const sortedData = [...patientDetails].sort((a, b) =>
            order === 'Asc' ? (a[patienetCol] > b[patienetCol] ? 1 : -1) : (a[patienetCol] < b[patienetCol] ? 1 : -1)
        );
        setPatientDetails(sortedData);
        setOrder(order === 'Asc' ? 'Dsc' : 'Asc');
    };
    return (
        <div>
            <div className="container my-5">
                <div>
                    <div className="col-sm-12">
                        <div className='d-flex justify-content-end'>
                            <div className='input-group w-25'>
                                <input class="form-control w-25" type="search" placeholder="Search" aria-label="Search"
                                    onChange={(e) => setsearchPatient(e.target.value)}></input>
                                <button class="btn btn-success me-1" type="submit">Search</button>
                            </div>
                            <div>
                                <button
                                    className="btn btn-success float-end text-center"
                                    onClick={() => { navigate("/patientScreen") }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className='d-inline-block'>Patient screen</h4>
                        </div>
                    </div>
                    <div className='col-sm-12 table-responsive'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className='cursor-pointer pointer' onClick={() => sorting("name")}>
                                        Name
                                        {order === 'Asc' ? <i className="fas fa-sort-up" style={{ marginLeft: '5px' }}></i> : <i className="fas fa-sort-down" style={{ marginLeft: '5px' }}></i>}
                                    </th>
                                    <th className='cursor-pointer pointer' onClick={() => sorting("email")}>
                                        Email
                                        {order === 'Asc' ? <i className="fas fa-sort-up" style={{ marginLeft: '5px' }}></i> : <i className="fas fa-sort-down" style={{ marginLeft: '5px' }}></i>}
                                    </th>
                                    <th className='cursor-pointer pointer' onClick={() => sorting("gender")}>
                                        Gender
                                        {order === 'Asc' ? <i className="fas fa-sort-up" style={{ marginLeft: '5px' }}></i> : <i className="fas fa-sort-down" style={{ marginLeft: '5px' }}></i>}
                                    </th>
                                    <th className='cursor-pointer pointer' onClick={() => sorting("mobile_No")}>Mobile No
                                        {order === 'Asc' ? <i className="fas fa-sort-up" style={{ marginLeft: '5px' }}></i> : <i className="fas fa-sort-down" style={{ marginLeft: '5px' }}></i>}
                                    </th>
                                    <th className='cursor-pointer pointer' onClick={() => sorting("DOB")}>Date Of Birth
                                        {order === 'Asc' ? <i className="fas fa-sort-up" style={{ marginLeft: '5px' }}></i> : <i className="fas fa-sort-down" style={{ marginLeft: '5px' }}></i>}
                                    </th>
                                    <th className='text-center'> Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    patientDetails.filter((item) => {
                                        return searchPatient=== '' ? item : item.Name.includes(searchPatient)
                                    }).map((patient, index) => (
                                            <tr key={patient.Id}>
                                                <td>{patient.Name}</td>
                                                <td>{patient.Email}</td>
                                                <td>{patient.Gender}</td>
                                                <td>{patient.Mobile_No}</td>
                                                <td>{patient.DOB}</td>
                                                <td className='text-center'>
                                                    <button
                                                        className="btn btn-primary mx-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#PatientDetailedit"
                                                        onClick={() => patientDetailsEdit(index)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger mx-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#patientDelete"
                                                        onClick={() => PatientDetailsDelete(patient.Id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="modal fade" id="PatientDetailedit" tabIndex="-1" aria-labelledby="PatientDetaileditLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="PatientDetaileditLabel">
                                    Edit Data
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="container my-3">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="inputName" className="form-label">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="inputName"
                                                    value={patientInfo.name}
                                                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="inputEmail" className="form-label">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="inputEmail"
                                                    required
                                                    placeholder="Enter email"
                                                    value={patientInfo.email}
                                                    onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <fieldset className='col-6' >
                                                <div >
                                                    <legend className="col-form-label ">Gender</legend>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="gender" id="male" value="male" onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })} required />
                                                        <label className="form-check-label" name="male">
                                                            <span className="p-2">Male</span>
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="gender" id="female" value="female" onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })} required />
                                                        <label className="form-check-label" name="female">
                                                            <span className="p-2">Female</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <div className="mb-3 col-md-6 ">
                                                <label htmlFor="inputDate" className="form-label">
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="inputDate"
                                                    value={patientInfo.DOB}
                                                    onChange={(e) => setPatientInfo({ ...patientInfo, DOB: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="inputAddress" className="form-label">
                                                Address
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="inputAddress"
                                                value={patientInfo.address}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, address: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="inputNote" className="form-label">
                                                    Note
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="inputNote"
                                                    value={patientInfo.note}
                                                    onChange={(e) => setPatientInfo({ ...patientInfo, note: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="inputMobileNo" className="form-label">
                                                    Mobile No
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    id="inputMobileNo"
                                                    value={patientInfo.mobile_No}
                                                    onChange={(e) => setPatientInfo({ ...patientInfo, mobile_No: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={updatePatient} data-bs-dismiss="modal">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="modal fade"
                    id="patientDelete"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Delete Patient record
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={handleCloseDeleteConfirmation}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete patient details !!!!
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={handleCloseDeleteConfirmation}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Patientinfo;