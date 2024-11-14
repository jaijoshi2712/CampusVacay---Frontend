import React, { useState } from 'react';
import { Form } from 'react-router-dom';

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
        

        //const files = Array.from(createRoom.images); // 獲取選擇的文件
        //const imageUrls = files.map(file => URL.createObjectURL(file)); // 生成圖片的 URL
        //setSelectedImages(prevImages => [...prevImages, ...imageUrls]);
    }
    const closeEdit = () => setEditOpen(0);

    const handleSubmit = async (e, mode, id) => {
        
    };
    const handleChange = (e) => {
        
    }
    
    return (
        <div className='p-5 min-h-screen'>
            <div className="flex justify-between items-center py-4 px-5">
                Hello!<br/>
                Have a nice day!
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    Username
                </button>
            </div>
            <div className="relative p-5">
                <input type="text" className="border border-gray-300 rounded-lg pl-5 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search..."/>
                
            </div>
            <div className="flex justify-end px-5">
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
            </div>
            <div className='p-3 m-5 min-h-screen bg-white'>
                <div>
                    <div className="grid grid-cols-6 p-2 bg-white rounded-md shadow-md hover:bg-gray-200 transition">
                        <div>#</div>
                        <div>checkin date</div>
                        <div>checkout date</div>
                        <div>guests</div>
                        <div>status</div>
                        <div>details</div>
                    </div>
                    {sortedItems.map(item => (
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
                                <div>
                                <div className="w-full h-full border rounded m-2">
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
                                        <div className="flex border-b items-center">
                                            <label className="w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Payment:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                Credit Card
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Check In:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                2024-10-10
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Check Out:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                2024-10-15
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Expected Arrival Time:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                11:00
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Special Requests
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                None
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Cancelled?
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                1
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/3 p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Cancellation Date:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                1
                                            </span>
                                        </div>
                                        <div className="flex border-b items-center">
                                            <label className="w-1/3 whitespace-nowrap p-2 block text-gray-700 text-3xl font-bold mr-4" htmlFor="username">
                                                Cancellation Reason:
                                            </label>
                                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                                1
                                            </span>
                                        </div>
                                    </div>
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
    
    const handleClick = (value) => {
        setRating(value);
    };
    
    return (
        <div className='p-5 min-h-screen'>
            <div className="flex justify-between items-center py-4 px-5">
                Hello!<br/>
                Have a nice day!
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    Hotel
                </button>
            </div>
            <div className="relative p-5">
                <input type="text" className="border border-gray-300 rounded-lg pl-5 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search..."/>
                
            </div>
            
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
                                        onClick={() => handleClick(starValue)}
                                        className={`cursor-pointer text-2xl ${
                                        starValue <= item.rating ? 'text-yellow-500' : 'text-gray-400'
                                        }`}
                                    >
                                        ★
                                    </span>
                                    );
                                })}
                            </div>
                            <div className="pt-2">
                                <input className="border w-full p-2" value={item.comment} placeholder="Comment..."/>
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
        {id:1, dob: '1999-06-16', check_in_date: '2024-08-01', check_out_date: '2024-08-10',guests: 4, 'status': 0},
    ];

    const [item,setItem] = useState(items[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleReadOnly();
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

    const [isReadOnly, setIsReadOnly] = useState(true);

    const toggleReadOnly = () => {
        setIsReadOnly((prev) => !prev);
    };

    return (
        <div className='p-5 min-h-screen'>
            <div className="flex justify-between items-center py-4 px-5">
                Hello!<br/>
                Have a nice day!
                <div className="relative">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                        Student
                    </button>
                    
                </div>
            </div>
            <div className="flex justify-between items-center text-4xl pt-4 px-5">
                Personal Profile
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
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="first_name">
                        First Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="first_name" name="first_name" type="text" value={item.first_name}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="last_name">
                        Last Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="last_name" name="last_name" type="text" value={item.last_name}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="dob">
                        Date of Birth
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="dob" name="dob" type="date" value={item.dob}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="phone_number">
                        Phone No.
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="phone_number" name="phone_number" type="text" value={item.phone_number}/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="address">
                        Address
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="address" name="address" type="text" value={item.address}/>
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


const StudentDashboardPage = () => {
    const [page, setPage] = useState('profile');
    return (
        <div className="min-h-screen w-full bg-gray-100 flex">
            <div className="w-1/5 min-h-screen bg-white">
                <div className='p-5 text-center'>
                <div className="text-3xl font-bold text-blue-600">CampusVacay.</div>
                </div>
                <div className='p-5'>
                    <ul>
                        <li className='pt-3'><button onClick={()=>setPage('profile')}>Profile</button></li>
                        <li className='pt-3'><button onClick={()=>setPage('reservations')}>Bookings</button></li>
                        <li className='pt-3'><button onClick={()=>setPage('reviews')}>Reviews</button></li>
                    </ul>
                </div>
            </div>
            <div className='w-4/5 min-h-screen'>
                {page==='profile' && (
                    <div className='p-5 min-h-screen'>
                        <Profile/>
                    </div>
                )}
                {page==='reservations' && (
                    <div className='p-5 min-h-screen'>
                        <Reservations/>
                    </div>
                )}
                {page==='reviews' && (
                    <div className='p-5 min-h-screen'>
                        <Reviews/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboardPage;