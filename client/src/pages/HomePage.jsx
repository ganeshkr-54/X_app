import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import Foryou_Feed from '../components/Foryou_Feed';
import Following_Feed from '../components/Following_Feed';
import PostInputCard from '../components/PostInputCard';
import { useDispatch } from 'react-redux';

function HomePage() {
  const dispatch = useDispatch();

  return (
    <div className="max-w-[600px] lg:max-w-[700px] mx-auto w-full min-h-screen border-x border-gray-200">
      <Tab.Group>
        <Tab.List className="flex w-full border-b border-gray-200 bg-white sticky top-0 z-10">
          <Tab className={({ selected }) =>
            `w-1/2 py-4 text-sm font-medium focus:outline-none ${
              selected 
                ? 'text-black border-b-4 border-blue-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`
          }>
            For you
          </Tab>
          <Tab className={({ selected }) =>
            `w-1/2 py-4 text-sm font-medium focus:outline-none ${
              selected 
                ? 'text-black border-b-4 border-blue-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`
          }>
            Following
          </Tab>
        </Tab.List>

        <div className="px-4">
          <PostInputCard />
          
          <Tab.Panels>
            <Tab.Panel>
              <Foryou_Feed />
            </Tab.Panel>
            <Tab.Panel>
              <Following_Feed />
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
}

export default HomePage;