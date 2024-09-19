import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    courses: [],
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/employee/${id}`);
        const employeeData = response.data;

        setFormData({
          name: employeeData.name,
          email: employeeData.email,
          mobile: employeeData.mobile,
          designation: employeeData.designation,
          gender: employeeData.gender,
          courses: employeeData.courses[0] ? employeeData.courses[0].split(',') : [],
          image: employeeData.image || '', 
        });
      } catch (err) {
        setError('Failed to fetch employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        courses: checked
          ? [...prev.courses, value]
          : prev.courses.filter((course) => course !== value),
      }));
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] })); // Set image file
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      // Check if key is 'image' to append as a file or else append as text
      if (key === 'image' && formData.image instanceof File) {
        data.append(key, formData.image); // Append file if it exists
      } else {
        data.append(key, formData[key]);
      }
    });

    // Log data for debugging
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      await axios.put(`http://localhost:8000/api/employee/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Employee updated successfully!');
      navigate('/employee-data');
    } catch (error) {
      setError('Failed to update employee');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div style={{ width: "400px", display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          name="mobile"
          label="Mobile No"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.mobile}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Designation</InputLabel>
          <Select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          >
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Sales">Sales</MenuItem>
          </Select>
        </FormControl>
        <FormControl component="fieldset" margin="normal">
          <RadioGroup
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <FormControlLabel value="M" control={<Radio />} label="Male" />
            <FormControlLabel value="F" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                value="MCA"
                checked={formData.courses.includes('MCA')}
                onChange={handleChange}
              />
            }
            label="MCA"
          />
          <FormControlLabel
            control={
              <Checkbox
                value="BCA"
                checked={formData.courses.includes('BCA')}
                onChange={handleChange}
              />
            }
            label="BCA"
          />
          <FormControlLabel
            control={
              <Checkbox
                value="BSC"
                checked={formData.courses.includes('BSC')}
                onChange={handleChange}
              />
            }
            label="BSC"
          />
        </FormGroup>

        {/* Display current image if available */}
        {formData.image && (
          <img
            src={`http://localhost:8000/uploads/${formData.image}`} 
            alt="Current Employee"
            style={{ width: '100px', margin: '16px 0' }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ margin: '16px 0' }}
        />
        <Button variant="contained" color="primary" type="submit">
          Update Employee
        </Button>
      </form>
    </div>
  );
}

export default EditEmployee;
