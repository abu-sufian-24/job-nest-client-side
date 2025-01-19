import axios from 'axios'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate, useParams } from 'react-router-dom'
import UseAuth from '../hooks/UseAuth'
import Swal from 'sweetalert2'

const UpdateJob = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [job, setJobs] = useState()
  const { id } = useParams()
  const { user } = UseAuth()
  const navigate = useNavigate()

  useEffect(() => {
    axios(`http://localhost:9000/job/${id}`)
      .then((res) => {
        setJobs(res.data)
        setStartDate(res.data.deadline)
      })
  }, [id])

  const {
    job_title,
    email,
    category,
    min_price,
    max_price,
    description,
    total_bids,
    _id
  } = job || {};

  function handleSubmit(e) {
    e.preventDefault()

    const job_title = e.target.job_title.value;
    const email = e.target.email.value;
    const category = e.target.category.value;
    const min_price = e.target.min_price.value;
    const max_price = e.target.max_price.value;
    const description = e.target.description.value;
    


    const updateJob = {
      job_title,
      buyer: {
        name: user?.displayName,
        email: user?.email,
        Image: user?.photoURL
      },
      email,
      category,
      min_price,
      max_price,
      description,
      deadline: startDate,
      total_bids: total_bids
    };
    try {
      axios.put(`http://localhost:9000/job/${_id}`, updateJob)
        .then((res) => {
          if (res.data) {
             Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });

          }
          e.target.reset()
          navigate("/my-posted-jobs")

        })
    } catch (error) {
      console.log(error);

    }



  }

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-306px)] my-12'>
      <section className=' p-2 md:p-6 mx-auto bg-white rounded-md shadow-md '>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>
          Update a Job
        </h2>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='job_title'>
                Job Title
              </label>
              <input
                defaultValue={job_title}
                id='job_title'
                name='job_title'
                type='text'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>
                Email Address
              </label>
              <input
                defaultValue={email}
                id='emailAddress'
                type='email'
                name='email'
                disabled
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700'>Deadline</label>

              <DatePicker
                className='border p-2 rounded-md'
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>

            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700 ' htmlFor='category'>
                Category
              </label>
              {category &&
                <select
                  defaultValue={category}
                  name='category'
                  id='category'
                  className='border p-2 rounded-md'
                >
                  <option value='Web Development'>Web Development</option>
                  <option value='Graphics Design'>Graphics Design</option>
                  <option value='Digital Marketing'>Digital Marketing</option>
                </select>
              }
            </div>
            <div>
              <label className='text-gray-700 ' htmlFor='min_price'>
                Minimum Price
              </label>
              <input
                defaultValue={min_price}
                id='min_price'
                name='min_price'
                type='number'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='max_price'>
                Maximum Price
              </label>
              <input
                defaultValue={max_price}
                id='max_price'
                name='max_price'
                type='number'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='text-gray-700 ' htmlFor='description'>
              Description
            </label>
            <textarea
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              name='description'
              defaultValue={description}
              id='description'
              cols='30'
            ></textarea>
          </div>
          <div className='flex justify-end mt-6'>
            <button type='submit' className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transhtmlForm bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default UpdateJob
