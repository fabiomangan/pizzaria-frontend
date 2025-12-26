"use server"

export async function registerAction(prevState: {success: boolean; error: string;} | null, formData: FormData)
{
    
    console.log("Clicouuu");

    const name = formData.get("name") as string;

    console.log(name);
    

    return { success: true, error: "" };
    
};