const DescriptionOfUser=document.getElementById('description').name
const nameOfUser=document.getElementById('name').name
const nameOfClub=document.getElementById('club').name

function alter_name(){
    const options={
        method:"PATCH",
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
            
        },
        body:JSON.stringify({
           name:alter_form.name.value.toString()!=''?alter_form.name.value.toString():nameOfUser,
           Description:alter_form.description.value.toString()!=''?alter_form.description.value.toString():DescriptionOfUser,
           club:alter_form.club.value.toString()!=''?alter_form.club.value.toString():nameOfClub
           
        })
        
    }
   
fetch("http://127.0.0.1:8000/KickIt/profileUpdate/:id",options).then((response)=>{
   
  return response.json()}).then((json)=>{
    console.log(json)
})
}