import React from 'react';
import '../App.css'
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
function AppLayout() {
    return ( 
        <div className=' '>
        <div className='grid-back'></div>
           <main className='min-h-screen container ml-10'>
                <Header/>
               <Outlet/> 

            </main>
            <div className='p-10 text-center bg-gray-800 mt-10 w-full'>Made with aman</div>
        </div>
     );
}

export default AppLayout;