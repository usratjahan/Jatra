import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { updateMyProfile } from "../../services/authService";

// TODO: GET /api/auth/me  — prefill existing values
// TODO: PUT /api/auth/profile — update profile
// Body: { firstName, lastName, email, phone, address, newPassword, confirmPassword }

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    newPassword: "",
    confirmPassword: "",
  }));
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setErrMsg("Passwords do not match.");
      return;
    }

    setStatus("loading");
    try {
      const updatedUser = await updateMyProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        newPassword: form.newPassword || undefined,
      });
      login(updatedUser);
      setStatus("success");
      setTimeout(() => navigate("/dashboard/profile"), 1200);
    } catch (err) {
      setErrMsg(err.message || "Update failed. Please try again.");
      setStatus("error");
    }
  };
return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white sm:mb-8 sm:text-3xl">
        Update Profile
      </h1>
      <p className="text-gray-300 text-sm">Form coming soon...</p>
    </div>
  );
};
 
export default UpdateProfile;
 
  