import React, { useState, useEffect } from 'react';
import { Form } from 'react-router-dom';
import { Search, MapPin, Star, Navigation, Calendar, Users } from 'lucide-react';

const Rooms = () => {
    const items=[
        {'id':1, 'room_type':'single', 'number_of_rooms': 2,'price_per_night': 200,'facilities': 'spa',
        'breakfast_included': true,'room_size': '20 sqm','max_occupancy': 2,'smoking_allowed': false},
        {'id':2, 'room_type':'double', 'number_of_rooms': 3,'price_per_night': 400,'facilities': 'breakfast',
        'breakfast_included': true,'room_size': '40 sqm','max_occupancy': 4,'smoking_allowed': false},
        {'id':3, 'room_type':'extra', 'number_of_rooms': 3,'price_per_night': 900,'facilities': 'breakfast and lunch',
        'breakfast_included': true,'room_size': '80 sqm','max_occupancy': 8,'smoking_allowed': false},
    ];
    
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        
        const getCsrfToken = () => {

            //console.log(document.cookie);
            const match = document.cookie.match(/csrftoken=([^;]+)/);  // Regex to match CSRF token
            //console.log('here',match);
            return match ? match[1] : null;  // Return the token or null if not found
        };getCsrfToken();
        const fetchData = async () => {
        try {
            /*const response = await fetch("http://3.16.159.54/hotel/api/3/rooms/", {
            
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                
            },
            });

            if (!response.ok) {
            throw new Error("loading error!");
            }

            const data = await response.json();
            console.log(data);
            setRoomData(data);
            console.log(roomData);*/
            fetch('http://3.16.159.54/hotel/api/4/rooms/')
            .then((response) => {
                //console.log(response);
                response.json()})
            .then((data) => {
                //console.log(data);
                //setGreeting(data.message); // Set the greeting message
            })
            .catch((error) => console.error('Error fetching data:', error));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    const [sortBy, setSortBy] = useState('guests');
    
    const sortedItems = [...items].sort((a, b) => {
        if (sortBy === 'guests') {
          return a.guests-b.guests;
        }
        return a.id - b.id;
    });

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
            'breakfast_included': '',
            'room_size': '',
            'max_occupancy': '',
            'smoking_allowed': '',
        })
    }
    const closeCreate = () => setCreateOpen(false);

    const openEdit = (id) => {
        const selectedItem = items.find(item => item.id === id);
        setEditOpen(id);
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

    const openDelete = (id) => setDeleteOpen(id);
    const closeDelete = () => setDeleteOpen(0);
  
    const [createRoom, setCreateRoom] = useState({
        'room_type':'',
        'number_of_rooms':'',
        'price_per_night':'',
        'facilities':'',
        'breakfast_included':'',
        'room_size':'',
        'max_occupancy':'',
        'smoking_allowed':'',
    })

    const [selectedImages, setSelectedImages] = useState([]); // 存儲已上傳的圖片


    const handleSubmit = async (e, mode, id) => {
        const { name, value, type, files } = e.target;

        e.preventDefault();
        console.log(mode, id);
        const room_id = id;
        console.log(createRoom);

        const requestBody = {
            room_type:createRoom.room_type,
            number_of_rooms:createRoom.number_of_rooms,
            price_per_night:createRoom.price_per_night,
            facilities:createRoom.facilities,
            breakfast_included:true,
            room_size:createRoom.room_size,
            max_occupancy:createRoom.max_occupancy,
            smoking_allowed:false,
        };

        if(mode=='create'){
            try {
                console.log('csrf:',localStorage.getItem('csrftoken'));
                const response = await fetch('http://3.16.159.54/hotel/api/4/room/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': localStorage.getItem('csrftoken'),
                    },
                    body: JSON.stringify(requestBody),
                    credentials: 'include',
                });
          
                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                    throw new Error(data.detail || 'Create failed');
                }
          
                // Update the current page's state instead of navigating
                window.location.reload();
            } catch (error) {
                setError('Failed to create. Please try again.');
            } finally {
                setLoading(false);
            }
        
        }else if(mode=='edit'){
            try {
                const roomid = '4';
                const response = await fetch(`http://3.16.159.54/hotel/api/room/7/edit/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRFToken': 'Thxj5lEcq4v6aFXA4vniFDyBNvL8kZ4r',
                    },
                    body: JSON.stringify(requestBody),
                    credentials: 'include',
                });
          
                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                  throw new Error(data.detail || 'Edit failed');
                }
          
                // Update the current page's state instead of navigating
                window.location.reload();
            } catch (error) {
            setError('Failed to edit. Please try again.');
            } finally {
            setLoading(false);
            }
        }else if(mode=='delete'){
            try {
                const response = await fetch(`http://3.16.159.54/hotel/api/room/7/delete/`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRFToken': 'Thxj5lEcq4v6aFXA4vniFDyBNvL8kZ4r',
                  },
                  body: JSON.stringify(''),
                });
          
                const data = await response.json();
          
                if (!response.ok) {
                  throw new Error(data.detail || 'Delete failed');
                }
          
                // Update the current page's state instead of navigating
                window.location.reload();
            } catch (error) {
            setError('Failed to delete. Please try again.');
            } finally {
            setLoading(false);
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
        const { name, value, type, files } = e.target;
        setCreateRoom({
        ...createRoom,
        [name]: type === 'file' ? files : value
        });

    }

    const handleImages = (e) => {
        const files = Array.from(e.target.files); // 獲取選擇的文件
        const imageUrls = files.map(file => URL.createObjectURL(file)); // 生成圖片的 URL
        setSelectedImages(prevImages => [...prevImages, ...imageUrls]); // 更新狀態
        console.log(imageUrls);
    }

    const handleImageDelete = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index)); // 刪除指定的圖片
    };

    return (
        <div className="min-h-screen">
            <div className="flex justify-end px-5">
                <button onClick={openCreate} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    +
                </button>
                {createOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded shadow-lg p-6 w-2/3">
                        <div className="flex justify-between">
                            <h2 className="text-3xl font-bold mb-4">Create Room</h2>
                            <button onClick={closeCreate} className="px-3 bg-red-500 text-white rounded hover:bg-red-600">
                            X
                            </button>
                        </div>
                        <form onSubmit={(e) => handleSubmit(e, 'create', 0)}>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room_type">
                                    Room Type
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="room_type" name="room_type" type="text" value={createRoom.room_type}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number_of_rooms">
                                    Number of Rooms
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="number_of_rooms" name="number_of_rooms" type="text" value={createRoom.number_of_rooms}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_per_night">
                                    Price per Night
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="price_per_night" name="price_per_night" type="text" value={createRoom.price_per_night}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="facilities">
                                    Facilities
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="facilities" name="facilities" type="text" value={createRoom.facilities}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="breakfast_included">
                                    Breakfast Included
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="breakfast_included" name="breakfast_included" type="text" value={createRoom.breakfast_included}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room_size">
                                    Room Size
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="room_size" name="room_size" type="text" value={createRoom.room_size}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="max_occupancy">
                                    Max Occupancy
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="max_occupancy" name="max_occupancy" type="text" value={createRoom.max_occupancy}/>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="smoking_allowed">
                                    Smoking Allowed
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                    onChange={handleChange} id="smoking_allowed" name="smoking_allowed" type="text" value={createRoom.smoking_allowed}/>
                            </div>
                            <div>
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
                            </div>

                            <div className="flex justify-end pt-5">
                                <button type="submit" className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Save
                                </button>
                            </div>
                        </form>
                        
                    </div>
                    </div>
                )}
            </div>
            <div className='p-3 m-5 min-h-screen bg-white'>
                <div>
                    <div className="grid grid-cols-3 p-2 bg-white rounded-md shadow-md hover:bg-gray-200 transition">
                        <div>#</div>
                        <div>Room Type</div>
                    </div>
                    {sortedItems.map(item => (
                    <div key={item.id} className="grid grid-cols-3 p-2 my-2 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition">
                        <div>{item.id}</div>
                        <div>{item.room_type}</div>
                        <div className="flex justify-center">
                            <button onClick={()=>openEdit(item.id)} className="mx-5 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Edit
                            </button>
                            <button onClick={()=>openDelete(item.id)} className="mx-5 p-2 bg-red-500 text-white rounded hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                        {editOpen!=0 && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
                            <div className="bg-white rounded shadow-lg p-6 w-2/3">
                                <div className="flex justify-between">
                                    <h2 className="text-xl font-bold mb-4">Edit Room</h2>
                                    <button onClick={closeEdit} className="px-3 bg-red-500 text-white rounded hover:bg-red-600">
                                    X
                                    </button>
                                </div>
                                <form onSubmit={(e) => handleSubmit(e, 'edit', editOpen)}>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room_type">
                                            Room Type
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="room_type" name="room_type" type="text" value={createRoom.room_type}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number_of_rooms">
                                            Number of Rooms
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="number_of_rooms" name="number_of_rooms" type="text" value={createRoom.number_of_rooms}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_per_night">
                                            Price per Night
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="price_per_night" name="price_per_night" type="text" value={createRoom.price_per_night}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="facilities">
                                            Facilities
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="facilities" name="facilities" type="text" value={createRoom.facilities}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="breakfast_included">
                                            Breakfast Included
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="breakfast_included" name="breakfast_included" type="text" value={createRoom.breakfast_included}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room_size">
                                            Room Size
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="room_size" name="room_size" type="text" value={createRoom.room_size}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="max_occupancy">
                                            Max Occupancy
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="max_occupancy" name="max_occupancy" type="text" value={createRoom.max_occupancy}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="smoking_allowed">
                                            Smoking Allowed
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="smoking_allowed" name="smoking_allowed" type="text" value={createRoom.smoking_allowed}/>
                                    </div>
                                    <div>
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
                                    </div>
                                    <div className="flex justify-end pt-5">
                                        <button type="submit" className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                            </div>
                        )}

                        {deleteOpen!=0 && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
                            <div className="bg-white rounded shadow-lg p-6 w-2/3">
                                <div className="flex justify-between">
                                    <h2 className="text-xl font-bold mb-4">Delete Room</h2>
                                    <button onClick={closeDelete} className="px-3 bg-red-500 text-white rounded hover:bg-red-600">
                                    X
                                    </button>
                                </div>
                                <div className="py-5">Are you sure to delete room {deleteOpen}?</div>
                                <div className="flex justify-end pt-5">
                                    <button onClick={(e) => handleSubmit(e, 'delete', deleteOpen)} className="p-3 bg-red-500 text-white rounded hover:bg-red-600">
                                        Delete
                                    </button>
                                    <button onClick={closeDelete} className="mx-2 px-3 bg-gray-400 text-white rounded hover:bg-gray-500">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            </div>
                        )}
                    </div>
                    
                    ))}
                </div>
            </div>
        </div>
    )
};

