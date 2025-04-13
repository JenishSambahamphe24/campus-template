import { Grid } from '@mui/material'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
const BASE_URL = import.meta.env.VITE_API_URL;
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterUser() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        userName: '',
        role:'Adin',
        password: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.password) {
            newErrors.password = ' password is required';
        }
        if (!formData.userName) {
            newErrors.userName = ' username is required';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your  password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            const submitData = {
                email: formData.email,
                password: formData.password,
                role:formData.role,
                userName:formData.userName
            };

            const response = await axios.post(`${BASE_URL}/admin/signup`, submitData);
            if (response.data && response.status === 201) {
                toast.success('User create successfully  !! you can now login with the credential', {autoClose:1500});
                setTimeout(() => {
                    navigate('/signIn')
                }, 2000);
            } else {
                throw new Error('Unexpected response from server');
            }
        } catch (error) {
            console.error('Password change error:', error);
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
            <Grid item mx='auto' xs={10} sm={8} md={5}>
                <div className="relative mx-auto w-full bg-white px-4 pt-4 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
                    <div className="w-full">
                        <div className="text-center">
                            <h1 className="text-2xl font-semibold text-[#1169bf]">Sign up</h1>
                            <p className="mt-2 text-gray-500">Create a new user</p>
                        </div>
                        <div className="mt-5">
                            <form onSubmit={handleSubmit}>
                            <div className="relative mt-6">
                                    <input
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
                                    />
                                    <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75">
                                       User Name
                                    </label>
                                </div>
                                <div className="relative mt-6">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
                                    />
                                    <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75">
                                        Email Address
                                    </label>
                                </div>
                                {renderPasswordField("password", "Password", formData.password)}
                                {renderPasswordField("confirmPassword", "Confirm  Password", formData.confirmPassword)}

                                {errors.submit && (
                                    <p className="mt-4 text-sm text-red-500 text-center">{errors.submit}</p>
                                )}

                                <div className="my-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-md bg-[#1169bf] px-3 py-2 text-white focus:bg-gray-600 focus:outline-none disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? 'creating user ...' : 'create user'}
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

export default RegisterUser;