
// Your web app's Firebase configuration

var firebaseConfig = {
    apiKey: "AIzaSyDWXGIZ_90a8ddSq9KV8OZEIV6ZddKLZPQ",
    authDomain: "convocation20-6aeda.firebaseapp.com",
    databaseURL: "https://convocation20-6aeda.firebaseio.com",
    projectId: "convocation20-6aeda",
    storageBucket: "convocation20-6aeda.appspot.com",
    messagingSenderId: "139731864775",
    appId: "1:139731864775:web:3329107cd786d23e0782e2",
    measurementId: "G-TKDWHBDRY6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  var databaseRef = firebase.database();
 
 

document.getElementById('contactForm').addEventListener('submit', submitForm);
document.getElementById("roll").addEventListener("input", loadName);

function loadName() {
  
 
  databaseRef.ref("eligible/").orderByChild("roll").equalTo(getInputVal('roll')).once("value",snapshot => {
    if (snapshot.exists()){
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        document.getElementById("name_eng").value = childData.name_eng;
        
      });
    } else{
      document.getElementById("name_eng").value = "";
      console.log("doesnot exist");
    }
});
var file_hin;
}
document.getElementById('name_hin_file').addEventListener('change', function(evt) {
  var firstFile = evt.target.files[0] // upload the first file only
  file_hin = firstFile
  
});

function submitForm(e){
    e.preventDefault();

    // Get Values
    var roll = getInputVal('roll');
    var name_eng = getInputVal('name_eng');
    var name_hin = getInputVal('name_hin');
    var dob = getInputVal('dob');
    var name_father = getInputVal('name_father');
    var email = getInputVal('email');
    var phone = getInputVal('phone');
    var gender = getOptionVal('gender');
    var nationality = getInputVal('nationality');
    var department = getOptionVal('department');
    var program = getOptionVal('program');
    var category = getOptionVal('category');
    var no_accompanying = getOptionVal ('no_accompanying');
    var name_accompanying1 = getInputVal('name_accompanying1');
    var age_accompanying1 = getInputVal('age_accompanying1');
    var name_accompanying2 = getInputVal('name_accompanying2');
    var age_accompanying2 = getInputVal('age_accompanying2');
    var transaction_mode = getOptionVal('transaction_mode');
    var bank_name = getInputVal('bank_name');
    var transaction_id = getInputVal('transaction_id');
    var transaction_date = getInputVal('transaction_date');
    var file = file_hin
    




    console.log(roll + " " + name_eng + " " + name_hin + " " + dob );
    //save message
    saveData(roll, name_eng, name_hin, dob, name_father, email, phone, gender, nationality, department, program, category, no_accompanying, 
      name_accompanying1, age_accompanying1, name_accompanying2, age_accompanying2, transaction_mode, bank_name, transaction_id, transaction_date, file);
    
}
function getOptionVal(id){
  var e = document.getElementById(id);
  var option = e.options[e.selectedIndex].text;
  return option;
}

function getFile(id){
  var e = document.getElementById(id);
  return e.target.files[0];
}

function getInputVal(id){
    return document.getElementById(id).value;
  }

function saveData(roll, name_eng, name_hin, dob, name_father, email, phone, gender, nationality, department, program, category, no_accompanying, 
  name_accompanying1, age_accompanying1, name_accompanying2, age_accompanying2, transaction_mode, bank_name, transaction_id, transaction_date, file){
    
  databaseRef.ref("eligible/").orderByChild("roll").equalTo(getInputVal('roll')).once("value",snapshot => {
    if (snapshot.exists()){
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        if(dob == childData.dob && childData.status == "0"){
        var newDetails = databaseRef.ref("allumni/" + roll);
        var updateStatus = databaseRef.ref("eligible/" + roll);
       
       
        var storageRef = firebase.storage().ref('name_hin/'+roll);
        var task = storageRef.put(file);
        task.on('state_changed', function (snapshot) {
      
        }, function error(err) {
          showAlert("Error Uploading Name");
      
        },function () {

          task.snapshot.ref.getDownloadURL().then(function(downloadURL){
            newDetails.set({
       
              roll: roll,
              name_eng: name_eng,
              name_hin: name_hin,
              dob: dob,
              name_father: name_father,
              email: email,
              phone:phone,
              gender:gender,
              nationality: nationality,
              department: department,
              program: program,
              category: category,
              no_accompanying: no_accompanying,
              name_accompanying1:name_accompanying1,
              age_accompanying1: age_accompanying1,
              name_accompanying2: name_accompanying2,
              age_accompanying2: age_accompanying2,
              transaction_mode: transaction_mode,
              bank_name: bank_name,
              transaction_id: transaction_id,
              transaction_date: transaction_date,
              name_hin_url: downloadURL
          });
          var updates = {};
          updates ['/status'] = "1"; 
           updateStatus.update(updates);
           showAlert("You Have Registered Successfully");
        

           //clear form
           document.getElementById('contactForm').reset();
   
          });
             // Show alert
       
        });
       

      }else if(childData.status == "1"){
        showAlert("Already Filled the form");
      }else if(dob!= childData.dob){
        showAlert("Roll and DOB did not match");
      }
      });
    } else{
      showAlert("Roll No. does not exist.")
    }
});
    
  

    
    
// var newDetails = databaseRef.ref("eligible/" + roll);
// newDetails.set({
   
//       roll: roll,
//       name_eng: name_eng,
//       dob: dob, 
//       status: '0'
    
//   });

}

function showAlert(msg){
  document.getElementById("alert").innerHTML = msg;
        document.querySelector('.alert').style.display = 'block';
        setTimeout(function(){
          document.querySelector('.alert').style.display = 'none';
        }, 3000);
}