const Reservations = () => {
    const items=[
        {id:1, check_in_date: '2024-08-01', check_out_date: '2024-08-10',guests: 4, 'status': 0},
        {id:2, check_in_date: '2024-08-19', check_out_date: '2024-08-22',guests: 2, 'status': 0},
        {id:3, check_in_date: '2024-08-20', check_out_date: '2024-09-01',guests: 4, 'status': 0},
        {id:4, check_in_date: '2024-09-10', check_out_date: '2024-09-11',guests: 2, 'status': 0},
        {id:5, check_in_date: '2024-09-30', check_out_date: '2024-10-10',guests: 4, 'status': 1},
        {id:6, check_in_date: '2024-10-01', check_out_date: '2024-10-05',guests: 10, 'status': 0},
        {id:7, check_in_date: '2024-11-21', check_out_date: '2024-11-24',guests: 5, 'status': 0},
        {id:8, check_in_date: '2024-12-11', check_out_date: '2024-12-17',guests: 4, 'status': 0},
    ];
    const [reservationData, setReservationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            /*console.log('ji');
            const response = await fetch("http://3.16.159.54/hotel/api/hotel/reservations/", {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Token ' + localStorage.getItem('authToken'),
                  'Accept': 'application/json',
                },
                body: JSON.stringify(''),
            });
            console.log('hi');
            if (!response.ok) {
            throw new Error("loading error!");
            }*/

            fetch('http://3.16.159.54/hotel/api/hotel/reservations/',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('authToken'),
                }
            }) // API URL
            .then((response) => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data); // Set the data into state
                setLoading(false); // Set loading to false
            })
            .catch((error) => {
                setError(error.message); // Handle any errors
                setLoading(false); // Set loading to false
            });

            //const data = await response.json();
            //console.log(data, response);
            //setReservationData(data);
            console.log(reservationData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    const [sortBy, setSortBy] = useState('guests');
    
    const sortedItems = [...items].sort((a, b) => {
        if (sortBy === 'guests') {
          return a.guests-b.guests;
        }
        return a.id - b.id;
    });

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

    const handleSubmit = async (e, mode, id) => {
        
    };
    const handleChange = (e) => {
        
    }

    const [startDate, setStartDate] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(items);

    // Handler to filter orders based on the date range
    const filterOrders = () => {
        if (!startDate) {
        setFilteredOrders(items);
        return;
        }

        const filtered = items.filter((item) => {
        const orderDate1 = new Date(item.check_in_date);
        const orderDate2 = new Date(item.check_out_date);
        return orderDate1 <= new Date(startDate) && orderDate2 >= new Date(startDate);
        });
        setFilteredOrders(filtered);
    };
    
    return (
        <div className="min-h-screen">
            <div className="p-5 flex items-center">
                <div htmlFor="start-date" className="px-3 block text-3xl text-gray-700">
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
                        onClick={()=>setFilteredOrders(items)}
                        className="w-full py-2 px-4 mx-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2"
                    >
                        Clear
                    </button>
                </div>
            </div>


            {/*<div className="flex justify-end px-5">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    +
                </button>
            </div>
            <div className="px-8">
                Sort by:
                <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md p-1 w-1/4"
                >
                <option value="guests">guests</option>
                <option value="id">ID</option>
                </select>
            </div>*/}
            <div className='p-3 m-5 min-h-screen bg-white'>
                <div>
                    <div className="grid grid-cols-6 p-2 bg-white rounded-md shadow-md hover:bg-gray-200 transition">
                        <div>#</div>
                        <div>check-in date</div>
                        <div>check-out date</div>
                        <div>guests</div>
                        <div>status</div>
                        <div>details</div>
                    </div>
                    {filteredOrders.map(item => (
                    <div key={item.id} className="grid grid-cols-6 p-2 my-2 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition">
                        <div>{item.id}</div>
                        <div>{item.check_in_date}</div>
                        <div>{item.check_out_date}</div>
                        <div>{item.guests}</div>
                        <div>{item.status}</div>
                        <div>
                            <button onClick={()=>openEdit(item.id)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Details
                            </button>
                        </div>
                        {editOpen!=0 && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
                            <div className="bg-white rounded shadow-lg p-6 w-2/3">
                                <div className="flex justify-between">
                                    <h2 className="text-4xl font-bold mb-4">Details for reservation at hotel_name, room_type</h2>
                                    <button onClick={closeEdit} className="px-3 bg-red-500 text-white rounded hover:bg-red-600">
                                    X
                                    </button>
                                </div>
                                <div className="flex">
                                    <div className="w-2/5 h-full border rounded m-2">
                                        <div className="flex border-b items-center">
                                            <label className="whitespace-nowrap w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                First Name:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                Kai-Lun
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="whitespace-nowrap w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Last Name:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                Yen
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Guests:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                4
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Email:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                123@mail.com
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="whitespace-nowrap w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Phone No:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                1231237891
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Payment:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                Credit Card
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-3/5 h-full border rounded m-2">
                                        <div className="flex border-b items-center">
                                            <label className="w-1/2 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Check In:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                2024-10-10
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/2 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Check Out:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                2024-10-15
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/2 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Expected Arrival Time:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                11:00
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/2 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Special Requests:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                None
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
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
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={(e) => handleSubmit(e, 'edit', editOpen)}>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room_type">
                                            Additional Charges
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="additional_charges" name="additional_charges" type="text" value=""/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number_of_rooms">
                                            Damage Report
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="damage_report" name="damage_report" type="text" value=""/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_per_night">
                                            Room Number
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                            onChange={handleChange} id="room_number" name="room_number" type="text" value=""/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="smoking_allowed">
                                            Checked In?
                                        </label>
                                        <input
                                            className="shadow border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            onChange={handleChange} id="checked_in" name="checked_in" type="checkbox" value=""/>
                                    </div>
                                    
                                    
                                    <div className="flex justify-end pt-5">
                                        <button type="submit" className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                            </div>
                        )}
                    </div>

                    
                    
                    ))}
                </div>
                
            </div>
        </div>
    )
};


