import { addNewCompany } from '@/api/apiCompany';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useFetch from '@/hooks/useFetch';
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { z } from "zod";



const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only Images are allowed",
      }
    ),
});

const AddCompany = () => {
    const navigate=useNavigate();
    const {register,handleSubmit,control,formState:{errors},reset}=useForm({resolver: zodResolver(schema),})
    const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);
  const onSubmit = async (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };
  useEffect(() => {
    if (dataAddCompany) {
      navigate('/post-job'); 
    }
  }, [dataAddCompany, navigate]);
  return (
        <div className="flex flex-col items-center justify-center y-screen ">
             <h1 className="gradient-title font-extrabold sm:text-7xl text-center pb-8">
                Add A Company
            </h1>
                 <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4  w-1/2">
                    <Input placeholder="Company name" {...register("name")} />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                  <Input
                        type="file"
                        accept="image/*"
                        className=" file:text-gray-500"
                        {...register("logo")}
                    />
                    {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
                    <Button variant="outline" type="submit">Submit</Button>
                 </form>

            </div>
  )
}

export default AddCompany