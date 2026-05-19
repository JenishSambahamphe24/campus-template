import  { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_URL;
import { useAuth } from '../../context/AuthContextProvider';
import { CMS_USER, UGC_USER } from '../../utils/constants';

function AdminSignIn() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/admin/signin`, {
                email: formData.email,
                password: formData.password,
            });
            const token = response.data.token;
            const role = response.data.user.role;
            const normalizedRole = typeof role === 'string' ? role.toUpperCase() : '';
            const email = response.data.user.email;
            const userName = response.data.user.userName;

            login({ email, token, role: normalizedRole, userName });
            toast.success('Login successful', { autoClose: 500 });
            setTimeout(() => {
                if (normalizedRole === CMS_USER) {
                    navigate('/admin');
                } else if (normalizedRole === UGC_USER) {
                    navigate('/qaa/qaa');
                } else {
                    toast.error('Unknown user role. Please contact support.', { autoClose: 2000 });
                    navigate('/signIn');
                }
            }, 700);
        } catch (error) {
            toast.error('No user found', { autoClose: 200 })
            console.error('Error during login:', error.response?.data || error.message);
        }
    };

    return (
        <section className="bg-white">
            <div className="w-full mx-auto max-w-xl flex flex-col justify-center py-20 relative p-8">
                {/* <h1 className='text-lg text-center mb-4'>  CMS Login</h1> */}
                <div >
                    <form onSubmit={handleSubmit} className="w-full divide-neutral-200 rounded-3xl bg-white shadow-2xl border p-8 lg:p-8" >
                        <div className="py-1 space-y-2">
                            <label htmlFor="login_email" className="block text-md text-gray-700">Email</label>
                            <input
                                type="email"
                                name='email'
                                id="login_email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full h-12 px-4 py-3 placeholder-gray-500 bg-gray-100 border-0 rounded-lg appearance-none text-[#1169bf] focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-[#1169bf] focus:ring-inset focus:ring-2 text-sm"
                                placeholder="Enter your email"
                                required
                               
                            />
                            {!formData.email && (
                                <p className="text-red-500 text-sm mt-1">Email is required   </p>
                            )}
                        </div>
                        <div className="py-1 space-y-2">
                            <label htmlFor="login_password" className="block text-md text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="login_password"
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full h-12 px-4 py-3 placeholder-gray-500 bg-gray-100 border-0 rounded-lg appearance-none text-[#1169bf] focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-[#1169bf] focus:ring-2 focus:ring-inset text-sm"
                                    placeholder="Enter your password"
                                    required 
                                />
                                <span
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </span>
                            </div>

                        </div>
                        <div className="mt-4">
                            <button
                                type="submit"
                                style={{ backgroundColor: '#1169bf' }}
                                className="rounded-full px-8 py-1 h-10 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </section>
    )
}

export default AdminSignIn