const Reviews = () => {
    const items=[
        {id:1, rating: 2, comment:'not bad'},
        {id:2, rating: 4, comment:'nice'}
    ];

    const [sortBy, setSortBy] = useState('guests');
    
    const sortedItems = [...items].sort((a, b) => {
        if (sortBy === 'guests') {
          return a.guests-b.guests;
        }
        return a.id - b.id;
    });

    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            /*const response = await fetch("http://3.16.159.54/hotel/api/3/rooms/", {
            
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                
            },
            });

            if (!response.ok) {
            throw new Error("loading error!");
            }

            const data = await response.json();
            console.log(data);
            setRoomData(data);
            console.log(roomData);*/
            fetch('http://3.16.159.54/hotel/api/4/reviews/')
            .then((response) => {
                console.log(response);
                response.json()})
            .then((data) => {
                console.log(data);
                //setGreeting(data.message); // Set the greeting message
            })
            .catch((error) => console.error('Error fetching data:', error));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []);
    
    
    return (
        <div className='p-5 min-h-screen'>
            <div className='p-3 m-5 min-h-screen bg-white'>
                <div>
                    <div className="grid grid-cols-6 p-2 bg-white rounded-md shadow-md hover:bg-gray-200 transition">
                        <div>#</div>
                        <div className="col-span-5">Comments</div>
                    </div>
                    {sortedItems.map(item => (
                    <div key={item.id} className="grid grid-cols-6 p-2 my-2 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition">
                        <div>{item.id}</div>
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
                                <input disabled className="bg-white w-full p-2" value={item.comment}/>
                            </div>
                        </div>
                    
                    </div>
                    
                    ))}
                    

                </div>
            </div>
        </div>
    )
};


