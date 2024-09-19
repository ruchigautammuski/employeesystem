
import React, { useState } from 'react';
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
} from '@mui/material';
import axios from 'axios';

function CreateEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    courses: [],
    image: null,
  });

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
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post('http://localhost:8000/api/employee', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Employee created successfully!');
    } catch (error) {
      console.error('There was an error creating the employee!', error);
    }
  };

  return (
   
   <div style={{width:"400px",display:'flex',flexDirection:'column',justifyContent:'center',margin:'auto'}}>
    <form>
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
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ margin: '16px 0' }}
      />
      <Button onClick={handleSubmit} variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </form>
    </div>
  );
}

export default CreateEmployee;
