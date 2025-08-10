import React from 'react';
import ProtectedRoutes from './components/protectedRoutes';
import { Button } from './components/ui/button';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import AppLayout from './Layout/app-layout';
import LandingPage from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Joblisting from './pages/job-listing';
import Jobpage from './pages/Job';
import Myjobs from './pages/My-jobs';
import Postjob from './pages/Post-job';
import Savejob from './pages/Savejob';
import { ThemeProvider } from './components/theme-provider';
import AddCompany from './pages/AddCompany';

const router = createBrowserRouter([
  {
    element:<AppLayout/>,
    children:[
      {
        path:'/',
        element:<LandingPage/>
      },
      {
        path:'/Onboarding',
        element:<ProtectedRoutes> <Onboarding/></ProtectedRoutes>
      },
      {
        path:'/jobs',
        element:<ProtectedRoutes><Joblisting/></ProtectedRoutes> 
      },
      {
        path:'/job/:id',
        element:<ProtectedRoutes><Jobpage/></ProtectedRoutes> 
      },
      {
        path:'/my-jobs',
        element:<ProtectedRoutes> <Myjobs/></ProtectedRoutes>
      },
      {
        path:'/Post-job',
        element:(<ProtectedRoutes><Postjob/></ProtectedRoutes> )
      },
      {
        path:'/saved-jobs',
        element:(<ProtectedRoutes><Savejob/></ProtectedRoutes>) 
      },
      {
        path:'/addCompany',
        element:(<ProtectedRoutes><AddCompany/></ProtectedRoutes>) 
      },
     
     
    ]
  }
])

function App() {
  return( 
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme ">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;










