import React, { useEffect, useState } from 'react';
import axios from "axios";
import { getUser, getToken } from "../utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toggle2Factor = () => {
    const user = getUser();
    const token = getToken();

    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const get2FactorStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/user/getTwoFactorStatus', {
                params: { user_id: user.id },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setIsChecked(response.data); // Assuming response.data returns boolean
        } catch (e) {
            console.error(e.message);
            toast.error("Failed to fetch 2FA status.");
        }
    };

    const handleCheckboxChange = async () => {
        setLoading(true);
        const newIsChecked = !isChecked;
        setIsChecked(newIsChecked);

        try {
            const endpoint = newIsChecked
                ? 'http://localhost:8080/api/v1/user/enable-two-factor'
                : 'http://localhost:8080/api/v1/user/disable-two-factor';

            await axios.patch(endpoint, {}, {
                params:{
                    user_id: user.id,
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            toast.success(`Two Factor ${newIsChecked ? 'Enabled' : 'Disabled'}!`);
        } catch (e) {
            console.error(e.message);
            toast.error(`Failed to ${newIsChecked ? 'enable' : 'disable'} Two Factor.`);
            setIsChecked(!newIsChecked); // Revert state if API call fails
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        get2FactorStatus().then(r => setLoading(false));
    }, []);

    return (
        <>
            <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
                <input
                    type='checkbox'
                    name='autoSaver'
                    className='sr-only'
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    disabled={loading} // Disable during loading
                />
                <span
                    className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${
                        isChecked ? 'bg-blue-500' : 'bg-[#CCCCCE]'
                    }`}
                >
                    <span
                        className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${
                            isChecked ? 'translate-x-6' : ''
                        }`}
                    ></span>
                </span>
                <span className='label flex items-center text-sm font-medium text-black'>
                    <span className='pl-1'> {isChecked ? 'Enabled' : 'Disabled'} </span>
                </span>
                <ToastContainer />
            </label>
        </>
    );
};

export default Toggle2Factor;
