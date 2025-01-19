import { createTheme, ThemeProvider,styled } from "@mui/material/styles";
import {AppBar, Tabs, Tab, Box, TextField, Button, CircularProgress, Modal} from "@mui/material";
import Navbar from "../dashboard/Navbar";
import React, {useEffect, useState} from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {getUser,getToken} from "../utils.js"
import axios from "axios";
import {Toggle2Factor} from "../buttons/Toggle2Factor.js"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultPic from './Default_pfp.jpg'

const UserProfile = () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#1976d2',
            },
        },
    });

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const [value, setValue] = useState(0);


    const [currentName, setCurrentName] = useState('')
    const [currentEmail, setCurrentEmail] = useState('')
    const [currentPhone, setCurrentPhone] = useState('')
    const [currentPass,setCurrentPass] = useState('')


    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [newPass,setNewPass] = useState('')
    const [confirmNewPass, setConfirmNewPass] = useState('')

    const [currentProfilePic, setCurrentProfilePic] = useState('')
    const [newProfilePic, setNewProfilePic] = useState('')
    const [previewPhoto, setPreviewPhoto] = useState('')

    const [loading, setLoading] = useState(true);

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [updatePhoto, setUpdatePhoto] = useState(false)

    const [isSaving, setIsSaving] = useState(false);

    const user = getUser()
    const token = getToken()

    const handlePictureUpload = async (e) => {
        e.preventDefault();

        if(newProfilePic === '' || newProfilePic === null){
            toast.error("No picture selected!")
            return;
        }
        setIsSaving(true)
        const formData = new FormData()
        formData.append('file',newProfilePic)

        try{
            const fileUpload = await axios.post('https://api.fitttrack.com/api/v1/s3/upload',formData,{
                params : {
                    user_id: user.id
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if(fileUpload.status === 200){
                setPreviewPhoto('')
                closeModal()
                setIsSaving(false)
                window.location.reload()

            }
        } catch(e){
            console.log(e.message)
        }


    }

    const getProfilePicture  = async () => {

        try {
            const getPicture = await axios.get("https://api.fitttrack.com/api/v1/s3/getProfilePicture", {
                params: {
                    user_id: user.id
                }
            })

            if (getPicture.data === "No Picture Found") {
                setCurrentProfilePic(null)
            } else {
                setCurrentProfilePic(getPicture.data)
            }
        } catch(e){
            console.log(e)

        }



    }

    useEffect(() => {

        setCurrentName(user.name)
        setCurrentEmail(user.email)
        setCurrentPhone(user.phone)
        console.log("Done")
        getProfilePicture().finally(setLoading(false))


    }, [user.username, user.name, user.email, user.phone]);


    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const openModal = () =>{

        setUpdatePhoto(true)
        setModalIsOpen(true)
        setPreviewPhoto('')
    }

    const closeModal = () => {

        setUpdatePhoto(false)
        setModalIsOpen(false)
        setPreviewPhoto('')
    }

    const handlePreview = (photo) => {

        setNewProfilePic(photo)
        const urlObject = URL.createObjectURL(photo)
        setPreviewPhoto(urlObject)
    }

    const updateUserInformation = async (e) => {

        e.preventDefault()

        const updateRequest = {

            name: newName,
            email: newEmail,
            phone: newPhone,

        }

        try {

            const updateInfoResponse = await axios.patch('https://api.fitttrack.com/api/v1/user/updateUserInfo', updateRequest, {
                params: {
                    user_id : user.id
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                }

            })

            toast.success(updateInfoResponse.data.message)
            localStorage.removeItem('user')
            localStorage.setItem('user', JSON.stringify(updateInfoResponse.data.userDTO))
            window.location.reload()

        } catch (e) {
            console.log(e)
        }
    }

    const handleChangePassword = async () => {


        if (confirmNewPass !== newPass) {
            toast.error("Passwords do not match!")
            return;
        }

        try {

            const changePasswordRequest = await axios.patch('https://api.fitttrack.com/api/v1/user/changePassword', {}, {
                params: {
                    user_id: user.id,
                    currentPassword: currentPass,
                    newPassword: confirmNewPass,
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }

            })

            if(changePasswordRequest.status === 200){
                toast.success(changePasswordRequest.data.message)
                window.location.reload()
            }

        } catch (e) {
            console.log(e)
        }

    }

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" className="bg-blue-600">
                <Navbar />
            </AppBar>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <CircularProgress />
                </div>
            ) : (
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex mt-4">
                <div className="flex-none">
                    <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
                    <img
                        className="rounded-full w-96 h-96"
                        src={currentProfilePic || defaultPic}
                        alt="Profile Pic"
                    />

                    <div className="mt-5">


                        <button type="submit"
                                onClick={(e) => openModal()}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3">Change Picture
                        </button>


                    </div>
                </div>
                <div className="flex-1 pl-6">
                    <Box>
                        <Tabs value={value} onChange={handleTabChange} aria-label="settings tabs">
                            <Tab label="Profile"/>
                            <Tab label="Preferences"/>
                            <Tab label="Security"/>
                            <Tab label="Password"/>
                        </Tabs>
                        <Box hidden={value !== 0}>
                            <div className="mt-2">
                                <div>
                                    <label htmlFor="name"
                                           className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                                        placeholder={currentName}

                                    />
                                </div>
                                <div>
                                    <label htmlFor="email"
                                           className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                    <input
                                        type="email"
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        id="email"
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                                        placeholder={currentEmail}

                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Phone
                                        number</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                                        placeholder={currentPhone}
                                        pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                    />
                                </div>



                                <button type="submit"
                                        onClick={(e) => updateUserInformation(e)}
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3">Save
                                </button>


                            </div>
                        </Box>
                        <Box hidden={value !== 1}>
                            <div>
                                {/* Notification settings can be added here */}
                                {/*<h2>Notification Settings</h2>*/}
                                {/* Add notification options */}
                            </div>
                        </Box>
                        <Box hidden={value !== 2}>
                            <div>
                                {/* Security settings can be added here */}
                                <h1 className="text-medium text-bold ">Toggle 2 Factor</h1>
                                <div className="mt-5">
                                <Toggle2Factor/>
                                </div>

                            </div>
                        </Box>
                        <Box hidden={value !== 3}>
                            <div className="mb-6">
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900">Current Password</label>
                                <input
                                    type="password"
                                    id="current-password"
                                    onChange={(e) => setCurrentPass(e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                                    placeholder="•••••••••"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                                <input
                                    type="password"
                                    id="new-password"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                                    onChange={(e) => setNewPass(e.target.value)}

                                    placeholder="•••••••••"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="confirm_password"
                                       className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                                    onChange={(e) => setConfirmNewPass(e.target.value)}
                                    placeholder="•••••••••"
                                    required
                                />

                                <button type="submit"
                                        onClick={handleChangePassword}
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3">Save
                                </button>


                            </div>

                        </Box>
                    </Box>
                </div>

                {updatePhoto && modalIsOpen && (

                    <Modal
                        open = {modalIsOpen}
                        onClose = {closeModal}
                        aria-labelledby="update-photo-modal-title"
                        aria-describedby="update-photo-modal"
                    >
                        <div className="modal-content">
                            <h2 id="update-photo-modal-title" className="modal-header flex jusitfy-center font-bold" >Update
                                Photo</h2>
                            <div className="modal-body">
                                <h3 id="preview-photo" className="header flex justify-left text-me">Preview</h3>
                                <img
                                    className="rounded-full w-96 h-96"
                                    src={previewPhoto}
                                    alt="Profile"
                                />

                                <div className="mt-6">

                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon/>}
                                >
                                    Upload photo
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(e) => handlePreview(e.target.files[0])}
                                        multiple
                                    />
                                </Button>
                                </div>


                            </div>

                            <div className="flex justify-between">
                                {!isSaving ? (
                                    <button type="submit"
                                            onClick={(e) => handlePictureUpload(e)}
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3">
                                        Save
                                    </button>
                                ) : (

                                    <button
                                        type="button"
                                        className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
                                    >
                                        <div className="mr-2">
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20.735a8 8 0 008-8h4a12 12 0 01-12 12v-4.265zM20 12a8 8 0 01-8 8v4.265a12 12 0 0012-12h-4zm-8-6.735a8 8 0 018-8v-4.265a12 12 0 00-12 12h4z"
                                                />
                                            </svg>
                                        </div>
                                        Saving...
                                    </button>


                                )}


                                <button
                                    onClick={() => closeModal()}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3">
                                    Close
                                </button>


                            </div>
                        </div>


                    </Modal>
                )}

            </div>
            )}
            <ToastContainer />
        </ThemeProvider>


    );
};

export default UserProfile;

