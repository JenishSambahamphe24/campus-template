import { Grid } from '@mui/material'
import { useState, useEffect } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
const BASE_URL = import.meta.env.VITE_API_URL;
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChangePassword() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('email');
        setFormData((prev) => ({
            ...prev,
            email: email
        }))
    }, []);

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        }
        if (!formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({}); 
        
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error("Token is missing");
            }
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const submitData = {
                email: formData.email,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            };

            const response = await axios.put(`${BASE_URL}/admin/change-password`, submitData, { headers });
            
            if (response.data && response.status === 200) {
                toast.info('Password changed successfully! Please Login again with new credentials!!', {autoClose:1500});
                localStorage.clear()
                setTimeout(() => {
                    navigate('/signIn')
                }, 2000);
            } else {
                throw new Error('Unexpected response from server');
            }

        } catch (error) {
            console.error('Password change error:', error);
            if (error.response) {
                const errorMessage = error.response.data?.message || 'Failed to change password. Please try again.';
                toast.error(errorMessage);
                setErrors({
                    submit: errorMessage
                });
            } else if (error.request) {
                toast.error('No response from server. Please check your connection.');
                setErrors({
                    submit: 'Network error. Please check your connection.'
                });
            } else {
                toast.error('An error occurred. Please try again.');
                setErrors({
                    submit: 'An error occurred. Please try again.'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderPasswordField = (name, label, value) => (
        <div className="relative mt-6">
            <div className="relative">
                <input
                    type={showPasswords[name] ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none pr-10"
                />
                <button
                    type="button"
                    onClick={() => togglePasswordVisibility(name)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showPasswords[name] ?
                        <AiOutlineEyeInvisible size={20} /> :
                        <AiOutlineEye size={20} />
                    }
                </button>
            </div>
            <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75">
                {label}
            </label>
            {errors[name] && (
                <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <Grid container className='my-8'>
            <Grid item mx='auto' sm={4} >
                <div className="relative mx-auto w-full bg-white px-4 pt-4 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
                    <div className="w-full">
                        <div className="text-center">
                            <h1 className="text-2xl font-semibold text-[#1169bf]">Change Password</h1>
                            <p className="mt-2 text-gray-500">Secure Your Account – Update Your Password</p>
                        </div>
                        <div className="mt-5">
                            <form onSubmit={handleSubmit}>
                                <div className="relative mt-6">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
                                        readOnly
                                    />
                                    <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75">
                                        Email Address
                                    </label>
                                </div>

                                {renderPasswordField("currentPassword", "Current Password", formData.currentPassword)}
                                {renderPasswordField("newPassword", "New Password", formData.newPassword)}
                                {renderPasswordField("confirmNewPassword", "Confirm New Password", formData.confirmNewPassword)}

                                {errors.submit && (
                                    <p className="mt-4 text-sm text-red-500 text-center">{errors.submit}</p>
                                )}

                                <div className="my-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-md bg-[#1169bf] px-3 py-2 text-white focus:bg-gray-600 focus:outline-none disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? 'Changing Password...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}

export default ChangePassword;