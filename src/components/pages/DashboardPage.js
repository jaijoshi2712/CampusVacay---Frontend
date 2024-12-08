import React, { useState, useEffect } from 'react';
import { Form } from 'react-router-dom';
import { Search, MapPin, Star, Navigation, Calendar, Users } from 'lucide-react';
import { FaBell } from 'react-icons/fa';

const Rooms = () => {
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [editId, setEditId] = useState(0);
    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        const fetchRooms = async () => {
          try {
            const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/rooms/', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('authToken'),
              }
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            //console.log(data);
            setRoomData(data); // Set the fetched data to state
          } catch (error) {
            setError(error.message); // Handle errors
          } finally {
            setLoading(false); // Always set loading to false when request finishes
          }
        };
    
        fetchRooms();
      }, []);

    const [createOpen, setCreateOpen] = useState(false); 
    const [editOpen, setEditOpen] = useState(0); 
    const [deleteOpen, setDeleteOpen] = useState(0); 
    const openCreate = () => {
        setCreateOpen(true);
        setCreateRoom({
            'room_type': '',
            'number_of_rooms': '',
            'price_per_night': '',
            'facilities': '',
            'breakfast_included': false,
            'room_size': '',
            'max_occupancy': '',
            'smoking_allowed': false,
        })
    }
    const closeCreate = () => setCreateOpen(false);

    const openEdit = (id, index) => {
        const selectedItem = roomData.find(item => item.id === id);
        setEditOpen(id);
        setEditId(index);
        setCreateRoom({
            'room_type': selectedItem.room_type,
            'number_of_rooms': selectedItem.number_of_rooms,
            'price_per_night': selectedItem.price_per_night,
            'facilities': selectedItem.facilities,
            'breakfast_included': selectedItem.breakfast_included,
            'room_size': selectedItem.room_size,
            'max_occupancy': selectedItem.max_occupancy,
            'smoking_allowed': selectedItem.smoking_allowed,
        })

        //const files = Array.from(createRoom.images); // 獲取選擇的文件
        //const imageUrls = files.map(file => URL.createObjectURL(file)); // 生成圖片的 URL
        //setSelectedImages(prevImages => [...prevImages, ...imageUrls]);
    }
    const closeEdit = () => setEditOpen(0);
    const openDelete = (id, index) => {
        setDeleteOpen(id);
        setDeleteId(index);
    }
    const closeDelete = () => setDeleteOpen(0);
  
    const [createRoom, setCreateRoom] = useState({
        'room_type':'',
        'number_of_rooms':'',
        'price_per_night':'',
        'facilities':'',
        'breakfast_included':false,
        'room_size':'',
        'max_occupancy':'',
        'smoking_allowed':false,
    })

    const [selectedImages, setSelectedImages] = useState([]); // 存儲已上傳的圖片


    const handleSubmit = async (e, mode, id) => {
        const { name, value, type, files } = e.target;

        e.preventDefault();
        //console.log(mode, id);
        const room_id = id;
        const requestBody = {
            room_type:createRoom.room_type,
            number_of_rooms:createRoom.number_of_rooms,
            price_per_night:createRoom.price_per_night,
            facilities:createRoom.facilities,
            breakfast_included:createRoom.breakfast_included,
            room_size:createRoom.room_size,
            max_occupancy:createRoom.max_occupancy,
            smoking_allowed:createRoom.smoking_allowed,
        };
        //console.log(requestBody);
        if(mode=='create'){
            try {
                const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/rooms/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem('authToken'),
                    },
                    body: JSON.stringify(requestBody),
                });
                const data = await response.json();
                //console.log(data);
                if (!response.ok) {
                    throw new Error(data.detail || 'Create failed');
                }
                setMessage({ type: 'success', content: 'Room Created successfully!' });
                // Update the current page's state instead of navigating
                setTimeout(() => {
                    window.location.reload();
                    setMessage({type: '', content: ''});
                }, 5000);
            } catch (error) {
                //setError('Failed to create. Please try again.');
                setMessage({ type: 'error', content: error.message });
                setTimeout(() => {
                    setMessage({type: '', content: ''});
                }, 5000);
            }
        }else if(mode=='edit'){
            try {
                //console.log(requestBody);
                const response = await fetch(`http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/rooms/${id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem('authToken'),
                    },
                    body: JSON.stringify(requestBody),
                });
                const data = await response.json();
                //console.log(data);
                if (!response.ok) {
                  throw new Error(data.detail || 'Edit failed');
                }
                setMessage({ type: 'success', content: 'Room Edited successfully!' });
                // Update the current page's state instead of navigating
                setTimeout(() => {
                    window.location.reload();
                    setMessage({type: '', content: ''});
                }, 5000);
            } catch (error) {
            //setError('Failed to edit. Please try again.');
            setMessage({ type: 'error', content: error.message });
            setTimeout(() => {
                setMessage({type: '', content: ''});
            }, 5000);
            } 
        }else if(mode=='delete'){
            try {
                const response = await fetch(`http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/rooms/${id}/`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('authToken'),
                  },
                  body: JSON.stringify(''),
                });
                //const data = await response.json();
                //console.log(data);
                //if (!response.ok) {
                //  throw new Error(data.detail || 'Delete failed');
                //}
                // Update the current page's state instead of navigating
                setMessage({ type: 'success', content: 'Room Deleted successfully!' });
                setTimeout(() => {
                    window.location.reload();
                    setMessage({type: '', content: ''});
                }, 5000);
            } catch (error) {
            //setError('Failed to delete. Please try again.');
            setMessage({ type: 'error', content: error.message });
            setTimeout(() => {
                setMessage({type: '', content: ''});
            }, 5000);
            }
        }

        setCreateOpen(false);
        setEditOpen(false);
        setDeleteOpen(false);
        setCreateRoom({
            ...createRoom,
            [name]: type === 'file' ? selectedImages : value
        });
    };
    const handleChange = (e) => {
        const { name, value, type, files,checked } = e.target;
        setCreateRoom({
        ...createRoom,
        [name]: type === 'checkbox' ? checked : value
        });

    }

    const handleImages = (e) => {
        const files = Array.from(e.target.files); // 獲取選擇的文件
        const imageUrls = files.map(file => URL.createObjectURL(file)); // 生成圖片的 URL
        setSelectedImages(prevImages => [...prevImages, ...imageUrls]); // 更新狀態
        //console.log(imageUrls);
    }

    const handleImageDelete = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index)); // 刪除指定的圖片
    };

    if(loading){
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen">
            {message.content && (
                <div className={`fixed top-16 right-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.content}
                </div>
            )}
            <div className="flex justify-end px-5">
                <button onClick={openCreate} className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    +
                </button>
                {createOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded shadow-lg p-6 max-h-screen w-2/3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold mb-4">Create Room</h2>
                            <button onClick={closeCreate} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                            X
                            </button>
                        </div>
                        <form onSubmit={(e) => handleSubmit(e, 'create', 0)}>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="room_type">
                                    Room Type
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="room_type" name="room_type" type="text" value={createRoom.room_type}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="number_of_rooms">
                                    Number of Rooms
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="number_of_rooms" name="number_of_rooms" type="text" value={createRoom.number_of_rooms}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="price_per_night">
                                    Price per Night
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="price_per_night" name="price_per_night" type="text" value={createRoom.price_per_night}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="facilities">
                                    Facilities
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="facilities" name="facilities" type="text" value={createRoom.facilities}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="breakfast_included">
                                    Breakfast Included?
                                </label>
                                <input
                                    className="shadow border rounded w-6 h-6 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="breakfast_included" name="breakfast_included" type="checkbox" checked={createRoom.breakfast_included}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="room_size">
                                    Room Size
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="room_size" name="room_size" type="text" value={createRoom.room_size}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="max_occupancy">
                                    Max Occupancy
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="max_occupancy" name="max_occupancy" type="text" value={createRoom.max_occupancy}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="smoking_allowed">
                                    Smoking Allowed?
                                </label>
                                <input
                                    className="shadow border rounded w-6 h-6 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="smoking_allowed" name="smoking_allowed" type="checkbox" checked={createRoom.smoking_allowed}/>
                            </div>
                            {/*<div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="smoking_allowed">
                                    Upload Images
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    multiple accept="image/png, image/jpeg, application/pdf" onChange={handleImages} id="images" name="images" type="file"/>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {selectedImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Uploaded ${index}`}
                                        className="w-32 h-32 object-cover border border-gray-300 rounded"
                                    />
                                    <div
                                    onClick={() => handleImageDelete(index)} // 刪除圖片
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                                    >
                                    ✕
                                    </div>
                                </div>
                                ))}
                            </div>*/}

                            <div className="flex justify-end">
                                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                    </div>
                )}
                {editOpen!=0 && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded shadow-lg p-6 max-h-screen w-2/3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold mb-4">Edit Room {editId}</h2>
                            <button onClick={closeEdit} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                            X
                            </button>
                        </div>
                        <form onSubmit={(e) => handleSubmit(e, 'edit', editOpen)}>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="room_type">
                                    Room Type
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="room_type" name="room_type" type="text" value={createRoom.room_type}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="number_of_rooms">
                                    Number of Rooms
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="number_of_rooms" name="number_of_rooms" type="text" value={createRoom.number_of_rooms}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="price_per_night">
                                    Price per Night
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="price_per_night" name="price_per_night" type="text" value={createRoom.price_per_night}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="facilities">
                                    Facilities
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="facilities" name="facilities" type="text" value={createRoom.facilities}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="breakfast_included">
                                    Breakfast Included
                                </label>
                                <input
                                    className="shadow border rounded w-6 h-6 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="breakfast_included" name="breakfast_included" type="checkbox" checked={createRoom.breakfast_included}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="room_size">
                                    Room Size
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="room_size" name="room_size" type="text" value={createRoom.room_size}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="max_occupancy">
                                    Max Occupancy
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="max_occupancy" name="max_occupancy" type="text" value={createRoom.max_occupancy}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-md font-bold" htmlFor="smoking_allowed">
                                    Smoking Allowed
                                </label>
                                <input
                                    className="shadow border rounded w-6 h-6 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="smoking_allowed" name="smoking_allowed" type="checkbox" checked={createRoom.smoking_allowed}/>
                            </div>
                            {/*<div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="smoking_allowed">
                                    Upload Images
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    multiple accept="image/png, image/jpeg, application/pdf" onChange={handleImages} id="images" name="images" type="file" value={createRoom.images}/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {selectedImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Uploaded ${index}`}
                                        className="w-32 h-32 object-cover border border-gray-300 rounded"
                                    />
                                    <div
                                    onClick={() => handleImageDelete(index)} // 刪除圖片
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                                    >
                                    ✕
                                    </div>
                                </div>
                                ))}
                            </div>*/}
                            <div className="flex justify-end">
                                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                    </div>
                )}
                {deleteOpen!=0 && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded shadow-lg p-6 max-h-screen w-2/3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold mb-4">Delete Room {deleteId}</h2>
                            <button onClick={closeDelete} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                            X
                            </button>
                        </div>
                        <div className="text-xl">Are you sure to delete room {deleteId}?</div>
                        <div className="flex justify-end pt-2">
                            <button onClick={(e) => handleSubmit(e, 'delete', deleteOpen)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                                Delete
                            </button>
                            <button onClick={closeDelete} className="mx-2 px-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                                Cancel
                            </button>
                        </div>
                    </div>
                    </div>
                )}
            </div>
            <div className='p-3 m-3 min-h-screen bg-white'>
                <div>
                    <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] items-center gap-2 p-2 bg-white rounded-md shadow-md hover:bg-gray-200 transition">
                        <div className="text-center">#</div>
                        <div className="text-center">Room Type</div>
                        <div className="text-center">Number of Rooms</div>
                        <div className="text-center">Price per Night</div>
                    </div>
                    
                    {roomData &&roomData.length>0 ?(
                    roomData.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] items-center gap-2 p-2 my-2 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition">
                        <div className="text-center">{index+1}</div>
                        <div className="text-center">{item.room_type}</div>
                        <div className="text-center">{item.number_of_rooms}</div>
                        <div className="text-center">{item.price_per_night}</div>
                        <div className="flex justify-center">
                            <button onClick={()=>openEdit(item.id, index+1)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Edit
                            </button>
                            <button onClick={()=>openDelete(item.id, index+1)} className="ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    </div>
                    
                    ))):(<div>No Rooms Yet!</div>)}
                </div>
            </div>
        </div>
    )
};

