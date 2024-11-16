import React, { useState, useEffect, useNavigate} from 'react';
import { Form } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
const Review = ({ hotel_id}) => {
    //const [review, setReview] = useState({rating: 0, comment: ''});
    const [editOpen, setEditOpen] = useState(0);
    const handleSubmit = async(e) =>{
        e.preventDefault();
        console.log(hotel_id, rating, comment);
    }
    const closeEdit = () => {
        setEditOpen(0);
        setRating(0);
        setComment('');
        //document.body.style.overflow = '';
    }
    const openEdit = () => {
        setEditOpen(1);
        //document.body.style.overflow = 'hidden';
    }

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const handleClick = (value) => {
        setRating(value);
    };
    const handleChange = (e) => {
        setComment(e.target.value);
    };
    
    return (
        <div>
            <button className="rounded bg-blue-500 p-2 text-white" onClick={openEdit}>Add Reviews</button>
            {editOpen!=0 && (
                <div className="min-h-screen fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-10">
                    <div className=" bg-white rounded shadow-lg p-6 w-2/3">
                        <div className="flex justify-between">
                            <h2 className="text-4xl font-bold mb-4">Writing reviews for hotel {hotel_id}</h2>
                            <button onClick={closeEdit} className="px-3 bg-red-500 text-white rounded hover:bg-red-600">
                            X
                            </button>
                        </div>
                        <div className="col-span-5">
                            <div className="flex space-x-1">
                                {Array.from({ length: 5 }, (_, index) => {
                                    const starValue = index + 1;
                                    return (
                                    <span
                                        key={starValue}
                                        onClick={()=>handleClick(starValue)}
                                        className={`cursor-pointer text-2xl ${
                                        starValue <= rating ? 'text-yellow-500' : 'text-gray-400'
                                        }`}
                                    >
                                        ★
                                    </span>
                                    );
                                })}
                            </div>
                            <div className="pt-2">
                                <input className="border w-full p-2" onChange={handleChange} id="comment" name="comment" value={comment} placeholder="Comment..."/>
                            </div>
                        </div>
                        <div className="flex justify-end pt-5">
                            <button onClick={handleSubmit} className="p-3 mx-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Save
                            </button>
                            <button onClick={closeEdit} className="p-3 mx-2 bg-gray-300 text-white rounded hover:bg-gray-400">
                                Cancel
                            </button>
                        </div>
                    </div>
                    
                </div>
            )}
        </div>
    )
}

const HotelCard = ({ reservation , type }) => {
    //const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleImageError = () => {
      setImageError(true);
    };

    const handleCancel = async() => {
        
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
            
            await fetch(`http://3.16.159.54/student/api/reservation/${reservation.id}/cancel/`,{
                method: 'POST',
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
                console.log(data);
                //setProfile(data);
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
    } 
  
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img 
            src={imageError ? "https://images.pexels.com/photos/${hotel.name}/pexels-photo-1134176.jpeg" : (reservation.hotel_photos || "/api/placeholder/400/300")}
            alt={reservation.hotel_name}
            onError={handleImageError}
            className="w-full h-64 object-cover"
          />
          {/*<div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              ${hotel.price}/night
            </span>
          </div>
          {hotel.student_discount && (
            <div className="absolute top-4 right-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                {hotel.student_discount}% Student Discount
              </span>
            </div>
          )}*/}
        </div>
        
        <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{reservation.hotel_name}</h3>
            {/*<div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-2" />
                <span>{hotel.location}</span>
            </div>
            
            <div className="mb-4">
                <p className="text-gray-600">{hotel.description}</p>
            </div>*/}
            
            <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-semibold whitespace-nowrap">{reservation.check_in_date} to {reservation.check_out_date}</span>
                    </div>
                </div>
                {type!='future' &&
                    <Review hotel_id={reservation.hotel_id}/>
                }
            </div>
            
            {type=='future' &&
            <div>
                <button className=" underline cursor-pointer hover:text-purple-700" onClick={handleCancel}>
                    Cancel this Reservation
                </button>
            </div>
            }
  
            {/*<div className="mt-4 border-t pt-4">
                <h4 className="font-semibold mb-2">Facilities</h4>
                <div className="flex flex-wrap gap-2">
                {hotel.facilities?.split(',').map((facility, index) => (
                    <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                    {facility.trim()}
                    </span>
                ))}
                </div>
            </div>*/}
          
        </div>
      </div>
    );
};

const Reservations = () => {
    const items=[
        {id:1, hotel_id: 4, hotel_name: 'kevinhotel', room_type: 'single', check_in_date: '2024-08-01', check_out_date: '2024-08-10',guests: 4, 'status': 0},
        {id:2, check_in_date: '2024-08-19', check_out_date: '2024-08-22',guests: 2, 'status': 0},
        {id:3, check_in_date: '2024-08-20', check_out_date: '2024-09-01',guests: 4, 'status': 0},
        {id:4, check_in_date: '2024-09-10', check_out_date: '2024-09-11',guests: 2, 'status': 0},
        {id:5, check_in_date: '2024-09-30', check_out_date: '2024-10-10',guests: 4, 'status': 1},
        {id:6, check_in_date: '2024-10-01', check_out_date: '2024-10-05',guests: 10, 'status': 0},
        {id:7, check_in_date: '2024-11-21', check_out_date: '2024-11-24',guests: 5, 'status': 0},
        {id:8, check_in_date: '2024-12-11', check_out_date: '2024-12-17',guests: 4, 'status': 0},
    ];

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [item,setItem] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [date, setDate] = useState('');
    //temp data
    const [pastData, setPastData] = useState(items.slice(0,2));
    const [currentData, setCurrentData] = useState(items.slice(2,5));
    const [futureData, setFutureData] = useState(items.slice(5,8));

    useEffect(() => {
        //setDate(formattedDate);
        //console.log(formattedDate);
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
            
            await fetch('http://3.16.159.54/student/api/student/reservations/',{
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
                console.log(data);
                //setProfile(data);
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

        //distinguish different reservations
        /*
        items.forEach(item=>{
            const todayDate = new Date();
            const checkInDate = new Date(item.check_in_date);
            const checkOutDate = new Date(item.check_out_date);

            if(checkOutDate<todayDate){
                setPastData((prevItems) => [...prevItems, item]);
            }else if(checkInDate>todayDate){
                setFutureData((prevItems) => [...prevItems, item]);
            }else{
                setCurrentData((prevItems) => [...prevItems, item]);
            }
        });
        */

    }, []);

    
    const [sortBy, setSortBy] = useState('all');
    
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
        <div className=''>
            
            <div className="flex items-center justify-end px-5">
                <label className="p-2">Filter:</label>
                <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md p-1 w-1/4"
                >
                <option value="all">All</option>
                <option value="now">Ongoing</option>
                <option value="future">Upcoming</option>
                <option value="past">Past</option>
                </select>
            </div>
            <div className='p-3 m-5 min-h-screen bg-white'>
                <div>
                    {/*<div className="grid grid-cols-6 p-2 bg-white rounded-md shadow-md hover:bg-gray-200 transition">
                        <div>#</div>
                        <div>checkin date</div>
                        <div>checkout date</div>
                        <div>guests</div>
                        <div>status</div>
                        <div>details</div>
                    </div>*/}
                    {(sortBy=="now" || sortBy=="all") &&
                    <div>
                        <div className="my-5 text-4xl font-bold">Ongoing Reservations</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentData.map((reservation,index) => (
                            <HotelCard key={index} reservation={reservation} />
                            ))}
                        </div>
                    </div>
                    }
                    {(sortBy=="future" || sortBy=="all") &&
                    <div>
                        <div className="my-5 text-4xl font-bold">Upcoming Reservations</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {futureData.map((reservation,index) => (
                            <HotelCard key={index} reservation={reservation} type="future"/>
                            ))}
                        </div>
                    </div>
                    }
                    {(sortBy=="past" || sortBy=="all") &&
                    <div>
                        <div className="my-5 text-4xl font-bold">Past Reservations</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastData.map((reservation,index) => (
                            <HotelCard key={index} reservation={reservation} />
                            ))}
                        </div>
                    </div>
                    }
                    {/*{pastData.map(item => (
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

                    
                    
                    ))}*/}
                    
                    {/*{futureData.map(item => (
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
                    </div>
                    ))}*/}
                    {/*{currentData.map(item => (
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
                    </div>
                    ))}*/}
                    
                </div>
                
            </div>
        </div>
    )
};


{/*const Reviews = () => {
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
};*/}


const Profile = () => {
    const items=[
        {id:1, dob: '1999-06-16', check_in_date: '2024-08-01', check_out_date: '2024-08-10',guests: 4, 'status': 0},
    ];

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [item,setItem] = useState(null);
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
                setItem(data);
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

        //submit profile edit here
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
        setItem(profile);
        toggleReadOnly();
    }

    

    const toggleReadOnly = () => {
        setIsReadOnly((prev) => !prev);
    };

    if (loading) {
        return <div>Loading...</div>;  // 加載中顯示的提示
    }

    return (
        <div className='p-5 min-h-screen'>
            
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
                        readOnly={isReadOnly} onChange={handleChange} id="username" name="username" type="text" value='username missing'/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="password" name="password" type="text" value='pw missing'/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="email">
                        E-mail
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="email" name="email" type="text" value='email missing'/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="first_name">
                        First Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="first_name" name="first_name" type="text" value='first_name missing'/>
                </div>
                <div className="flex border-b py-5 items-center">
                    <label className="w-1/3 block text-gray-700 text-3xl font-bold mr-4" htmlFor="last_name">
                        Last Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="last_name" name="last_name" type="text" value='last_name missing'/>
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
                <div className='p-5 flex items-center justify-center text-center'>
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
                        <li className='pt-3'><button onClick={()=>setPage('reservations')}>Bookings</button></li>
                        {/*<li className='pt-3'><button onClick={()=>setPage('reviews')}>Reviews</button></li>*/}
                    </ul>
                </div>
            </div>
            <div className='w-4/5 min-h-screen'>
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
                    {page==='profile' && (<Profile/>)}
                    {page==='reservations' && (<Reservations/>)}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardPage;