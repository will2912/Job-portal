import { getCompanies } from "@/api/apiCompany";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { State } from "country-state-city";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/clerk-react";
import { postJob } from "@/api/ApiJobs";
import { BarLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { PenBox } from "lucide-react";



const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirement: z.string().min(1, { message: "Requirements are required" }),
});

function Postjob() {
    const {register,handleSubmit,control,formState:{errors},reset}=useForm({resolver: zodResolver(schema),})
    const {data:companyData,loading:companyloading,error:companyError,fn:companyFn}=useFetch(getCompanies);
    const {data:postData,loading:postLoading,error:postError,fn:postFn}=useFetch(postJob)
    const {user,isLoaded}=useUser()
    useEffect(()=>{
        companyFn();
    },[])
    const onSubmit = (data)=>{
        console.log("onsubmitttt...")
        postFn({
            ...data,
            recruiter_id:user.id,
            isOpen:true
        }).then(()=>{
            reset()
        })
    }
     if (!isLoaded || companyloading) {
            return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
        }
    return ( 
        <div className="flex flex-col items-center justify-center y-screen ">
            <div className="flex justify-between w-1/2"><h1 className="gradient-title font-extrabold sm:text-7xl text-center pb-8">
                Post a Job
            </h1>
                <Link to="/addCompany">
                <Button variant="destructive" className="rounded-full">
                <PenBox size={20} className="mr-2"/> 
                    Add New Company
                </Button> 
            </Link>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4  w-1/2">
                <Input
                    type="text"
                    placeholder="enter title"
                    {...register("title")}
                />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                <Textarea 
                    type="text"
                    placeholder="enter description"
                    {...register("description")}
                />
                {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
                )}
                <Controller
                    name="requirement"
                    control={control}
                    render={({ field }) => (
                        <MDEditor value={field.value} onChange={field.onChange} />
                    )}
                />
                 <div className="flex ">
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                        <Select value={field.value??""} onValueChange={field.onChange}>
                            <SelectTrigger>
                            <SelectValue placeholder="Job Location" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                {State.getStatesOfCountry("IN").map(({ name }) => (
                                <SelectItem key={name} value={name}>
                                    {name}
                                </SelectItem>
                                ))}
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                        )}
                    />
                     {errors.location && (
                    <p className="text-red-500">{errors.location.message}</p>
                    )}
                    <Controller
                        name="company_id"
                        control={control}
                        render={({ field }) => (
                        <Select value={field.value??" "} onValueChange={field.onChange}>
                            <SelectTrigger>
                            <SelectValue placeholder="Company">
                                {field.value
                                ? companyData?.find((com) => com.id === Number(field.value))
                                    ?.name
                                : "Company"}
                            </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                {companyData?.map(({ name, id }) => (
                                <SelectItem key={name} value={id}>
                                    {name}
                                </SelectItem>
                                ))}
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    
                    {errors.company_id && (
                    <p className="text-red-500">{errors.company_id.message}</p>
                    )}
             </div>
                        <Button variant="outline" type="submit">Submit</Button>
            </form>
            
        </div>
     );
}

export default Postjob;