const Details = ({item}) => {
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        room_number: item.room_number,
        checked_in: item.checked_in,
        damage_report: item.damage_report,
        additional_charges: item.additional_charges,
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(item.id);
        try {
            const response = await fetch(`http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/reservations/${item.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('authToken'),
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            //console.log(data);
            if (!response.ok) {
                throw new Error(data.detail || 'Create failed');
            }
            // Update the current page's state instead of navigating
            window.location.reload();
        } catch (error) {
            setError('Failed to create. Please try again.');
        }
    };
    const handleChange = (e) => {
        const { name, value, type, files,checked } = e.target;
        //need change
        setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
        });
    }
    return (
        <div>
            <div className="flex">
                <div className="w-1/2 h-full border rounded m-2">
                    <div className="flex border-b items-center">
                        <label className="whitespace-nowrap w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                            First Name:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            {item.first_name}
                        </span>
                    </div>
                    <div className="flex border-b items-center">
                        <label className="whitespace-nowrap w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                            Last Name:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            {item.last_name}
                        </span>
                    </div>
                    <div className="flex border-b items-center">
                        <label className="w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                            Guests:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            {item.guests}
                        </span>
                    </div>
                    <div className="flex border-b items-center">
                        <label className="w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                            Email:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            {item.email}
                        </span>
                    </div>
                    <div className="flex border-b items-center">
                        <label className="whitespace-nowrap w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                            Phone No:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            {item.phone_number}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                            Payment:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            {item.payment_mode}
                        </span>
                    </div>
                </div>
                <div className="w-1/2 h-full border rounded m-2">
                    <div className="flex border-b items-center">
                        <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                            Check In Date:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            {item.check_in_date}
                        </span>
                    </div>
                    <div className="flex border-b items-center">
                        <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                            Check Out Date:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            {item.check_out_date}
                        </span>
                    </div>
                    <div className="flex border-b items-center">
                        <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                            Expected Arrival Time:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            {item.expected_arrival_time}
                        </span>
                    </div>
                    <div className="flex border-b items-center">
                        <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                            Special Requests:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            {item.special_requests}
                        </span>
                    </div>
                    {/*<div className="flex border-b items-center">
                        <label className="w-1/2 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                            Cancelled?
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            1
                        </span>
                    </div>
                    <div className="flex border-b items-center">
                        <label className="w-1/2 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                            Cancellation Date:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            1
                        </span>
                    </div>
                    <div className="flex border-b items-center">
                        <label className="w-1/2 whitespace-nowrap p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                            Cancellation Reason:
                        </label>
                        <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                            1
                        </span>
                    </div>*/}
                </div>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additional_charges">
                        Additional Charges
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        onChange={handleChange} id="additional_charges" name="additional_charges" type="text" value={formData.additional_charges}/>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="damage_report">
                        Damage Report
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        onChange={handleChange} id="damage_report" name="damage_report" value={formData.damage_report}/>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room_number">
                        Room Number
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        onChange={handleChange} id="room_number" name="room_number" type="text" value={formData.room_number}/>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="smoking_allowed">
                        Checked In?
                    </label>
                    <input
                        className="shadow border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={handleChange} id="checked_in" name="checked_in" type="checkbox" checked={formData.checked_in}/>
                </div>
                
                
                <div className="flex justify-end">
                    <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}

const Reservations = () => {
    const [reservationData, setReservationData] = useState([]);
    const [initialOrders, setInitialOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allRoomTypes, setAllRoomTypes] = useState([]);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    const [startDate, setStartDate] = useState(formattedDate);

    useEffect(() => {
        const fetchReservations = async () => {
          try {
            const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/hotel/reservations/', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('authToken'),
              }
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            //console.log(data);
            setReservationData(data);
            console.log(data);
            data.forEach(d => {
                const orderDate1 = new Date(d.check_in_date);
                const orderDate2 = new Date(d.check_out_date);
                const today = new Date(startDate);
                //console.log(orderDate1,orderDate2,today);
                if(orderDate1<=today && orderDate2>=today){
                    console.log(d);
                    setFilteredOrders(prev=>[...prev, d]);
                    setInitialOrders(prev=>[...prev, d]);
                }
            });
          } catch (error) {
            setError(error.message); // Handle errors
          } finally {
            setLoading(false); // Always set loading to false when request finishes
          }
        };
        fetchReservations();
        const fetchRooms = async () => {
            try {
              const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/rooms/', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Token ' + localStorage.getItem('authToken'),
                }
              });
      
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const data = await response.json();
              //console.log(data);
              data.forEach(item => {
                if(!allRoomTypes.includes(item.room_type)){
                    //console.log(item.room_type);
                    setAllRoomTypes(prev=>[...prev, item.room_type]);
                }
              });
              //setRoomData(data); // Set the fetched data to state
            } catch (error) {
              setError(error.message); // Handle errors
            } finally {
              setLoading(false); // Always set loading to false when request finishes
            }
          };
      
          fetchRooms()
      }, []);

    const [editOpen, setEditOpen] = useState(0); 

    const openEdit = (id) => {
        //const selectedItem = items.find(item => item.id === id);
        setEditOpen(id);
        //not done
        //const files = Array.from(createRoom.images); // 獲取選擇的文件
        //const imageUrls = files.map(file => URL.createObjectURL(file)); // 生成圖片的 URL
        //setSelectedImages(prevImages => [...prevImages, ...imageUrls]);
    }
    const closeEdit = () => setEditOpen(0);
    

    

    // Handler to filter orders based on the date range
    const filterOrders = () => {
        if (!startDate) {
            setFilteredOrders(initialOrders);
            return;
        }
        if (statusOption=='') {
            const filtered = reservationData.filter((item) => {
                const orderDate1 = new Date(item.check_in_date);
                const orderDate2 = new Date(item.check_out_date);
                return (selectedOption=='' ? 1:item.room_type==selectedOption) &&
                orderDate1 <= new Date(startDate) && orderDate2 >= new Date(startDate);
            });
            setFilteredOrders(filtered);
        }else if (statusOption=='canceled') {
            const filtered = reservationData.filter((item) => {
                const orderDate1 = new Date(item.check_in_date);
                const orderDate2 = new Date(item.check_out_date);
                return (selectedOption=='' ? 1:item.room_type==selectedOption) &&
                item.canceled && orderDate1 <= new Date(startDate) && orderDate2 >= new Date(startDate);
            });
            setFilteredOrders(filtered);
        }else if (statusOption=='paid') {
            const filtered = reservationData.filter((item) => {
                const orderDate1 = new Date(item.check_in_date);
                const orderDate2 = new Date(item.check_out_date);
                return (selectedOption=='' ? 1:item.room_type==selectedOption) &&
                item.payment_status=='Paid' && orderDate1 <= new Date(startDate) && orderDate2 >= new Date(startDate);
            });
            setFilteredOrders(filtered);
        }else if (statusOption=='checkedIn') {
            const filtered = reservationData.filter((item) => {
                const orderDate1 = new Date(item.check_in_date);
                const orderDate2 = new Date(item.check_out_date);
                return (selectedOption=='' ? 1:item.room_type==selectedOption) &&
                item.checked_in && orderDate1 <= new Date(startDate) && orderDate2 >= new Date(startDate);
            });
            setFilteredOrders(filtered);
        }
        /*else if (statusOption=='finished') {
            const filtered = reservationData.filter((item) => {
                const orderDate1 = new Date(item.check_in_date);
                const orderDate2 = new Date(item.check_out_date);
                const today = new Date();
                return (selectedOption=='' ? 1:item.room_type==selectedOption) &&
                !item.canceled && orderDate2 < today && orderDate1 <= new Date(startDate) && orderDate2 >= new Date(startDate);
            });
            setFilteredOrders(filtered);
        }*/
    };

    const [filterBy, setFilterBy] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [statusOption, setStatusOption] = useState('');
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleStatusChange = (event) => {
        setStatusOption(event.target.value);
    };

    const filteredItems = () => {
        
    };

    const clear = () => {        
        setFilteredOrders(initialOrders);
        setStartDate('');
        setSelectedOption('');
        setStatusOption('');
    }
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="min-h-screen">
            <div>
                <div className="p-3 flex items-center">
                    <div htmlFor="start-date" className="px-3 block text-xl text-gray-700">
                        Select a Date: 
                    </div>
                    <div className="w-1/4">
                        <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                
                    <div htmlFor="start-date" className="px-3 block text-xl text-gray-700">
                        Room Type: 
                    </div>
                    <div className="w-1/4">
                        <select value={selectedOption} onChange={handleSelectChange}
                            className="mt-1 block w-full px-1 py-2 border text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Type(Optional)</option>
                            {allRoomTypes.map((item) => (
                                <option value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div>
                <div className="p-3 flex items-center">
                    <div htmlFor="start-date" className="px-3 block text-xl text-gray-700">
                        Status: 
                    </div>
                    <div className="w-1/4">
                        <select value={statusOption} onChange={handleStatusChange}
                            className="mt-1 block w-full px-1 py-2 border text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Status(Optional)</option>
                            <option value="canceled">Cancelled</option>
                            <option value="paid">Paid</option>
                            <option value="checkedIn">Checked-In</option>
                            {/*<option value="finished">Finished</option>*/}
                        </select>
                    </div>
                    <div className="mx-2">
                        <button
                            onClick={filterOrders}
                            className="w-full py-2 px-4 mx-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Filter
                        </button>
                    </div>
                    <div className="mx-2">
                        <button
                            onClick={clear}
                            className="w-full py-2 px-4 mx-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            <div className='p-3 m-3 min-h-screen bg-white'>
                <div>
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 p-2 bg-white rounded-md shadow-md hover:bg-gray-200 transition">
                        <div className="text-center">#</div>
                        <div className="text-center">Check-in date</div>
                        <div className="text-center">Check-out date</div>
                        <div className="text-center">Name</div>
                        <div className="text-center">Phone</div>
                        <div className="text-center">Status</div>
                        <div className="text-center">Details</div>
                    </div>
                    { filteredOrders && filteredOrders.length>0 ?( 
                    filteredOrders.map(item => (
                    <div key={item.id} className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 p-2 my-2 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition">
                        <div className="text-center">{item.id}</div>
                        <div className="text-center">{item.check_in_date}</div>
                        <div className="text-center">{item.check_out_date}</div>
                        <div className="text-center">{item.first_name} {item.last_name}</div>
                        <div className="text-center">{item.phone_number}</div>
                        {item.canceled ? (
                        <div className="text-center">
                            Cancelled
                        </div>
                        ): item.Paid ? (
                        <div className="text-center">
                            Paid
                        </div>
                        ):(
                        <div className="text-center">
                            Checked-In
                        </div>
                        )}
                        <div className="text-center">
                            <button onClick={()=>openEdit(item.id)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Edit
                            </button>
                        </div>
                        {editOpen!=0 && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded shadow-lg p-6 max-h-screen w-4/5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold mb-4">Details for reservation at {item.hotel_name}, {item.room_type}</h2>
                                    <button onClick={closeEdit} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                                    X
                                    </button>
                                </div>
                                <Details item={item}/>
                            </div>
                            </div>
                        )}
                    </div>

                    
                    
                    ))):(<div>No Reservations For Today!</div>)}
                </div>
                
            </div>
        </div>
    )
};


const Reviews = () => {
    const [reviewData, setReviewData] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noReviews, setNoReviews] = useState(false);
    
    useEffect(() => {
        const fetchReviews = async () => {
          try {
            const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/reviews/', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('authToken'),
              }
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setReviewData(data);
            //console.log(data);
          } catch (error) {
            setError(error.message); // Handle errors
          } finally {
            setLoading(false); // Always set loading to false when request finishes
          }
        };
        fetchReviews();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='min-h-screen'>
            <div className='p-3 m-3 min-h-screen bg-white'>
                <div>
                    <div className="grid grid-cols-6 p-2 bg-white rounded-md shadow-md hover:bg-gray-200 transition">
                        <div>#</div>
                        <div className="col-span-5">Comments</div>
                    </div>
                    { reviewData && reviewData.length > 0 ?(
                    reviewData.map((item, index0) => (
                    <div key={item.id} className="grid grid-cols-6 p-2 my-2 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition">
                        <div>{index0+1}</div>
                        <div className="col-span-5">
                            <div className="flex space-x-1">
                                {Array.from({ length: 5 }, (_, index) => {
                                    const starValue = index + 1;
                                    return (
                                    <span
                                        key={starValue}
                                        className={`text-2xl ${
                                        starValue <= item.rating ? 'text-yellow-500' : 'text-gray-400'
                                        }`}
                                    >
                                        ★
                                    </span>
                                    );
                                })}
                            </div>
                            <div className="pt-2">
                                <input disabled className="bg-white w-full p-2" value={item.review}/>
                            </div>
                        </div>
                    </div>
                    
                    ))):(<div>No Reviews Yet!</div>)}
                    

                </div>
            </div>
        </div>
    )
};


const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState([]);
    const [item,setItem] = useState([]);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [message, setMessage] = useState({ type: '', content: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
              const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/hotel/hotel-profile/', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Token ' + localStorage.getItem('authToken'),
                }
              });
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const data = await response.json();
              console.log(data);
              setProfile({
                username: data.user.username,
                email: data.user.email,
                hotel_name: data.hotel_name,
                address: data.address1,
                location: data.address2,
                city: data.city,
                country: data.country,
                phone_number: data.phone_number,
                description: data.description,
                facilities: data.facilities,
                check_in_time: data.check_in_time,
                check_out_time: data.check_out_time,
                cancellation_policy: data.cancellation_policy,
                student_discount: data.student_discount,
                special_offers: data.special_offers,
            });
              setItem({
                username: data.user.username,
                email: data.user.email,
                hotel_name: data.hotel_name,
                address: data.address1,
                location: data.address2,
                city: data.city,
                country: data.country,
                phone_number: data.phone_number,
                description: data.description,
                facilities: data.facilities,
                check_in_time: data.check_in_time,
                check_out_time: data.check_out_time,
                cancellation_policy: data.cancellation_policy,
                student_discount: data.student_discount,
                special_offers: data.special_offers,
            });
            } catch (error) {
              setError(error.message); // Handle errors
            } finally {
              setLoading(false); // Always set loading to false when request finishes
            }
          };
      
          fetchProfile();
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleReadOnly();
        const formData = {
            username: item.username,
            email: item.email,
            hotel_name: item.hotel_name,
            address: item.address1,
            location: item.address2,
            city: item.city,
            country: item.country,
            phone_number: item.phone_number,
            description: item.description,
            facilities: item.facilities,
            check_in_time: item.check_in_time,
            check_out_time: item.check_out_time,
            cancellation_policy: item.cancellation_policy,
            student_discount: item.student_discount,
            special_offers: item.special_offers,
        };

        try {
            const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/hotel/hotel-profile/', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('authToken'),
              },
              body: JSON.stringify(formData),
            });
      
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.detail || 'edit failed');
            }
            setMessage({ type: 'success', content: 'Profile Edited successfully!' });
            setTimeout(() => {
                setMessage({type: '', content: ''});
            }, 5000);
        }catch (error) {
            setMessage({ type: 'error', content: error.message });
            setTimeout(() => {
                setMessage({type: '', content: ''});
            }, 5000);
        }
    };

    const handleChange = (e) => {
        setItem({
        ...item,
        [e.target.name]: e.target.value
        });
    }

    const handleCancel = () => {
        setItem(profile);
        toggleReadOnly();
    }

    const toggleReadOnly = () => {
        setIsReadOnly((prev) => !prev);
    };

    return (
        
        <div className="min-h-screen">
            {message.content && (
                <div className={`z-10 fixed top-16 right-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.content}
                </div>
            )}
            <div className="flex justify-between items-center text-2xl pt-4 px-5">
                Hotel Profile
            </div>
            <div className="relative px-5">
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="username" name="username" type="text" value={item.username}/>
                </div>
                {/*<div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="password" name="password" type="text" value={item.password}/>
                </div>*/}
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="email">
                        E-mail
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="email" name="email" type="text" value={item.email}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="hotel_name">
                        Hotel Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="hotel_name" name="hotel_name" type="text" value={item.hotel_name}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="address">
                        Address
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="address" name="address" type="text" value={item.address}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="location">
                        Location
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="location" name="location" type="text" value={item.location}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="city">
                        City
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="city" name="city" type="text" value={item.city}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="country">
                        Country
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="country" name="country" type="text" value={item.country}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="phone_number">
                        Phone Number
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="phone_number" name="phone_number" type="text" value={item.phone_number}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="description" name="description" value={item.description}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="facilities">
                        Facilities
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="facilities" name="facilities" value={item.facilities}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="check_in_time">
                        Check-in Time
                    </label>
                    <input
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="check_in_time" name="check_in_time" type="time" value={item.check_in_time}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="check_out_time">
                        Check-out Time
                    </label>
                    <input
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="check_out_time" name="check_out_time" type="time" value={item.check_out_time}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="cancellation_policy">
                        Cancellation Policy
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="cancellation_policy" name="cancellation_policy" value={item.cancellation_policy}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="student_discount">
                        Student Discount
                    </label>
                    <input
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="student_discount" name="student_discount" type="number" value={item.student_discount}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="special_offers">
                        Special Offers
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="special_offers" name="special_offers" type="text" value={item.special_offers}/>
                </div>
                {isReadOnly && (
                <div className="flex justify-end p-3">
                    <button onClick={toggleReadOnly} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Edit
                    </button>
                </div>
                )}
                {!isReadOnly && (
                <div className="flex justify-end p-3">
                    <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Save
                    </button>
                    <button onClick={handleCancel} className="mx-2 p-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                        Cancel
                    </button>
                </div>
                )}
            </form>
            </div>
        </div>
    )
}