const Profile = () => {
    const items=[
        {username:'kevinhotel', password: 'kevin123', email: '123@mail.com',guests: 4, hotel_name: 'Hotel Name', address: 'address', 
            location: 'Brooklyn', city: 'Brooklyn', country: 'New York', phone_number: '1231236767', description: 'amazing hotel', 
            facilities: 'brekfast', check_in_time: '15:00', check_out_time: '11:00', cancellation_policy: 'no cancellation', student_discount: 0.9, special_offers: 'none' 
        },
    ];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [item,setItem] = useState(items[0]);
    const [isReadOnly, setIsReadOnly] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        try {
            /*console.log('ji');
            const response = await fetch("http://3.16.159.54/hotel/api/hotel/reservations/", {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Token ' + localStorage.getItem('authToken'),
                  'Accept': 'application/json',
                },
                body: JSON.stringify(''),
            });
            console.log('hi');
            if (!response.ok) {
            throw new Error("loading error!");
            }*/
            await fetch('http://3.16.159.54/student/student/profile/',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('authToken'),
                }
            }) // API URL
            .then((response) => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProfile(data);
                //setItem(data);
                setLoading(false); // Set loading to false
            })
            .catch((error) => {
                setError(error.message); // Handle any errors
                setLoading(false); // Set loading to false
            });

            //const data = await response.json();
            //console.log(data, response);
            //setReservationData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchData();

    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleReadOnly();
        try {
            const response = await fetch('localhost', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(''),
            });
      
            const data = await response.json();
      
            if (!response.ok) {
              throw new Error(data.detail || 'edit failed');
            }
            console.log('Edit successful:', data);
            
        }catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        setItem({
        ...item,
        [e.target.name]: e.target.value
        });
    }

    const handleCancel = () => {
        setItem(items[0]);
        toggleReadOnly();
    }

    const toggleReadOnly = () => {
        setIsReadOnly((prev) => !prev);
    };

    return (
        <div className="min-h-screen">
            <div className="flex justify-between items-center text-4xl pt-4 px-5">
                Hotel Profile
            </div>
            <div className="relative p-5">
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="username" name="username" type="text" value={item.username}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="password" name="password" type="text" value={item.password}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="email">
                        E-mail
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="email" name="email" type="text" value={item.email}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="hotel_name">
                        Hotel Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="hotel_name" name="hotel_name" type="text" value={item.hotel_name}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="address">
                        Address
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="address" name="address" type="text" value={item.address}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="location">
                        Location
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="location" name="location" type="text" value={item.location}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="city">
                        City
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="city" name="city" type="text" value={item.city}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="country">
                        Country
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="country" name="country" type="text" value={item.country}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="phone_number">
                        Phone Number
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="phone_number" name="phone_number" type="text" value={item.phone_number}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="description" name="description" value={item.description}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="facilities">
                        Facilities
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="facilities" name="facilities" value={item.facilities}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="check_in_time">
                        Check-in Time
                    </label>
                    <input
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="check_in_time" name="check_in_time" type="time" value={item.check_in_time}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="check_out_time">
                        Check-out Time
                    </label>
                    <input
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="check_out_time" name="check_out_time" type="time" value={item.check_out_time}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="cancellation_policy">
                        Cancellation Policy
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="cancellation_policy" name="cancellation_policy" value={item.cancellation_policy}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="student_discount">
                        Student Discount
                    </label>
                    <input
                        className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="student_discount" name="student_discount" type="number" value={item.student_discount}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="special_offers">
                        Special Offers
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="special_offers" name="special_offers" type="text" value={item.special_offers}/>
                </div>
                {isReadOnly && (
                <div className="flex justify-end pt-5">
                    <button onClick={toggleReadOnly} className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Edit
                    </button>
                </div>
                )}
                {!isReadOnly && (
                <div className="flex justify-end pt-5">
                    <button onClick={handleSubmit} className="mx-2 p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Save
                    </button>
                    <button onClick={handleCancel} className="mx-2 p-3 bg-gray-400 text-white rounded hover:bg-gray-500">
                        Cancel
                    </button>
                </div>
                )}
            </form>
            </div>
        </div>
    )
}


