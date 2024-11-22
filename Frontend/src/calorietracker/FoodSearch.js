import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {AppBar, Button, Modal, Tab, Tabs} from "@mui/material";
import Navbar from "../dashboard/Navbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getUser, getToken } from "../utils";
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const FoodSearch = ({ onAddFood }) => {
    const [mealType, setMealType] = useState('');
    const [date, setDate] = useState('');
    const navigate = useNavigate()
    const [openAddModal,setOpenAddModal] = useState(false);
    const [value, setValue] = useState(0)

    useEffect(() => {
        // Get the query parameters from the URL
        let params = new URLSearchParams(window.location.search);
        let type = params.get('mealType');
        let d = params.get('date');
        setMealType(type);
        setDate(d);
    }, []); // Run once on component mount

    const [searchTerm, setSearchTerm] = useState('');
    const [nutritionInfo, setNutritionInfo] = useState([]);
    const [error, setError] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);
    const [servingSize, setServingSize] = useState(1); // Default serving size multiplier
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const user = getUser();
    const token = getToken();
    const id = user.id;

    const [customFood, setCustomFood] = useState([])

    let customFoodRequest = {
        user_id: user.id,
        food_name: "",
        calories: null,
        carbohydrates_total_g: null,
        fat_total_g: null,
        serving_size_g: null,
        protein_g: null,
        sodium_g: null,
        potassium_mg:null,
        cholesterol_mg:null,
        fiber_g:null,
        sugar_g:null

    }

    const handleAddFoodButton = () => {
        setOpenAddModal(true)
    }


    const handleSearchCustom = async () => {
        if (!searchTerm) return;

        const request = {
            user_id: user.id,
            food_name: searchTerm,
        }

        try{

            const response = await axios.get("http://localhost:8080/api/v1/customFood/getFood", {
                params: {
                    user_id: user.id,
                    food_name: searchTerm
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
        })

            if (response.status === 200){
                setCustomFood(response.data)
            }
        } catch(e){
            console.log(e.message)
        }



    }


    const handleSearch = async () => {
        if (!searchTerm) return;

        try {
            const response = await axios.get('https://api.calorieninjas.com/v1/nutrition?query=' + searchTerm, {
                headers: {
                    'X-Api-Key': 'BxNrG4yKvtMf5CLwRYactQ==2AWUmeWPdTQJ1Xa2',
                    'Content-Type': 'application/json',
                },
            });

            if (Array.isArray(response.data.items) && response.data.items.length > 0) {
                setNutritionInfo(response.data.items); // Update the state with the items array
                setError('');
            } else {
                setError('No results found.');
                setNutritionInfo([]);
            }
        } catch (err) {
            console.error(err); // Log the error for debugging
            setError('Error fetching data.');
            setNutritionInfo([]);
        }
    };

    const openModal = (food) => {
        console.log('Selected Food:', food); // Debugging line
        setSelectedFood(food);
        setServingSize(1); // Reset serving size
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedFood(null);
        setOpenAddModal(false);
        customFoodRequest = {
            user_id: user.id,
            food_name: "",
            calories: null,
            carbohydrates_total_g: null,
            fat_total_g: null,
            serving_size_g: null,
            protein_g: null,
            sodium_g: null,
            potassium_mg:null,
            cholesterol_mg:null,
            fiber_g:null,
            sugar_g:null

        }

    };

    const handleSelectFood = async (food) => {
        const foodRequest = {
            user_id: id,
            food_name: food.name,
            calories: food.calories,
            carbohydrates_total_g: food.carbohydrates_total_g,
            fat_total_g: food.fat_total_g,
            serving_size_g: food.serving_size_g,
            protein_g: food.protein_g,
            sodium_mg: food.sodium_mg,
            potassium_mg: food.potassium_mg,
            cholesterol_mg: food.cholesterol_mg,
            fiber_g: food.fiber_g,
            sugar_g: food.sugar_g,
            servings: 1.0,
            mealType: mealType,
            date: date,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/v1/food/addFood', foodRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Successfully added!"); // Show success notification
            }

        } catch (e) {
            console.log(e.message);
        }
    };

    const handleAddToLog = async () => {
        const foodRequest = {
            user_id: id,
            food_name: selectedFood.name,
            calories: selectedFood.calories,
            carbohydrates_total_g: selectedFood.carbohydrates_total_g,
            fat_total_g: selectedFood.fat_total_g,
            serving_size_g: selectedFood.serving_size_g,
            protein_g: selectedFood.protein_g,
            sodium_mg: selectedFood.sodium_mg,
            potassium_mg: selectedFood.potassium_mg,
            cholesterol_mg: selectedFood.cholesterol_mg,
            fiber_g: selectedFood.fiber_g,
            sugar_g: selectedFood.sugar_g,
            servings: servingSize,
            mealType: mealType,
            date: date,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/v1/food/addFood', foodRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Successfully added to log!"); // Show success notification
            }

        } catch (e) {
            console.log(e.message);
        }

        closeModal(); // Close modal after adding
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#1976d2',
            },
        },
    });

    const handleBackButton = () => {
        navigate("/trackcalories")
    }

    function handleTabChange(event, newValue) {
        setValue(newValue)
        setSearchTerm('')
        setNutritionInfo('')
        setCustomFood('')
    }


    const handleSubmitNewFood = async() => {

       try{
           const response = await axios.post("http://localhost:8080/api/v1/customFood/createFood", customFoodRequest, {
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`,
               }
           })

           if(response.status === 200){
               toast.success("Successfully added!");
               closeModal()
           }
       } catch(e){
           console.log(e.message);
        }



    }




    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" className="bg-blue-600">
                <Navbar/>
            </AppBar>
            <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow-md">

                <Tabs value={value} onChange={handleTabChange} aria-label="settings tabs">
                    <Tab label="Database"/>
                    <Tab label="My Foods"/>
                </Tabs>
                {value === 0 && (
                    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center">Search for Food for {mealType}</h2>
                        <input
                            type="text"
                            placeholder="Search for food..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded mb-4"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-700"
                        >
                            Search
                        </button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {nutritionInfo.length > 0 && (
                            <ul className="mt-6">
                                {nutritionInfo.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center p-2 border-b">
                                        <span>{item.name} - {item.calories} cal</span>
                                        <div>
                                            <button
                                                onClick={() => openModal(item)} // Open modal on button click
                                                className="bg-blue-500 text-white p-1 rounded hover:bg-blue-700 mr-2"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleSelectFood(item)} // Call handleSelectFood on button click
                                                className="bg-green-500 text-white p-1 rounded hover:bg-green-700"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        )}
                        <Button variant="contained" color="primary" sx={{mt: 2}}
                                className="bg-blue-600 hover:bg-blue-700 transition duration-200 flexbox justify-center"
                                onClick={handleBackButton}>
                            Back
                        </Button>
                    </div>
                )}
                {value === 1 && (
                    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center">Search for Food for {mealType}</h2>
                        <div className="flex space-x-4 mb-4">
                            <input
                                type="text"
                                placeholder="Search for food..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded"
                            />

                            <button
                                onClick={handleAddFoodButton}
                                className="bg-blue-500 text-white p-2 rounded w-100 hover:bg-blue-700 flexbox justify-right"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleSearchCustom}
                            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-700 flexbox justify-left"
                            >
                                Search
                            </button>


                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {customFood.length > 0 && (
                            <ul className="mt-6">
                                {customFood.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center p-2 border-b">
                                        <span>{item.name} - {item.calories} cal</span>
                                        <div>
                                            <button
                                                onClick={() => openModal(item)} // Open modal on button click
                                                className="bg-blue-500 text-white p-1 rounded hover:bg-blue-700 mr-2"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleSelectFood(item)} // Call handleSelectFood on button click
                                                className="bg-green-500 text-white p-1 rounded hover:bg-green-700"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        )}

                    </div>

                )}

                {/* Modal for food details */}
                {selectedFood && modalIsOpen && (
                    <Modal
                        open={modalIsOpen}
                        onClose={closeModal}
                        aria-labelledby="food-details-title"
                        aria-describedby="food-details-description"
                    >
                        <div className="modal-content">
                            <h2 id="food-details-title" className="modal-header">{selectedFood.name}</h2>
                            <div className="modal-body">
                                <p>Calories: {selectedFood.calories}</p>
                                <p>Serving Size: {selectedFood.serving_size_g} g</p>
                                <p>Fat: {selectedFood.fat_total_g} g</p>
                                <p>Protein: {selectedFood.protein_g} g</p>
                                <p>Carbohydrates: {selectedFood.carbohydrates_total_g} g</p>

                                <div className="mt-4">
                                    <label className="block mb-2">Adjust Serving Size:</label>
                                    <input
                                        type="number"
                                        value={servingSize}
                                        onChange={(e) => setServingSize(e.target.value)}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1" // Minimum serving size
                                        step="0.1" // Allow decimal inputs
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={handleAddToLog}
                                    className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
                                >
                                    Add to Log
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Modal for adding custom foods to user database*/}
                {openAddModal && (
                    <Modal
                        open={openAddModal}
                        onClose={closeModal}
                        aria-labelledby="food-details-title"
                        aria-describedby="food-details-description"
                        sx={{overflowY: 'scroll'}} disableScrollLock={false}
                    >
                        <div className="modal-content">
                            <h2 id="food-details-title" className="modal-header font-bold text-center mt-4">Add Custom Food</h2>
                            <div className="grid gap-6 mb-6 md:grid-cols-2">

                                <div className="required">
                                    <label htmlFor="foodname"
                                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Name</label>
                                    <input
                                        type="text"
                                        id="food_name"
                                        onChange={(e) => customFoodRequest.food_name = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full "
                                    />
                                </div>


                                <div>
                                    <label htmlFor="calories"
                                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Calories</label>
                                    <input
                                        type="number"
                                        id="calories"
                                        onChange={(e) => customFoodRequest.calories = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fat"
                                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Fat</label>
                                    <input
                                        type="number"
                                        id="fat"
                                        onChange={(e) => customFoodRequest.fat_total_g = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="protein"
                                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Protein</label>
                                    <input
                                        type="number"
                                        id="protein"
                                        onChange={(e) => customFoodRequest.protein_g = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="carbs"
                                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Carbohydrates</label>
                                    <input
                                        type="number"
                                        id="carbs"
                                        onChange={(e) => customFoodRequest.carbohydrates_total_g = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="sodium"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Sodium</label>
                                    <input
                                        type="number"
                                        id="sodium"
                                        onChange={(e) => customFoodRequest.sodium_g = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="potassium"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Potassium</label>
                                    <input
                                        type="number"
                                        id="potassium"
                                        onChange={(e) => customFoodRequest.potassium_mg = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cholesterol"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Cholesterol</label>
                                    <input
                                        type="number"
                                        id="cholesterol"
                                        onChange={(e) => customFoodRequest.cholesterol_mg = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fiber"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Fiber</label>
                                    <input
                                        type="number"
                                        id="fiber"
                                        onChange={(e) => customFoodRequest.fiber_g = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="sugar"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Sugar</label>
                                    <input
                                        type="number"
                                        id="sugar"
                                        onChange={(e) => customFoodRequest.sugar_g = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1"
                                        step="0.1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="serving_size"
                                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Serving
                                        Size</label>
                                    <input
                                        type="number"
                                        id="serving_size"
                                        onChange={(e) => customFoodRequest.serving_size_g = e.target.value}
                                        className="border border-gray-300 p-2 rounded w-full"
                                        min="0.1"
                                        step="0.1"
                                    />


                                </div>

                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={handleSubmitNewFood}
                                    className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

            </div>


                <ToastContainer/>

        </ThemeProvider>
);
};

export default FoodSearch;


