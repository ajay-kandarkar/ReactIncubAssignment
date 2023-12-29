import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Select from 'react-select';
function PatientScreen() {
    const navigat = useNavigate();
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        gender: "",
        DOB: "",
        country: "",
        state: "",
        doctor: "",
        address: "",
        note: "",
        mobile_No: "",
        isChecked: false
    });
    const [country, setCountry] = useState([]);
    const [states, setStates] = useState([]);
    const [doctor, setDoctor] = useState([]);
    const [Country_Id, setCountryId] = useState("");
    const [patientDetails, setPatientDetails] = useState({
        name: "",
        email: "",
        gender: "",
        DOB: "",
        country: "",
        state: "",
        doctor: "",
        address: "",
        note: "",
        mobile_No: "",
        isChecked: false
    });
    useEffect(() => {
        axios.get('http://localhost:8080/get-doctors')
            .then((response) => {
                console.log('Doctors from useEffect', response.data);
                setDoctor(response.data);
            })
            .catch((error) => {
                console.error('Error fetching doctor data', error);
            });
        axios.get('http://localhost:8080/get-country')
            .then((response) => {
                console.log('Country data', response.data);
                setCountry(response.data);
            })
            .catch((error) => {
                console.error('Error fetching country data', error);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8080/state/${Country_Id}`)
            .then((response) => {
                setStates(response.data);
                console.log("State is: ", response.data);
            })
            .catch((error) => {
                console.error('Error fetching state data', error);
            });
    }, [Country_Id]);
    const handleCountryChange = (event) => {
        const selectedCountryId = event.target.value;
        setCountryId(selectedCountryId);

        setPatientDetails({
            ...patientDetails,
            country: selectedCountryId,
            state: "",
        });
    };
    const handleInputChange = (fieldName, value) => {
        setPatientDetails({
            ...patientDetails,
            [fieldName]: value,
        });
        switch (fieldName) {
            case 'name':
                setErrors((prevErrors) => {
                    if (value.trim()) {
                        delete prevErrors['name'];
                        return { ...prevErrors };
                    } else {
                        return { ...prevErrors, name: 'Name is required' };
                    }
                });
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setErrors((prevErrors) => {
                    if (value.trim() && emailRegex.test(value.trim())) {
                        delete prevErrors['email'];
                        return { ...prevErrors };
                    } else {
                        return { ...prevErrors, email: 'Invalid email address' };
                    }
                });
                break;
            case 'note':
                setErrors((prevErrors) => {
                    if (value.trim()) {
                        delete prevErrors['note'];
                        return { ...prevErrors };
                    } else {
                        return { ...prevErrors, Note: 'Note is required' };
                    }
                });
                break;
            case 'mobile_No':
                var filter = /(0|91)?[6-9][0-9]{9}/;
                setErrors((prevErrors) => {
                    if (value.trim() && filter.test(value.trim()) && value.length === 10) {
                        delete prevErrors['mobile_No'];
                        return { ...prevErrors };
                    } else {
                        return { ...prevErrors, Mobileno: 'Invalid mobile' };
                    }
                });
                break;
            case 'address':
                setErrors((prevErrors) => {
                    if (value.trim()) {
                        delete prevErrors['address'];
                        return { ...prevErrors };
                    } else {
                        return { ...prevErrors, Address: 'Adress is required' };
                    }
                });
                break;
            default:
                setErrors({});
                break;
        }
    };
    const handleCheckboxChange = () => {
        setPatientDetails((prevPatientData) => ({
            ...prevPatientData,
            isChecked: !prevPatientData.isChecked,
        }));
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors['isChecked'];
            return updatedErrors;
        });
    };
    const submitPatientDetails = () => {
        if (!patientDetails.name.trim()) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: 'Name is required',
            }));
            return;
        }
        const validationErrors = {};
        if (!patientDetails.name.trim()) {
            validationErrors.name = 'Name is required';
        }
        if (!patientDetails.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientDetails.email.trim())) {
            validationErrors.email = 'email is required';
        }
        if (!patientDetails.DOB) {

            validationErrors.DOB = 'Date of Birth is required';
        }
        if (!patientDetails.gender.trim()) {
            validationErrors.gender = 'Gender is required';
        }
        if (!patientDetails.isChecked) {
            validationErrors.isChecked = 'You must agree to the Terms and Conditions';
        }
        if (!patientDetails.address.trim()) {
            validationErrors.address = 'Address is required';
        }
        if (!patientDetails.note.trim()) {
            validationErrors.note = 'Note is required';
        }
        if (!patientDetails.mobile_No.trim()) {
            validationErrors.mobile_No = 'Mobile number is required';
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        axios.post('http://localhost:8080/insert-patient-details', {
            Name: patientDetails.name || "",
            Email: patientDetails.email || "",
            Gender: patientDetails.gender || "",
            DOB: patientDetails.DOB || "",
            Address: patientDetails.address || "",
            Note: patientDetails.note || "",
            Mobile_No: patientDetails.mobile_No || "",
            IsChecked: patientDetails.isChecked || "",
            CountryId: patientDetails.country || "",
            DoctorId: patientDetails.doctor || "",
        })
            .then((response) => {
                console.log('Patient details: ', response.data);
                setDoctor(response.data);
            })
            .catch((error) => {
                console.error('Error inserting patient details', error);
            });

        toast.success("Patient information saved successfully!!!!!", {
            position: toast.POSITION.TOP_CENTER,
        });
        navigat("/");
    };
    return (
        <>
            <div>
                <form>
                    <div className="container my-5">
                        <form className="row">
                            <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="d-flex justify-content-center">Patient screen </h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-3">
                                            <div>
                                                <label name="inputName" className="form-label">Name <span style={{ color: 'red' }}>*</span></label>
                                                <div>
                                                    <input type="text" id="inputName" name="Name" className="form-control" onChange={(e) => handleInputChange("name", e.target.value)} value={patientDetails.name} required placeholder="Enter Name" />
                                                    {errors.name && <p className="text-danger">{errors.name} </p>}
                                                </div>
                                            </div>
                                            <div>
                                                <label name="inputEmail" className="form-label">Email<span style={{ color: 'red' }}> *</span></label>
                                                <input type="email" className="form-control" id="inputEmail" autoComplete="off" onChange={(e) => handleInputChange("email", e.target.value)} required placeholder="Enter email" name="Email" value={patientDetails.email} />
                                                {errors.email && <p className="text-danger">{errors.email} </p>}
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <fieldset>
                                                <div>
                                                    <legend className="col-form-label">Gender<span style={{ color: 'red' }}> *</span></legend>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="gender"
                                                            value="male"
                                                            checked={patientDetails.gender === "male"}
                                                            onChange={(e) => handleInputChange("gender", e.target.value)}
                                                            required
                                                        />
                                                        <label className="form-check-label" name="male">
                                                            <span className="p-2">Male</span>
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="gender"
                                                            value="female"
                                                            checked={patientDetails.gender === "female"}
                                                            onChange={(e) => handleInputChange("gender", e.target.value)}
                                                            required
                                                        />
                                                        <label className="form-check-label" name="female">
                                                            <span className="p-2">Female</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                {errors.gender && <p className="text-danger">{errors.gender}</p>}
                                            </fieldset>
                                            <div  >
                                                <label name="inputdate" className="col-form-label">DOB<span style={{ color: 'red' }}>*</span></label>
                                                <div >
                                                    <input type="Date" className="form-control" id="inputdate" name="DOB" value={patientDetails.DOB} onChange={(e) => handleInputChange("DOB", e.target.value)} required />
                                                </div>
                                                {errors.DOB && <p className="text-danger">{errors.DOB} </p>}
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 grid">

                                            <div className="g-col-6 " >
                                                <label name="country" className="form-label">Country</label>
                                                <select id="country" className="form-select"
                                                    value={patientDetails.country}
                                                    onChange={handleCountryChange} required >
                                                    <option selected>Select Country...</option>
                                                    {
                                                        country && country.length > 0 ?
                                                            country.map((item) => (
                                                                <option key={item.Id} value={item.Id}>{item.Name}</option>
                                                            )) :
                                                            <option>No data</option>
                                                    }
                                                </select>
                                            </div>

                                            <div className="g-col-6 ">
                                                <label name="State" className="form-label">State</label>
                                                <select id="State" className="form-select"
                                                    value={patientDetails.state}
                                                    onChange={(e) => setPatientDetails({ ...patientDetails, state: e.target.value })} required>
                                                    <option selected>Select State...</option>
                                                    {states && states.length > 0 ?
                                                        states.map((item) => (
                                                            <option key={item.Id} value={item.Id}>{item.name}</option>
                                                        )) :
                                                        <option>No data</option>
                                                    }
                                                </select>
                                            </div>
                                            <div className="g-col-6">
                                                <label for="doctor" className="form-label">
                                                    Doctors
                                                </label>
                                                <Select
                                                    id="doctor"
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            width: '200px',
                                                        }),
                                                    }}
                                                    onChange={(selectedOption) => handleInputChange("doctor", selectedOption.id)}
                                                    options={doctor && doctor.length > 0 ? doctor.map((item) => ({ value: item.Name, id: item.Id, label: item.Name })) : []}
                                                    isSearchable={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="mx-3">
                                            <label name="Address" className="col-form-label ">Address<span style={{ color: 'red' }}> *</span></label>
                                            <textarea className="form-control" id="Address" value={patientDetails.address} onChange={(e) => handleInputChange("address", e.target.value)} required></textarea>
                                            {errors.address && <p className="text-danger">{errors.address} </p>}
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <div>
                                                <label name="inputnote" className="col-form-label">Note<span style={{ color: 'red' }}> *</span></label>
                                                <input type="text" className="form-control" id="inputnote" onChange={(e) => handleInputChange("note", e.target.value)} required />
                                                {errors.note && <p className="text-danger">{errors.note} </p>}
                                            </div>
                                            <div >
                                                <label name="inputnumber" className="col-form-label">Mobile No<span style={{ color: 'red' }}> *</span></label>
                                                <div>
                                                    <input type="phone" className="form-control" id="inputnumber" onChange={(e) => handleInputChange("mobile_No", e.target.value)} required />
                                                    {errors.mobile_No && <p className="text-danger">{errors.mobile_No} </p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <input
                                                className="form-check-input m-1 "
                                                type="checkbox"
                                                id="termsCheckbox"
                                                name="isChecked"
                                                checked={patientDetails.isChecked}
                                                onChange={handleCheckboxChange}
                                                required
                                            />
                                            <label className="form-check-label" htmlFor="termsCheckbox">
                                                I agree to the Terms and Conditions<span style={{ color: 'red' }}>*</span>
                                            </label>
                                        </div>
                                        <div>   {errors.isChecked && <p className="text-danger d-flex justify-content-center">{errors.isChecked} </p>}</div>
                                    </div>
                                    <div className="card-footer py-0">
                                        <div className="text-end">
                                            <button type="submit" className="btn btn-primary m-3" onClick={submitPatientDetails} >Save</button>
                                            <button type="button" className="btn btn-primary m-3" onClick={() => { navigat("/") }}>Back</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </form>
            </div>
        </>
    );
}

export default PatientScreen;