const DashboardPage = () => {
    const [page, setPage] = useState('profile');
    return (
        <div className="min-h-screen w-full bg-gray-100 flex">
            <div className="w-1/5 min-h-screen bg-white">
                <div className='p-5 text-center'>
                <a href="/">
                    <div className="text-3xl font-bold text-blue-700 flex items-center">
                        <Navigation className="mr-2" />
                        CampusVacay.
                    </div>
                </a>
                </div>
                <div className='p-5'>
                    <ul>
                        <li className='pt-3'><button onClick={()=>setPage('profile')}>Profile</button></li>
                        <li className='pt-3'><button onClick={()=>setPage('rooms')}>Rooms</button></li>
                        <li className='pt-3'><button onClick={()=>setPage('reservations')}>Bookings</button></li>
                        <li className='pt-3'><button onClick={()=>setPage('reviews')}>Reviews</button></li>
                    </ul>
                </div>
            </div>
            <div className='w-4/5 min-h-screen'>
                <div className='p-5 min-h-screen'>
                    <div className="flex justify-between items-center py-4 px-5">
                        Hello, manager!<br/>
                        Have a nice day!
                        <div className="relative">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                                Hotel
                            </button>
                        </div>
                    </div>
                    {page==='profile' && (<Profile/>)}
                    {page==='reservations' && (<Reservations/>)}
                    {page==='rooms' && (<Rooms/>)}
                    {page==='reviews' && (<Reviews/>)}
                </div>
                {/*{page==='profile' && (
                    <div className='p-5 min-h-screen'>
                        <Profile/>
                    </div>
                )}
                {page==='reservations' && (
                    <div className='p-5 min-h-screen'>
                        <Reservations/>
                    </div>
                )}
                {page==='rooms' && (
                    <div className='p-5 min-h-screen'>
                        <Rooms/>
                    </div>
                )}
                {page==='reviews' && (
                    <div className='p-5 min-h-screen'>
                        <Reviews/>
                    </div>
                )}*/}
            </div>
        </div>
    );
};

export default DashboardPage;