import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  IconButton,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon
import axios from "axios";

function AddNewManufacture() {
  const user = JSON.parse(localStorage.getItem("user"));
  const manufactureUnitId = user?.manufacture_unit_id;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateForm = () => {
    let valid = true;
    let errors = { name: "", email: "" };

    if (!name) {
      errors.name = "Name is required";
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!emailPattern.test(email)) {
      errors.email = "Invalid email format";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  // const fetchUsername = async () => {
  //   if (!validateForm()) return;
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_IP}generateUserName/`,
  //       {
  //         params: {
  //           manufacture_unit_id: manufactureUnitId,
  //           name: name,
  //         },
  //       }
  //     );

  //     if (response.data && response.data.data && response.data.data.username) {
  //       setUsername(response.data.data.username);
  //     } else {
  //       console.error("Username not found in response:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error generating username:", error);
  //   }
  // };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const createUser = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("manufacture_unit_id", manufactureUnitId);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}createUser/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const message =
          response.data.data?.data?.message ||
          "User created successfully and email sent!";
        setSuccessMessage(message);

        setName("");
        setEmail("");
        setUsername("");
        setLocation("");
        setDescription("");
        setLogo(null);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      createUser();
    }
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <Container maxWidth="xs" style={{ marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Add New Manufacturer
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" spacing={2}>
          <Box mb={2}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogoChange}
              />
            </Button>
            {logo ? (
              <Box mt={1}>
                <img
                  src={URL.createObjectURL(logo)}
                  alt="Logo Preview"
                  style={{ width: "100px", cursor: "pointer" }}
                  onClick={handleModalOpen}
                />
              </Box>
            ) : (
              <Box mt={1}>
                <img
                  src="/path/to/default/image.jpg"
                  alt="Default Logo"
                  style={{ width: "100px", cursor: "pointer" }}
                  onClick={handleModalOpen}
                />
              </Box>
            )}
          </Box>
          <Box>
            <Button type="submit" variant="contained" color="success" fullWidth>
              Create New User
            </Button>
          </Box>
        </Box>
      </form>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />

      {/* Modal for larger image preview */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
          height="100vh"
        >
          <IconButton
            onClick={handleModalClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={logo ? URL.createObjectURL(logo) : "/path/to/default/image.jpg"}
            alt="Large Preview"
            style={{ width: "300px" }}
          />
        </Box>
      </Modal>
    </Container>
  );
}

export default AddNewManufacture;
