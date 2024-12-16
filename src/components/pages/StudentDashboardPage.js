import React, { useState, useEffect} from 'react';
import { Form } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Review = ({ hotel_id }) => {
    //const [review, setReview] = useState({rating: 0, comment: ''});
    const [editOpen, setEditOpen] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewData, setReviewData] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState({ type: '', content: '' });
    
    //console.log(reviewData, reviewData.length);
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
            //console.log(data, hotel_id);
            data.forEach(d => {
                if (d.hotel===hotel_id){
                    //console.log(d);
                    setReviewData(d);
                    setRating(d.rating);
                    setComment(d.review);
                }
            });
            //setReviewData(data[0]);
            
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
    const handleSubmit = async(e, mode, id) =>{
        e.preventDefault();
        //console.log(mode, rating, comment);
        if(mode == 'create'){
            try {
                const response = await fetch(`http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/reviews/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem('authToken'),
                    },
                    body: JSON.stringify({rating:rating, review:comment, hotel_id: hotel_id}),
                });
                const data = await response.json();
                //console.log(data);
                if (!response.ok) {
                    throw new Error(data.detail || 'Create failed');
                }
                setEditOpen(0);
                setMessage({ type: 'success', content: 'Review Created successfully!' });
                setTimeout(() => {
                    window.location.reload();
                    setMessage({type: '', content: ''});
                }, 5000);
            } catch (error) {
                setMessage({ type: 'error', content: error.message });
                setTimeout(() => {
                    setMessage({type: '', content: ''});
                }, 5000);
            }
        }else if( mode == 'edit'){
            try {
                const response = await fetch(`http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/reviews/${id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem('authToken'),
                    },
                    body: JSON.stringify({rating:rating, review:comment, hotel_id: hotel_id}),
                });
                const data = await response.json();
                //console.log(data);
                if (!response.ok) {
                    throw new Error(data.detail || 'Create failed');
                }
                // Update the current page's state instead of navigating
                setEditOpen(0);
                setMessage({ type: 'success', content: 'Review Edited successfully!' });
                setTimeout(() => {
                    window.location.reload();
                    setMessage({type: '', content: ''});
                }, 5000);
            } catch (error) {
                setMessage({ type: 'error', content: error.message });
                setTimeout(() => {
                    setMessage({type: '', content: ''});
                }, 5000);
            }
        }else if( mode == 'delete'){
            try {
                const response = await fetch(`http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/reviews/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem('authToken'),
                    },
                    //body: JSON.stringify({rating:rating, review:comment, hotel_id: hotel_id}),
                });
                setEditOpen(0);
                setMessage({ type: 'success', content: 'Review Deleted successfully!' });
                setTimeout(() => {
                    window.location.reload();
                    setMessage({type: '', content: ''});
                }, 5000);
            } catch (error) {
                setMessage({ type: 'error', content: error.message });
                setTimeout(() => {
                    setMessage({type: '', content: ''});
                }, 5000);
            }
        }
    }
    const handleFavSubmit = async(e) =>{
        e.preventDefault();
        //console.log(mode, rating, comment);
        try {
            const response = await fetch(`http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/student/api/favourite/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('authToken'),
                },
                body: JSON.stringify({hotel_id: hotel_id}),
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                throw new Error(data.detail || 'Create failed');
            }
            setEditOpen(0);
            setMessage({ type: 'success', content: data.message });
            setTimeout(() => {
                setMessage({type: '', content: ''});
            }, 5000);
        } catch (error) {
            setMessage({ type: 'error', content: error.message });
            setTimeout(() => {
                setMessage({type: '', content: ''});
            }, 5000);
        }
    }

    const closeEdit = () => {
        setEditOpen(0);
        setRating(reviewData.rating);
        setComment(reviewData.review);
    }
    const openEdit = () => {
        setEditOpen(1);
    }

    const handleClick = (value) => {
        setRating(value);
    };
    const handleChange = (e) => {
        setComment(e.target.value);
    };
    
    return (
        <div>
            {message.content && (
                <div className={`fixed top-16 right-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.content}
                </div>
            )}
            <button className="rounded bg-blue-500 p-2 text-white" onClick={openEdit}>Add Reviews</button>
            <button className="rounded bg-red-400 p-2 ml-2 text-white" onClick={handleFavSubmit}>Add to Favorite</button>

            {editOpen!=0 && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded shadow-lg p-6 max-h-screen w-4/5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold mb-4">Writing reviews for hotel {hotel_id}</h2>
                            <button onClick={closeEdit} className="p-3 bg-red-500 text-white rounded hover:bg-red-600">
                            X
                            </button>
                        </div>
                        {reviewData.length===0 ? (
                        <div>
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
                            
                            <div className="flex justify-end pt-2">
                                <button onClick={(e)=>handleSubmit(e, 'create', 0)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Save
                                </button>
                                <button onClick={closeEdit} className="p-2 ml-2 bg-gray-300 text-white rounded hover:bg-gray-400">
                                    Cancel
                                </button>
                            </div>
                        </div>
                        ) : (
                        <div>
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
                                    <input className="border w-full p-2" onChange={handleChange} id="comment" name="comment" value={comment} placeholder={comment}/>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-2">
                                <button onClick={(e)=>handleSubmit(e, 'edit', reviewData.id)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Edit
                                </button>
                                <button onClick={(e)=>handleSubmit(e, 'delete', reviewData.id)} className="p-2 ml-2 bg-red-500 text-white rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                        </div>
                        )}
                        {/*<div>
                        { reviewData && reviewData.length > 0 ?(
                        reviewData.map(item => (
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
                                    <input disabled className="bg-white w-full p-2" value={item.review}/>
                                </div>
                            </div>
                        </div>
                        
                        ))):(<div></div>)}
                        </div>*/}
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
            const response = await fetch("http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/hotel/reservations/", {
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
            
            await fetch(`http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/reservations/${reservation.id}`,{
                method: 'delete',
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
    
    const [popOpen, setPopOpen] = useState(false); 
    const openPop = () => setPopOpen(true);
    const closePop = () => setPopOpen(false);
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative hover:cursor-pointer" onClick={openPop}>
          <img 
          src={imageError ? "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg" : reservation.hotel_photos}
          alt={reservation.hotel_name}
            onError={handleImageError}
            className="w-full h-64 object-cover"
          />
        </div>
        
        <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{reservation.hotel_name}</h3>
            
            <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-semibold whitespace-nowrap">{reservation.check_in_date} to {reservation.check_out_date}</span>
                    </div>
                </div>
                {type=='past' &&
                    <Review hotel_id={reservation.hotel}/>
                }
            </div>
            
            {type=='future' &&
            <div>
                <button className=" underline cursor-pointer hover:text-purple-700" onClick={handleCancel}>
                    Cancel this Reservation
                </button>
            </div>
            }

            { popOpen && (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg p-6 max-h-screen px-4 py-3 mt-10 w-4/5">
                <div className="flex items-start justify-between">
                    <h2 className="text-2xl font-bold mb-4">Details for reservation at {reservation.hotel_name}, {reservation.room_type}</h2>
                    <button onClick={closePop} className="align-top px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    X
                    </button>
                </div>
                <img 
                src={imageError ? "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg" : reservation.hotel_photos}
                alt={reservation.hotel_name}
                    onError={handleImageError}
                    className="w-full h-40 object-cover"
                />
                <div className="flex">
                    <div className="w-1/2 h-full border rounded m-2">
                        <div className="flex border-b items-center">
                            <label className="whitespace-nowrap w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                                First Name:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.first_name}
                            </span>
                        </div>
                        <div className="flex border-b items-center">
                            <label className="whitespace-nowrap w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                                Last Name:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.last_name}
                            </span>
                        </div>
                        <div className="flex border-b items-center">
                            <label className="w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                                Guests:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.guests}
                            </span>
                        </div>
                        <div className="flex border-b items-center">
                            <label className="w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                                Email:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.email}
                            </span>
                        </div>
                        <div className="flex border-b items-center">
                            <label className="whitespace-nowrap w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                                Phone No:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.phone_number}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                                Payment:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.payment_status}
                            </span>
                        </div>
                    </div>
                    <div className="w-1/2 h-full border rounded m-2">
                        <div className="flex border-b items-center">
                            <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                                Check In Date:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.check_in_date}
                            </span>
                        </div>
                        <div className="flex border-b items-center">
                            <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                                Check Out Date:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.check_out_date}
                            </span>
                        </div>
                        <div className="flex border-b items-center">
                            <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                                Expected Arrival Time:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.expected_arrival_time}
                            </span>
                        </div>
                        <div className="flex border-b items-center">
                            <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="username">
                                Special Requests:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.special_requests}
                            </span>
                        </div>
                        <div className="flex border-b items-center">
                            <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="damage_insurance">
                                Damage Insurance:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.damage_insurance ? 'Insured' : 'No'}
                            </span>
                        </div>
                        <div className="flex border-b items-center">
                            <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="damage_report">
                                Damage Report:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.damage_report}
                            </span>
                        </div>
                        <div className="flex border-b items-center">
                            <label className="w-1/2 p-2 block text-gray-700 text-lg font-bold mr-4" htmlFor="additional_charges">
                                Additional Charge:
                            </label>
                            <span className="appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10">
                                {reservation.additional_charges}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            )}
        </div>
      </div>
    );
};

const Reservations = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [item,setItem] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [todayDate, setDate] = useState(new Date());
    
    const [reservationData, setReservationData] = useState([]);
    const [pastData, setPastData] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [futureData, setFutureData] = useState([]);
    
    useEffect(() => {
        const fetchReservations = async () => {
          try {
            const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/student/api/student/reservations/', {
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
    
            const past = [];
            const current = [];
            const future = [];
            data.forEach((item) => {
                //const itemDate
                if (new Date(item.check_out_date) < todayDate) {
                  past.push(item);
                } else if (new Date(item.check_in_date) > todayDate) {
                  future.push(item);
                } else {
                  current.push(item);
                }
            });
            console.log('1', data);
            setPastData(past);
            setCurrentData(current);
            setFutureData(future);
          } catch (error) {
            setError(error.message); // Handle errors
          } finally {
            setLoading(false); // Always set loading to false when request finishes
          }
        };
        fetchReservations();
    }, []);

    const [sortBy, setSortBy] = useState('all');

    if (loading){
        return <div>Loading...</div>
    }
    return (
        <div className=''>
            <div className="flex justify-between items-center text-2xl font-bold px-3">
                Reservations
            </div>
            <div className="flex items-center justify-end px-3">
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
            <div className='p-3 m-3 min-h-screen rounded-md bg-white'>
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
                        <div className="text-2xl font-bold">Ongoing Reservations</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentData && currentData.length >0 ? (
                                currentData.map((reservation,index) => (
                            <HotelCard key={index} reservation={reservation} type="current"/>
                            ))):(<div className="min-h-20">No Ongoing Reservations!</div>)}
                        </div>
                    </div>
                    }
                    {(sortBy=="future" || sortBy=="all") &&
                    <div>
                        <div className="text-2xl font-bold">Upcoming Reservations</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {futureData && futureData.length >0 ? (
                                futureData.map((reservation,index) => (
                            <HotelCard key={index} reservation={reservation} type="future"/>
                            ))):(<div className="min-h-20">No Future Reservations!</div>)}
                        </div>
                    </div>
                    }
                    {(sortBy=="past" || sortBy=="all") &&
                    <div>
                        <div className="text-2xl font-bold">Past Reservations</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastData && pastData.length >0 ? (
                                pastData.map((reservation,index) => (
                            <HotelCard key={index} reservation={reservation} type="past"/>
                            ))):(<div className="min-h-20">No Past Reservations!</div>)}
                        </div>
                    </div>
                    }
                </div>
                
            </div>
        </div>
    )
};

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [item,setItem] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(true);
    
    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/student/api/student/profile/', {
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
                first_name: data.user.first_name,
                last_name: data.user.last_name,
                address: data.address,
                dob: data.dob,
                city: data.city,
                phone_number: data.phone_number,
                university_name: data.university_name,
            });
            setItem({
                username: data.user.username,
                email: data.user.email,
                first_name: data.user.first_name,
                last_name: data.user.last_name,
                address: data.address,
                dob: data.dob,
                city: data.city,
                phone_number: data.phone_number,
                university_name: data.university_name,
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
            first_name: item.first_name,
            last_name: item.last_name,
            dob: item.dob,
            phone_number: item.phone_number,
            address: item.address,
            university_name: item.university_name,
        };
        console.log(formData);
        //submit profile edit here
        try {
            const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/student/api/student/profile/', {
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
            console.log('Edit successful:', data);
        }catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setItem({
        ...item,
        [name]: type==='file' ? files[0] : value
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
        return <div>Loading...</div>;
    }

    return (
        <div className='min-h-screen'>
            
            <div className="flex justify-between items-center text-2xl font-bold px-5">
                Profile
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
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="email">
                        E-mail
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="email" name="email" type="text" value={item.email}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="first_name">
                        First Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="first_name" name="first_name" type="text" value={item.first_name}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="last_name">
                        Last Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="last_name" name="last_name" type="text" value={item.last_name}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="dob">
                        Date of Birth
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="dob" name="dob" type="date" value={item.dob}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="phone_number">
                        Phone No.
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="phone_number" name="phone_number" type="text" value={item.phone_number}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="address">
                        Address
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="address" name="address" type="text" value={item.address}/>
                </div>
                {/*<div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="university_name">
                        University
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                        readOnly={isReadOnly} onChange={handleChange} id="university_name" name="university_name" type="text" value={item.university_name}/>
                </div>
                <div className="flex border-b py-3 items-center">
                    <label className="w-1/3 block text-gray-700 text-xl font-bold mr-4" htmlFor="university_id_proof">
                        University Proof
                    </label>
                    <input
                        type="file"
                        id="university_id_proof"
                        className="register-input"
                        name="university_id_proof"
                        readOnly={isReadOnly}
                        onChange={handleChange}
                        required
                        accept="image/png, image/jpeg, application/pdf"
                    />
                </div>*/}
                {isReadOnly && (
                <div className="flex justify-end">
                    <button onClick={toggleReadOnly} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Edit
                    </button>
                </div>
                )}
                {!isReadOnly && (
                <div className="flex justify-end">
                    <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Save
                    </button>
                    <button onClick={handleCancel} className="ml-2 p-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                        Cancel
                    </button>
                </div>
                )}
            </form>
            </div>
        </div>
    )
}

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishData, setWishData] = useState([]);
    const [imageError, setImageError] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleImageError = () => {
      setImageError(true);
    };
    useEffect(() => {
        const fetchWishes = async () => {
          try {
            const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/student/api/favourite/', {
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
            setWishData(data);
            console.log(data);

          } catch (error) {
            //setError(error.message); // Handle errors
          } finally {
            //setLoading(false); // Always set loading to false when request finishes
          }
        };
        fetchWishes();
    }, []);

    const [notifications, setNotifications] = useState([]);

    const addNotification = (message) => {
        setNotifications([...notifications, message]);
        setTimeout(() => {
            setNotifications(notifications.filter((item) => item !== message));
        }, 5000); // auto-remove after 5 seconds
    };
    const removeFav = async(hotel_id) => {
        //e.preventDefault();
        console.log(hotel_id);
        try {
            const response = await fetch(`http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/student/api/favourite/${hotel_id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('authToken'),
                },
                //body: JSON.stringify({hotel_id: hotel_id}),
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                throw new Error(data.detail || 'Remove failed');
            }
            //setEditOpen(0);
            setMessage({ type: 'error', content: data.message });
            setTimeout(() => {
                window.location.reload();
                setMessage({type: '', content: ''});
            }, 5000);
        } catch (error) {
            setMessage({ type: 'error', content: error.message });
            setTimeout(() => {
                setMessage({type: '', content: ''});
            }, 5000);
        }
    }

    const goHotel = (reservation) => {
        console.log(reservation);
    
        navigate('/hotel-details', {
            state: {
                hotelData: {
                    address: reservation.address1,
                    average_rating: reservation.average_rating,
                    cancellation_policy: reservation.cancellation_policy,
                    check_in_time: reservation.check_in_time,
                    check_out_time: reservation.check_out_time,
                    description: reservation.description,
                    facilities: reservation.facilities,
                    hotel_id: reservation.hotel_id,
                    hotel_name: reservation.hotel_name,
                    hotel_photos: reservation.hotel_photos,
                    hotel_reviews: reservation.hotel_reviews,
                    phone_number: reservation.phone_number,
                    rooms: reservation.rooms,
                    student_discount: reservation.student_discount,
                    tourist_spots: reservation.tourist_spots,
                },
                searchData: {
                    check_in: reservation.check_in_date,
                    check_out: reservation.check_out_date,
                    guests: reservation.guests,
                    location: reservation.location,
                }
            }
        });  
    };
    
    return (
        <div className=''>
            <div className="flex justify-between items-center text-2xl font-bold px-3">
                Wishlist
            </div>
            {message.content && (
                <div className={`fixed top-16 right-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.content}
                </div>
            )}
            <div className='p-3 m-3 min-h-screen rounded-md bg-white'>
                <div>
                    <div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishData && wishData.length >0 ? (
                                wishData.map((reservation,index) => (
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                        <div className="relative" onClick={() => goHotel(reservation)}>
                                        <img 
                                        src={imageError ? "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg" : `http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com${reservation.hotel_photos}`}
                                        alt={reservation.hotel_name}
                                            onError={handleImageError}
                                            className="w-full h-64 object-cover"
                                        />
                                        </div>
                                        
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{reservation.hotel_name}</h3>
                                            <span className="font-semibold whitespace-nowrap">{reservation.address1}, {reservation.city}, {reservation.country}</span>

                                            <div className="border-t pt-4">
                                                    <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={()=>removeFav(reservation.id)}>
                                                        Remove
                                                    </button>
                                            </div>
                                        </div>
                                    </div>
                            ))):(<div className="min-h-20">Wishlist Empty!</div>)}
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
      );
}


const Layout = ({ children }) => (
    <div className="">
      <Header />
      <main className=" bg-gray-100">
        
        {children}
      </main>
      <footer className="bg-gray-800 text-gray-200 py-6">
        <div className="max-w-screen mx-auto px-6 flex flex-wrap justify-between items-start">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <a href="/" className="text-3xl font-bold text-blue-500 flex items-center mb-2 no-underline">
              <Navigation className="mr-2" />
              CampusVacay.
            </a>
            <p className="text-gray-400 text-sm">We kaboom your beauty holiday instantly and memorable.</p>
          </div>
          <div className="w-full md:w-1/3 text-right">
            <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>Phone: +1-234-567-890</li>
              <li>Email: support@campusvacay.com</li>
              <li>Address: 123 Vacation Lane, Dream City, Holiday State</li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="bg-[#3252DF] text-white h-11 flex items-center justify-center text-center text-sm">
        <p>&copy; {new Date().getFullYear()} CampusVacay. All rights reserved.</p>
      </div>
    </div>
);
  
const Header = () => {
    const [token, setToken] = useState(null);
    const [loginType, setLoginType] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
  
    const navigate = useNavigate(); // Hook for navigation
    
    useEffect(() => {
      setLoginType(localStorage.getItem('type'));
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
      }
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const handleLogout = async () => {
      try {
        const url = `http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/student/api/logout/`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('authToken'),
          },
          body: JSON.stringify(''),
        });
  
        const responseData = await response.json();
  
        if (!response.ok) {
          throw new Error(responseData.detail || JSON.stringify(responseData) || 'Logout failed');
        }
  
        setMessage({ type: 'success', content: 'Logout successful!' });
        localStorage.removeItem('authToken');
        setToken(null);
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        setMessage({ type: 'error', content: error.message });
      }
    };
  
    return (
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-screen mx-auto px-6 flex justify-between items-center">
          <a href="/" className="text-3xl font-bold text-blue-700 flex items-center no-underline">
            <Navigation className="mr-2" />
            CampusVacay.
          </a>
          
          <div className="flex items-center space-x-4">
            
          {token ? (
            <button onClick={handleLogout} className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
              Logout
            </button>
          ) : (
            <a href="/login" className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
              Login
            </a>
          )}
        </div>
        </div>
        {message.content && (
          <div className={`fixed top-16 right-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.content}
          </div>
        )}
      </header>
    );
};

const StudentDashboardPage = () => {
    const [page, setPage] = useState('profile');

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
        <Layout>
        <div className="max-w-screen mx-auto px-6 flex h-full justify-between">
            <div className="w-1/5 my-20 min-h-screen rounded-md bg-white">
                <div className='p-1'>
                    <ul className="list-none p-0 m-0">
                        <li className="p-2 hover:cursor-pointer hover:bg-gray-200" onClick={()=>setPage('profile')}>Profile</li>
                        <li className="p-2 hover:cursor-pointer hover:bg-gray-200" onClick={()=>setPage('reservations')}>Reservations</li>
                        <li className="p-2 hover:cursor-pointer hover:bg-gray-200" onClick={()=>setPage('wishlist')}>Wishlist</li>
                    </ul>
                </div>
            </div>
            <div className='w-4/5 mt-20 h-full'>
                <div className='p-1 min-h-screen'>
                    {page==='profile' && (<Profile/>)}
                    {page==='reservations' && (<Reservations/>)}
                    {page==='wishlist' && (<Wishlist/>)}
                </div>
            </div>
        </div>
        </Layout>
    );
};

export default StudentDashboardPage;