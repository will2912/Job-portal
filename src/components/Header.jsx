import {useState,useEffect} from 'react';

import { Link, useSearchParams } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { BriefcaseBusiness, PenBox,Heart } from "lucide-react";
import { Button } from "./ui/button";
function Header() {
    const {user}=useUser();
    const [search,setSearch]=useSearchParams();
    useEffect(()=>{
        if(search.get("sign-in")){
            setShowSignIn(true);
        }
    },[search])

    const [showSignIn,setShowSignIn]=useState(false);
    const handleOverlayClick=(e)=>{
       if (e.target==e.currentTarget){
        setShowSignIn(false);
        setSearch({});
       }
    }
    return ( 
        <>

       
    <nav className="py-4 flex justify-between items-center ">
        <Link>
            <img src="/logo.png" className="h-20" />
        </Link>
        <div className="flex gap-8 ">
          <SignedOut>
            <Button variant="outline" onClick={()=>setShowSignIn(true)}>Login</Button>      
          </SignedOut>
          <SignedIn>        
            {user?.unsafeMetadata?.role==="recruiter"&&(<Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                <PenBox size={20} className="mr-2"/> 
                Post a job
                </Button> 
            </Link>)}
            <UserButton
            appearance={{
                    elements:{
                        avatarBox:"w-10 h-10",
                    },
                }}
            >
               <UserButton.MenuItems>
                <UserButton.Link 
                    label="My Jobs" 
                    labelIcon={<BriefcaseBusiness size={15}/>}
                    href='my-jobs'
                />
                <UserButton.Link 
                    label="Saved Jobs"
                    labelIcon={<Heart size={15}/>}
                    href='/saved-jobs'
                />
                </UserButton.MenuItems> 
            </UserButton>         
          </SignedIn>         
        </div>        
    </nav>
    {showSignIn&& (<div
        onClick={handleOverlayClick}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
        <SignIn 
        signUpForceRedirectUrl='/onboarding'
        fallbackRedirectUrl='/onboarding'
        />
        </div>)}

         </>
    );
}

export default Header;