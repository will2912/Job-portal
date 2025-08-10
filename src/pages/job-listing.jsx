import { useSession, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { getJobs, getSavedJobArray } from "@/api/ApiJobs";
import useFetch from "@/hooks/useFetch";
import JobCard from "@/components/JobCard";
import { getCompanies } from "@/api/apiCompany";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { State } from "country-state-city";

function Joblisting() {
   // const {session} = useSession();
   // const fetchJobs = async ()=>{
   //    const supabaseAccessToken = await session.getToken({
   //       template:"supabase",
   //    });
   //    const data = await getJobs(supabaseAccessToken);
   //    console.log(data); 
   // }
   const {isLoaded}=useUser();
   const[searchQuery,setSearchQuery]=useState();
   const[CompayId,setCompayId]=useState();
   const[Location,setLocation]=useState(undefined);

   const {fn: fnJobs,data:jobs, loading: loadingJobs}=useFetch(getJobs)
   const {fn: fnCompanies,data:Companies, loading: loadingCompanies}=useFetch(getCompanies)
   
   const { user } = useUser();
  
  
   useEffect(()=>{
      
      fnJobs(undefined,{
      location:Location,company_id:CompayId,search_query:searchQuery,   
   });
       
   },[isLoaded,Location,CompayId,searchQuery])
   useEffect(()=>{
      if(isLoaded){fnCompanies();}
      
       
   },[isLoaded])

   const handleSearch=(e)=>{
     
      e.preventDefault();
      const formData = new FormData(e.target);
      const query = formData.get("search-query");      if(query)setSearchQuery(query);
   }





    if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  
    return ( 
        <div>
           <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
               Latest Jobs
            </h1>

         <form
            onSubmit={handleSearch}
            className="h-14 flex flex-row w-full gap-2 items-center mb-3"
            >
            <Input
               type="text"
               placeholder="Search Jobs by Title.."
               name="search-query"
               className="h-full flex-1  px-4 text-md"
            />
            <Button type="submit" className="h-full sm:w-28" variant="blue">
               Search
            </Button>
         </form>
         <div className="flex ">
            <Select  value={Location} onValueChange={(value)=> setLocation(value)} >
            <SelectTrigger className="w-[180px]">
               <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
               {State.getStatesOfCountry("IN").map(({name})=>{
                  return (
                     
                     <SelectItem key={name} value={name}>{name}</SelectItem>
                  )
               })}     
            </SelectContent>
         </Select>
         <Select  value={CompayId} onValueChange={(value)=> setCompayId(value)} >
            <SelectTrigger className="w-[180px]">
               <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
               {Companies?.map((company)=>{
                  return (
                     <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  )
               })}     
            </SelectContent>
         </Select>
         </div>
         

            {loadingJobs && (
                <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
            )}
           {loadingJobs===false&&(
               <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs?.length?(
                     jobs.map((job)=>{ return <JobCard key={job.id} job={job}  />})
                  ):(
                     <div>no jobs</div>
                  )}
               </div>
            )}
            
        </div>
     );
}

export default Joblisting;