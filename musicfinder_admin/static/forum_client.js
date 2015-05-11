
/**** START CONSTANTS****/
//True or False
var DEBUG = true,
COLLECTIONJSON = "application/vnd.collection+json",
DEFAULT_DATATYPE = "json",
ENTRYPOINT = "/musicfinder/api/" //Entry point is getUsers()
/**** END CONSTANTS****/

/**** START RESTFUL CLIENT****/
/*
getUsers is the entrypoint of the application.

Sends an AJAX request to retrive the list of all the users of the application
ONSUCCESS=> Show users in the UI list. It uses appendUserToList for that purpose. 
The list contains the url of the users.
ONERROR => Show an alert to the user
*/
function getArtists() {
	var apiurl = ENTRYPOINT + "artists/";

	return $.ajax({
		url: apiurl,
		dataType:DEFAULT_DATATYPE
	}).always(function(){
		//Remove old list of users, clear the form data hide the content information(no selected)
		$("#artists").empty();
		$("#songs").empty();
	}).done(function (data, textStatus, jqXHR){
		if (DEBUG) {
			console.log ("RECEIVED RESPONSE: data:",data,"; textStatus:",textStatus)
		}
		//Extract the users
    	users = data.collection.items;
		for (var i=0; i < users.length; i++){
			var user = users[i];
			//Extract the nickname by getting the data values. Once obtained
			// the nickname use the method appendUserToList to show the user
			// information in the UI.
			//Data format example:
			//  [ { "name" : "nickname", "value" : "Mystery" },
			//    { "name" : "registrationdate", "value" : "2014-10-12" } ]
			var user_data = user.data;
			for (var j=0; j<user_data.length;j++){
				if (user_data[j].name=="name"){
					appendArtistToList(user.href, user_data[j].value);
				}			
			} 
		}
	}).fail(function (jqXHR, textStatus, errorThrown){
		if (DEBUG) {
			console.log ("RECEIVED ERROR: textStatus:",textStatus, ";error:",errorThrown)
		}
		//Inform user about the error using an alert message.
		alert ("Could not fetch the list of users.  Please, try again");
	});
}

function getSongs(apiurl) {
	return $.ajax({
		url: apiurl + "songs/",
		dataType:DEFAULT_DATATYPE, 
		//headers: {"Authorization":"admin"}
	}).done(function (data, textStatus, jqXHR){
		if (DEBUG) {
			console.log ("RECEIVED RESPONSE: data:",data,"; textStatus:",textStatus)
		}
        $("#songs").empty();
		var songs = data.collection.items;
		for(i = 0; i<songs.length; i++){
            var song = songs[i].data;
			appendSong(song);
        }
	}).fail(function (jqXHR, textStatus, errorThrown){
		if (DEBUG) {
			console.log ("RECEIVED ERROR: textStatus:",textStatus, ";error:",errorThrown)
		}
		//Show an alert informing that I cannot get info from the user.
		alert ("Cannot extract information about this user from the forum service.")
		//Deselect the user from the list.
		deselectArtist()
	});
}

function handleGetArtist(event) {
	if (DEBUG) {
		console.log ("Triggered handleGetUser")
	}
	event.preventDefault();//Avoid default link behaviour
	//TODO 2
	// This event is triggered by the a.user_link element. Hence, $(this)
	// is the <a> that the user has pressed. $(this).parent() is the li element
	// containing such anchor.
	//
	// Use the method event.preventDefault() in order to avoid default action
	// for anchor links. 
	//
	// Remove the class "selected" from the previous #user_list li element and
	// add it to the current #user_list li element. Remember, the current 
	// #user_list li element is $(this).parent()
    //
	//
	// Finally extract the href attribute from the current anchor ($(this)
	// and call the  method getUser(url) to make the corresponding HTTP call 
	// to the RESTful API. You can extract an HTML attribute using the 
	// attr("attribute_name") method  from JQuery.
	//
	//

	$(".selected").removeClass("selected");
    $(this).parent().addClass("selected");
    var href = $(this).attr("href");
    getSongs(href);






	return false; //IMPORTANT TO AVOID <A> DEFAULT ACTIONS
}

/**
 Creates User resource representation using the data from the form showed in the screen.
 Calls the method addUser to upload the new User resource to the Web service.
 TRIGGER: Submit button with value Create from form #create_user_form 
**/

function appendArtistToList(url, nickname) {
	var $user = $('<tr>').html('<a class= "artist_link" href="'+url+'">'+nickname+'</a>');
	//Add to the user list
	$("#artists").append($user);
	return $user;
}

function appendUserToList(url, nickname) {
	var $user = $('<tr>').html('<a class= "artist_link" href="'+url+'">'+nickname+'</a>');
	//Add to the user list
	$("#users").append($user);
	return $user;
}

function appendSong(song) {
	var $user = $('<tr>').html('<p>'+ song[0]["value"]+'</p>' +
	'<p>' + song[2]["value"] + " (" + song[3]["value"]+ ")</p>");
	//Add to the user list
	$("#songs").append($user);
	return $user;
}
/*
Sets the url to add a new user to the list.
*/
/*
Creates a form with the values coming from the template.

INPUT:
 * url=Value that will be writtn in the action attribute.
 * template=Collection+JSON template which contains all the attributes to be shown.
 * id = unique id assigned to the form.
 * button_name = the text written on associated button. It can be null;
 * handler= function executed when the button is pressed. If button_name is null
   it must be null.

 OUTPUT:
  The form as a jquery element.
*/
function deselectArtist() {
	$("#artists li.selected").removeClass("selected");
	$("#mainContent").hide();
}

/*
Helper method to reloadUserData. Internally it makes click on the href of the 
selected user.
*/
function reloadUserData() {
	var selected = $("#user_list li.selected a");
	selected.click();
}


/*** START ON LOAD ***/
//This method is executed when the webpage is loaded.
$(function(){

	$("#artists").on("click","tr a.artist_link", handleGetArtist);
	getArtists();
	//Retrieve list of users from the server
})
/*** END ON LOAD**/