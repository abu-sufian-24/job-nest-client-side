import axios from 'axios';
import { compareAsc, format } from 'date-fns';
import { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';
import UseAuth from '../hooks/UseAuth';
import Swal from 'sweetalert2';

const JobDetails = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [job, setJob] = useState({});
  const { id } = useParams();
  const { user } = UseAuth();
  const navigate = useNavigate()

  useEffect(() => {
    axios(`http://localhost:9000/job/${id}`)
      .then((res) => {
        setJob(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const {
    job_title,
    category,
    min_price,
    max_price,
    buyer,
    description,
    deadline,
    _id
  } = job;

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const price = e.target.price.value;
    const comment = e.target.comment.value;
    const deadlineBit = startDate;



    // Check if the user is the buyer
    if (buyer?.email === user?.email) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Action Not Allowed!',
        text: 'You cannot purchase your own item. Please use a different account.',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    // Validate price
    if (parseFloat(max_price) < parseFloat(price)) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Price exceeds the maximum limit!',
        text: `The price cannot be more than ${max_price}. Please adjust your input.`,
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    // Validate deadline
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    if (deadlineDate < currentDate) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Deadline Passed!',
        text: `The deadline of ${format(deadlineDate, 'PP')} has already passed. Please update your submission date.`,
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    const bidData = {
      email,
      price,
      comment,
      job_title,
      buyer: buyer?.email,
      category,
      deadline: deadlineBit,
      jobId: _id,
      status: 'pending'
    };

    //  send data to the data base

    try {
      axios.post(`http://localhost:9000/bids`, bidData)
        .then((res) => {
          if (res.data.insertedId) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'you have successfully bids',
              showConfirmButton: false,
              timer: 1500
            });

          }
          e.target.reset()
          navigate("/my-bids")

        })
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'you have already bid on this job',
        showConfirmButton: false,
        timer: 1500
      });

    }
  };

  return (
    <div className='flex flex-col md:flex-row justify-around gap-5 items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto'>
      {/* Job Details */}
      <div className='flex-1 px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]'>
        <div className='flex items-center justify-between'>
          {deadline ? (
            new Date(deadline) > new Date() ? (
              <span className='text-sm font-light text-gray-800'>
                Deadline: {format(new Date(deadline), 'PP')}
              </span>
            ) : (
              <span className='text-lg bg-red-100 p-2 rounded-md font-light text-red-600'>Deadline has passed</span>
            )
          ) : (
            <span className='text-sm font-light text-gray-800'>Loading deadline...</span>
          )}

          <span className='px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full'>
            {category}
          </span>
        </div>
        <div>
          <h1 className='mt-2 text-3xl font-semibold text-gray-800'>{job_title}</h1>
          <p className='mt-2 text-lg text-gray-600'>{description}</p>
          <p className='mt-6 text-sm font-bold text-gray-600'>Buyer Details:</p>
          <div className='flex items-center gap-5'>
            <div>
              <p className='mt-2 text-sm text-gray-600'>Name: {buyer?.name}</p>
              <p className='mt-2 text-sm text-gray-600'>Email: {buyer?.email}</p>
            </div>
            <div className='rounded-full object-cover overflow-hidden w-14 h-14'>
              <img referrerPolicy='no-referrer' src={buyer?.Image} alt='' />
            </div>
          </div>
          <p className='mt-6 text-lg font-bold text-gray-600'>Range: ${min_price} - ${max_price}</p>
        </div>
      </div>

      {/* Place A Bid Form */}
      <section className='p-6 w-full bg-white rounded-md shadow-md flex-1 md:min-h-[350px]'>
        <h2 className='text-lg font-semibold text-gray-700 capitalize'>Place A Bid</h2>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700' htmlFor='price'>Price</label>
              <input
                id='price'
                type='text'
                name='price'
                required
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700' htmlFor='emailAddress'>Email Address</label>
              <input
                defaultValue={user?.email}
                id='emailAddress'
                type='email'
                name='email'
                readOnly
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700' htmlFor='comment'>Comment</label>
              <input
                id='comment'
                name='comment'
                type='text'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-gray-700'>Deadline</label>
              <DatePicker
                className='border p-2 rounded-md'
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
          </div>

          <div className='flex justify-end mt-6'>
            <button
              type='submit'
              className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>
              Place Bid
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default JobDetails;
