//function doc() that serves as an alias for document.querySelector()

function doc(x){
return document.querySelector(x);
}//end doc

function docAll(x){
	return document.querySelectorAll(x);
}

//anonymous function in blur eventListener checks for empty input and throws an error

doc("#first").addEventListener("blur",function(){
	if(doc("#first").value == "" && typeof doc("#first").value != "undefined")  //checks whether input is empty or not
	{
		doc(".first-li").innerHTML = "x First Name can't be empty.";
	}else{
		doc(".first-li").innerHTML = "";
	}
});//end blur eventListener for first name

doc("#last").addEventListener("blur",function(){
	if(doc("#last").value == "" && typeof doc("#last").value != "undefined")
	{
		doc(".last-li").innerHTML = "x Last Name can't be empty.";
	}else{
		doc(".last-li").innerHTML = "";
	}
});//end blur eventListener for last name

doc("#address").addEventListener("blur",function(){
	if(doc("#address").value == "" && typeof doc("#address").value != "undefined")
	{
		doc(".address-li").innerHTML = "x Address can't be empty.";
	}else{
		doc(".address-li").innerHTML = "";
	}
});//end blur eventListener for address

doc("#phone").addEventListener("blur",function(){
	if(doc("#phone").value == "" && typeof doc("#phone").value != "undefined")
	{
		doc(".phone-li").innerHTML = "x Phone Number can't be empty.";
	}else{
		doc(".phone-li").innerHTML = "";
	}
});//end blur eventListener for phone number

doc("#email").addEventListener("blur",function(){
	if(doc("#email").value == "" && typeof doc("#email").value != "undefined")
	{
		doc(".email-li").innerHTML = "x Email can't be empty.";
	}else{
		doc(".email-li").innerHTML = "";
	}
});//end blur eventListener for email

doc("#comments").addEventListener("blur",function(){
	if(doc("#comments").value == "" && typeof doc("#comments").value != "undefined")
	{
		doc(".comments-li").innerHTML = "x Comments can't be empty.";
	}else{
		doc(".comments-li").innerHTML = "";
	}
});//end blur eventListener for comments

doc("#rating").addEventListener("blur",function(){
	if(doc("#rating").value == "" && typeof doc("#rating").value != "undefined")
	{
		doc(".rating-li").innerHTML = "x Select a Rating";
	}else{
		doc(".rating-li").innerHTML = "";
	}
});//end blur eventListener for rating

//validate() is executed when submit button is clicked

function validate(form){
	var flag = [true, true,true]; //flag is boolean, set to true. Used to check empty inputs and phone pattern
	var emailFlag = true;
	const phoneRegex = new RegExp(/\([0-9]{3}\) [0-9]{3}-[0-9]{4}/); //regex for phone pattern
	const emailRegex = new RegExp(/^\w+([\.-_]?\w+)*@\w+([\.-_]?\w+)*(\.[a-z]{2,4})+$/);  //regex for email pattern allows ., - and _ in email address
	for(var i=0;i<8;i++)
	{
		if(form.elements[i].value == "" && typeof form.elements[i].value != "undefined")
		{
			flag[0]=false;
		}
	}//end validate
	var radioGroup = docAll('input[name="gender"]'); //
	if(radioGroup[0].checked || radioGroup[1].checked){
		flag[2] = true;
	}else{
		flag[2] = false;
	}

	if(!(phoneRegex.test(form.elements["phone"].value))){  //test() checks correct phone number patern

				flag[1]=false;

			}else{
				flag[1]=true;

			}

		if(!(emailRegex.test(form.elements["email"].value))) //test() checks correct email patern
			{
				emailFlag = false;
			}else{
				emailFlag = true;

			}


//if all input elements, textarea are not empty then display an alert

// if(flag[0] == true && flag[1] == true && flag[2] == true && emailFlag == true){
// 	var first=doc("#first").value; //stores value of first name
// 	var last=doc("#last").value; //stores value of last name
// 	 first = first.slice(0,1).toUpperCase() + first.slice(1,first.length).toLowerCase();
// 	 last = last.slice(0,1).toUpperCase() + last.slice(1,last.length).toLowerCase();
// 	alert("Hello "+first+" "+last+". Thanks for submitting a response.");
// 	}
}
