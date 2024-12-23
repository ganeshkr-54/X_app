import React from 'react'
import NotificationPage from '../pages/NotificationPage'
import techImage from '../assets/images/image.png'

function Sidebar2() {
  return (
    <div className="overflow-x-hidden w-full flex flex-col space-y-2">
      <div className="w-full max-w-xs overflow-hidden h-[65vh] -ml-6 ">
        <NotificationPage />
      </div>
      <div className='m-2 '>
        <div className='text-lg font-bold text-center mb-2 bg-gray-100 rounded-md'>News feed</div>
        <img src={techImage} alt='tech Image' className='h-full w-full rounded-lg object-cover mb-2'/>
    <a href="https://techjury.net/blog/new-technology-trends/" target="_blank" className='hover:text-blue-500'>
      Learn more about new technology trends
    </a>
      </div>
    </div>
  )}

export default Sidebar2
