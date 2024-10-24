
const cl=console.log;
const postscontainer=document.getElementById('postscontainer');
const postsform=document.getElementById('postsform');
const titlecontrol=document.getElementById('title');
const contentcontrol=document.getElementById('content');
const useridcontrol=document.getElementById('userid');
const submitBtn  = document.getElementById('submitBtn');
const updateBtn  = document.getElementById('updateBtn');
const loader =document.getElementById('loader');

const BASE_URL=`https://jsonplaceholder.typicode.com`;

const POSTS_URL=`${BASE_URL}/posts`;

const snackBar = (msg,icon) => {
   swal.fire({
      title : msg,
      icon : icon,
      timer : 2500
   })
}

const onEdit = (ele) => {
    let EDIT_ID = ele.closest('.card').id;
    localStorage.setItem('EdIT_ID',EDIT_ID);
    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();

    xhr.open('GET', EDIT_URL)
    
    xhr.send()

    xhr.onload = function(){
      if(xhr.status >=200 && xhr.status < 300){
         
         let EDIT_POST = JSON.parse(xhr.response)
         
         updateBtn.classList.remove('d-none');
         submitBtn.classList.add('d-none')

         titlecontrol.value = EDIT_POST.title;
         contentcontrol.value = EDIT_POST.body;
         useridcontrol.value = EDIT_POST.userId;
   
         loader.classList.add('d-none');

      }else{
         loader.classList.add('d-none');
      }
      
    }
}

const onRemove = (ele) => {
  let getConfirm = confirm(`Are you sure you want to remove this post?`)
  if(getConfirm){
   loader.classList.remove('d-none');
   let REMOVE_ID = ele.closest('.card').id;
   let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`;

   let xhr = new XMLHttpRequest();
   xhr.open('DELETE', REMOVE_URL);
   xhr.send();

   xhr.onload= () => {
      if(xhr.status >= 200 && xhr.status < 300){
         ele.closest('.card').remove();
         loader.classList.add('d-none');
         snackBar(`Post is removed successfully !!!`, 'success')
      }
   }
  }
}

const createcards=(arr)=>{
    let result=``;
    for (let i = 0; i< arr.length; i++) {
        
        result+=`<div class="card mb-3" id="${arr[i].id}">
                  <div class="card-header">
                     <h4>${arr[i].title}</h4>
                  </div>
                  <div class="card-body">
                     <p>${arr[i].body}</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between">
                     <button class="btn btn sm btn-info" onClick="onEdit(this)">Edit</button>
                     <button class="btn btn sm btn-danger" onClick="onRemove(this)">Remove</button>
                  </div>
                  </div>`
        postscontainer.innerHTML=result;
}
    }


//API CALL to get posts data

let postsArr;

const fetchallposts=()=>{
   loader.classList.remove('d-none');
     //1 create xhr instance
    let xhr=new XMLHttpRequest()

//2 configuration of API call
xhr.open('GET',POSTS_URL)

xhr.setRequestHeader("content-type","application/json");
xhr.setRequestHeader("Authorization","Bearer token(which is stored in local storage)");


//3 send
xhr.send()

//4 onload
xhr.onload=function(){
   if (xhr.status>=200 && xhr.status <=299){
        postsArr= JSON.parse(xhr.response);
    //    cl(postsArr)
      createcards(postsArr);
      loader.classList.add('d-none');
   }
} 

}
fetchallposts();

const onpostadd=(eve)=>{
   eve.preventDefault();
   let newpost={
      title:titlecontrol.value,
      body:contentcontrol.value,
      userid:useridcontrol.value
   }
    //   cl(newpost);

    loader.classList.remove('d-none');
   //API call send new post in db
    let xhr=new XMLHttpRequest();

    xhr.open("POST",POSTS_URL);

    xhr.setRequestHeader("content-type","application/json");
    xhr.setRequestHeader("Authorization","Bearer token(which is stored in local storage)");

    xhr.send(JSON.stringify(newpost));

    xhr.onload=function(){
      if(xhr.status>=200 && xhr.status<300){
        // cl(xhr.response);
          let data=JSON.parse(xhr.response)
        // postsArr.push(data)

         let card=document.createElement('div');
         card.className="card mb-3";
         card.id=data.id;

         card.innerHTML=`<div class="card-header">
                     <h4>${data.title}</h4>
                  </div>
                  <div class="card-body">
                     <p>${data.body}</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between">
                     <button class="btn btn sm btn-info" onClick="onEdit(this)">Edit</button>
                     <button class="btn btn sm btn-danger" onClick="onRemove(this)">Remove</button>
                  </div>`

                  postscontainer.append(card);

                  updateBtn.classList.remove('d-none');
                  submitBtn.classList.add('d-none');
                  loader.classList.add('d-none');
                  snackBar(`New Post is created successfully !!!`, 'success');

      }else{
         loader.classList.add('d-none');
         snackBar(`Something went wrong !!!`, 'error')
      }
    }

    xhr.onerror = () =>{
      loader.classList.add('d-none');
      snackBar(`Something went wrong !!!`, 'error')
    }

}


const onUpdatePost = () => {

   let UPDATE_ID = localStorage.getItem('EdIT_ID');

   let UPDATED_POST = {
      title:titlecontrol.value,
      body:contentcontrol.value,
      userid:+useridcontrol.value,
      id : +UPDATE_ID
   }

   let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`;
   loader.classList.remove('d-none');
   let xhr = new XMLHttpRequest();
   xhr.open('PATCH',UPDATE_URL);

   xhr.send(JSON.stringify(UPDATED_POST))

   xhr.onload = () =>{
      if(xhr.status >= 200 && xhr.status < 300){
         let data = JSON.parse(xhr.response)
         
         let card = [...document.getElementById(UPDATE_ID).children]
         card[0].innerHTML = `<h4>${UPDATED_POST.title}</h4>`;
         card[1].innerHTML = `<p>${UPDATED_POST.body}</p>`;

         updateBtn.classList.add('d-none');
         submitBtn.classList.remove('d-none');

         postsform.reset();

         loader.classList.add('d-none');
         snackBar(`Post is updated successfully !!!`, 'success')
      }
   }
}


postsform.addEventListener('submit',onpostadd);
updateBtn.addEventListener('click', onUpdatePost)