const NotificationBell = ({init}) => {
    const [hasNotification, setHasNotification] = useState(false);
    const [reservationData, setReservationData] = useState([]);
    const [newData, setNewData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    // Example: Simulating new notifications after a delay (replace with your actual logic)

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/hotel/reservations/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem('authToken'),
                    }
                });
        
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('fetching', data);
                if (data.length > init.length) {
                    setNewData(true);
                }
                //setUpdateData(data);
                //console.log(data);
                //console.log(updateData);
                /*data.forEach(d => {
                    console.log(d,reservationData);
                    console.log(reservationData.includes(d));
                    if (!reservationData.includes(d)) {
                        setUpdateData(prev=>[...prev, d]);
                        setReservationData(prev=>[...prev, d]);
                        setHasNotification(true);
                    }
                });*/
              } catch (error) {
                //setError(error.message); // Handle errors
              } 
            };
          //fetchUpdates();
          const intervalId = setInterval(fetchUpdates, 10000);
      //return () => clearTimeout(timer);
    }, []);
  
    // Inline styles
    const bellStyle = {
      position: 'relative',
      display: 'inline-block',
      fontSize: '32px',
      color: '#333',
    };
  
    const notificationDotStyle = {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      width: '10px',
      height: '10px',
      backgroundColor: 'red',
      borderRadius: '50%',
      border: '2px solid white', // Creates a border around the dot
    };
    const toggleDropdown = () => {
        setHasNotification(false);
        setIsOpen(prevState => !prevState);
    };
    const toReservations = () => {
        localStorage.setItem('currentPage', 'reservations');
        window.location.reload();
    }

    return (
        <div>
            <div className="p-1 mr-5" onClick={toggleDropdown} style={bellStyle}>
                <FaBell size={32} color="#333" />
                {hasNotification && <span style={notificationDotStyle}></span>}
                {isOpen && (
                <div className="w-40 absolute bg-white border rounded right-0 text-sm">
                    {newData ?
                        <span onClick={toReservations}>You have new reservation!</span>:
                        <span>No new reservation!</span>
                    }
                </div>
                )}
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const [page, setPage] = useState('profile');
    const [reservationData, setReservationData] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
              const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/hotel/reservations/', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Token ' + localStorage.getItem('authToken'),
                }
              });
      
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
      
              const data = await response.json();
              //console.log('hi',data);
              setReservationData(data);
              //setUpdateData(data);
              /*data.forEach(d => {
                  const orderDate1 = new Date(d.check_in_date);
                  const orderDate2 = new Date(d.check_out_date);
                  const today = new Date();
                  if(orderDate1<=today && orderDate2>=today){
                      setFilteredOrders(prev=>[...prev, d]);
                      setInitialOrders(prev=>[...prev, d]);
                  }
              });*/
            } catch (error) {
              //setError(error.message); // Handle errors
            } finally {
              //setLoading(false); // Always set loading to false when request finishes
            }
          };
          fetchReservations();
    },[]);
    useEffect(() => {
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
          setPage(savedPage);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('currentPage', page);
    }, [page]);

    return (
        <div className="min-h-screen w-full bg-gray-100 flex">
            <div className="w-1/5 min-h-screen bg-white">
                <div className='p-1 text-center'>
                <a href="/">
                    <div className="text-3xl font-bold text-blue-700 flex items-center">
                        <Navigation className="mr-2" />
                        CampusVacay.
                    </div>
                </a>
                </div>
                <div className='p-1'>
                    <ul className="list-none p-0 m-0">
                        <li className="p-2 hover:cursor-pointer hover:bg-gray-200" onClick={()=>setPage('profile')}>Profile</li>
                        <li className="p-2 hover:cursor-pointer hover:bg-gray-200" onClick={()=>setPage('rooms')}>Rooms</li>
                        <li className="p-2 hover:cursor-pointer hover:bg-gray-200" onClick={()=>setPage('reservations')}>Bookings</li>
                        <li className="p-2 hover:cursor-pointer hover:bg-gray-200" onClick={()=>setPage('reviews')}>Reviews</li>
                    </ul>
                </div>
            </div>
            <div className='w-4/5 min-h-screen'>
                <div className='p-1 min-h-screen'>
                    <div className="flex justify-between items-center text-xl py-4 px-5">
                        Hello, manager!<br/>
                        Have a nice day!
                        <div className="flex">
                            <NotificationBell init={reservationData}/>
                            <div className="relative">
                                <div className="bg-blue-600 text-white px-6 py-2 rounded-full transition duration-300">
                                    Hotel
                                </div>
                            </div>
                        </div>
                    </div>
                    {page==='profile' && (<Profile/>)}
                    {page==='reservations' && (<Reservations/>)}
                    {page==='rooms' && (<Rooms/>)}
                    {page==='reviews' && (<Reviews/>)}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;