 function myFunction() {
  
  var elements = document.getElementsByClassName("loggedin");
  for(var i = 0; i < elements.length; i++){
    elements[i].style.display = 'none';
  }
}

window.onload = myFunction;
	