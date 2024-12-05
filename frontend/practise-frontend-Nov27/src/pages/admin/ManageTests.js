import React, { useState, useEffect } from 'react';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import { getAllTests, addTest, updateTest } from '../../api/admin/adminAPI';
import { GiHypodermicTest } from "react-icons/gi";


const ManageTests = () => {
  const [tests, setTests] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [newTest, setNewTest] = useState({
    testName: '',
    testPrice: '',
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await getAllTests();
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleAddTest = async () => {
    if (!newTest.testName || !newTest.testPrice) return;

    try {
      await addTest(newTest);
      setAlertMessage('Test added successfully.');
      setNewTest({ testName: '', testPrice: '' });
      fetchTests();
    } catch (error) {
      console.error('Error adding test:', error);
    }
  };

  const handleUpdateTest = async (testId, updatedTest) => {
    try {
      await updateTest(testId, updatedTest);
      setAlertMessage('Test updated successfully.');
      setIsEditing(null);
      fetchTests();
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  return (
    <div className="manage-tests min-vh-100 text-dark">
      {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
      <h2 className="mb-4"><GiHypodermicTest className='me-3'/>Manage Tests</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>

      <div className="add-test-form mb-3">
        <h4>Add Test</h4>
        <Form>
          <Form.Group className="mb-2" controlId="testName">
            <Form.Label>Enter new test name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter test name"
              className='bg-light text-dark rounded-pill border-dark'
              value={newTest.testName}
              onChange={(e) =>
                setNewTest({ ...newTest, testName: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="testPrice">
            <Form.Label>Test Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter test price"
              className='bg-light text-dark rounded-pill border-dark'
              value={newTest.testPrice}
              onChange={(e) =>
                setNewTest({ ...newTest, testPrice: e.target.value })
              }
            />
          </Form.Group>
          <Button onClick={handleAddTest} className='btn btn-dark rounded-pill fst-italic text-light'>Add Test</Button>
        </Form>
      </div>

      <Table striped borderless hover responsive>
        <thead className='table-group-divider'>
          <tr>
            <th>Test ID</th>
            <th>Test Name</th>
            <th>Test Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody >
          {tests.map((test) =>
            isEditing === test.testID ? (
              <tr key={test.testID}>
                <td>{test.testID}</td>
                <td>
                  <Form.Control
                    type="text"
                    defaultValue={test.testName}
                    onChange={(e) => (test.testName = e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    defaultValue={test.testPrice}
                    onChange={(e) =>
                      (test.testPrice = parseFloat(e.target.value))
                    }
                  />
                </td>
                <td>
                  <Button
                    variant="dark"
                    className='rounded-pill text-light fst-italic'
                    onClick={() =>
                      handleUpdateTest(test.testID, test)
                    }
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ) : (
              <tr key={test.testID}>
                <td>{test.testID}</td>
                <td>{test.testName}</td>
                <td>{test.testPrice}</td>
                <td>
                  <Button
                    variant="dark"
                    className='text-light rounded-pill fst-italic'
                    onClick={() => setIsEditing(test.testID)}
                  >
                    Update
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
      <hr class="border border-dark border-1 opacity-100"></hr>

    </div>
  );
};

export default ManageTests;
