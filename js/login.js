// login

window.onload = function(){

	var un = document.getElementById('un');
	var pw = document.getElementById('pw');
	var loginbtn = document.getElementById('subm');

	
	loginbtn.onclick = function(){
		document.getElementById('warn').innerHTML = '';
		$.ajax({
			url:"./server/login-server.php",
			type:"POST",
			dataType:"JSON",
			data:{
			
				email:email.value,
				pw:pw.value
				
				},
			success:function(resp){
				
			
				
				if(resp.status == 'success'){
					
					window.location = "./dashboard.php"
					
				} else if(resp.status == 'fail'){
					
					document.getElementById('warn').innerHTML = "Sorry, wrong email or password";
						
				}
				
				
				
			},
			 error: function(jqXHR, textStatus, errorThrown) {
                        //console.log(jqXHR.statusText, textStatus, errorThrown);
                        console.log(jqXHR.statusText, textStatus);
                  
			
		
			}
			
		});	
					  
              
	
		
		
	};
};