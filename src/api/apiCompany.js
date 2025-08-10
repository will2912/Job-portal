import supabaseClient, { URL } from "@/utils/supabase";

export async function getCompanies(token){
    const supabase = await supabaseClient(token);
    const query = await supabase.from("companies").select("*");
    const {data, error}= query;
    
    if(error){
        console.error("error in getCompanies" , error);
    }
    return data;
}

export async function addNewCompany(token, _, companyData) {
    console.log("jojdjsdv")
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) {console.log("Error uploading Company Logo")}

  const logo_url = `${URL}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: logo_url,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Companys");
  }

  return data;
}