import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTests, getMedications, conductConsultation } from '../../api/doctor/doctor';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaStethoscope } from "react-icons/fa";

const ConductConsultation = () => {
  const [symptoms, setSymptoms] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [consultationFee, setConsultationFee] = useState(0);
  const [appointmentId, setAppointmentId] = useState('');
  const [tests, setTests] = useState([]);
  const [medications, setMedications] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tests
        const fetchedTests = await getTests();
        console.log('Fetched Tests:', fetchedTests);
        setTests(fetchedTests); // Ensure tests are properly stored

        // Fetch medications
        const fetchedMedications = await getMedications();
        console.log('Fetched Medications:', fetchedMedications);
        setMedications(fetchedMedications);
      } catch (err) {
        console.error('Error fetching tests or medications:', err);
        setError('Failed to load tests or medications.');
      }
    };
    fetchData();
  }, []);

  // Add a new prescription field
  const addPrescriptionField = () => {
    setPrescriptions([...prescriptions, { medicationId: '', dosage: '', durationDays: '', quantity: '' }]);
  };

  const updatePrescription = (index, field, value) => {
    const updatedPrescriptions = prescriptions.map((prescription, i) =>
      i === index ? { ...prescription, [field]: value } : prescription
    );
    setPrescriptions(updatedPrescriptions);
  };

  const removePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  // Add a test field
  const addTestField = () => {
    setSelectedTests([...selectedTests, { testId: '' }]);
  };

  const updateTest = (index, testId) => {
    const updatedTests = selectedTests.map((test, i) =>
      i === index ? { testId } : test
    );
    setSelectedTests(updatedTests);
  };

  const removeTest = (index) => {
    setSelectedTests(selectedTests.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!symptoms || !treatmentPlan || !consultationFee || !appointmentId || !followUpDate) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      symptoms,
      physicalExamination: physicalExam,
      treatmentPlan,
      followUpDate,
      testIDs: selectedTests.map((test) => parseInt(test.testId)),
      prescriptions: prescriptions.map((p) => ({
        medicationID: parseInt(p.medicationId),
        dosage: p.dosage,
        durationDays: parseInt(p.durationDays),
        quantity: parseInt(p.quantity),
      })),
    };

    console.log('Submitting payload:', payload);

    try {
      await conductConsultation(appointmentId, consultationFee, payload);
      setSuccess('Consultation completed successfully.');
      setError('');
      navigate('/doctor-dashboard');
    } catch (err) {
      console.error('Error during submission:', err);
      setError('An error occurred while conducting the consultation.');
    }
  };

  return (
    <div className="container mt-5 text-dark min-vh-100">
      <h2 ><FaStethoscope />  Conduct Consultation</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group mb-2">
        <label className='mb-2 h6'>Appointment ID</label>
        <input
          type="text"
          className="form-control text-dark bg-light border-dark-subtle"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
        />
      </div>

      <div className="form-group mb-2">
        <label className='mb-2 h6'>Symptoms</label>
        <textarea
          className="form-control text-dark bg-light border-dark-subtle"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        ></textarea>
      </div>

      <div className="form-group mb-2">
        <label className='mb-2 h6'>Physical Examination</label>
        <textarea
          className="form-control text-dark bg-light border-dark-subtle"
          value={physicalExam}
          onChange={(e) => setPhysicalExam(e.target.value)}
        ></textarea>
      </div>

      <div className="form-group mb-2">
        <label className='mb-2 h6'>Treatment Plan</label>
        <textarea
          className="form-control text-dark bg-light border-dark-subtle "
          value={treatmentPlan}
          onChange={(e) => setTreatmentPlan(e.target.value)}
        ></textarea>
      </div>

      <div className="form-group mb-2">
        <label className='mb-2 h6'>Follow-Up Date</label>
        <input
          type="date"
          className="form-control text-dark bg-light border-dark-subtle"
          value={followUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
        />
      </div>

      <div className="form-group mb-2">
        <label className='mb-2 h6'>Consultation Fee</label>
        <input
          type="number"
          className="form-control  text-dark bg-light border-dark-subtle"
          value={consultationFee}
          onChange={(e) => setConsultationFee(Number(e.target.value))}
        />
      </div>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {/* Tests Section */}
      <div className="form-group mb-2 mt-2">
        <label className='me-3 h6'>Tests</label>
        {selectedTests.map((test, index) => (
          <div key={index} className="mb-3">
            <select
              className="form-control mb-2 fst-italic"
              value={test.testId}
              onChange={(e) => updateTest(index, e.target.value)}
            >
              <option value="">Select Test</option>
              {tests.map((testOption) => (
                <option key={testOption.testID} value={testOption.testID}>
                  {testOption.testName}
                </option>
              ))}
            </select>
            <button className="btn btn-danger btn-sm fst-italic rounded-pill" onClick={() => removeTest(index)}>
              Remove
            </button>
          </div>
        ))}
        <button className="btn btn-dark fst-italic rounded-pill" onClick={addTestField}>
          Add Test
        </button>
      </div>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {/* Prescription Section */}
      <div className="form-group mt-3">
        <label className='me-3 h6'>Prescriptions</label>
        {prescriptions.map((prescription, index) => (
          <div key={index} className="mb-3">
            <select
              className="form-control mb-1 fst-italic"
              value={prescription.medicationId}
              onChange={(e) => updatePrescription(index, 'medicationId', e.target.value)}
            >
              <option value="">Select Medication</option>
              {medications.map((med) => (
                <option key={med.medicationID} value={med.medicationID}>
                  {med.medicationName}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control mb-1 border-dark-subtle text-dark bg-light"
              placeholder="Dosage"
              value={prescription.dosage}
              onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
            />
            <input
              type="number"
              className="form-control mb-1 bg-light text-dark border-dark-subtle"
              placeholder="Duration (Days)"
              value={prescription.durationDays}
              onChange={(e) => updatePrescription(index, 'durationDays', e.target.value)}
            />
            <input
              type="number"
              className="form-control mb-1 border-dark-subtle bg-light"
              placeholder="Quantity"
              value={prescription.quantity}
              onChange={(e) => updatePrescription(index, 'quantity', e.target.value)}
            />
            <button
              className="btn btn-danger btn-sm mt-1 fst-italic rounded-pill"
              onClick={() => removePrescription(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button className="btn btn-dark fst-italic rounded-pill" onClick={addPrescriptionField}>
          Add Prescription
        </button>
      </div>
      <hr class="border border-dark border-1 opacity-100"></hr>

      <button className="btn btn-success mt-3 fst-italic rounded-pill" onClick={handleSubmit}>
        Submit Consultation
      </button>
    </div>
  );
};

export default ConductConsultation;
