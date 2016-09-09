// ==UserScript==
// @name        Add BHL Acts
// @namespace   http://sandbox.archivematica.org/
// @description Allows archivists to add BHL-specific acts to Archivematica PREMIS Rights Statements.
// @include     http://sandbox.archivematica.org/transfer/*/rights/grants/*/
// @include     http://sandbox.archivematica.org/ingest/*/rights/grants/*/
// @version     1
// @grant       none
// ==/UserScript==

// Reading Room
var input=document.createElement("input");
input.type="button";
input.value="Reading Room";
input.onclick = add_anonymous_item_bentley_only_users_bitstream_act;
input.setAttribute("style", "font-size:18px;position:absolute;top:120px;right:40px;");
document.body.appendChild(input); 
 
function add_anonymous_item_bentley_only_users_bitstream_act()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act"); 
    add_act.value="disseminate"; 
    
    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Conditional"]'); 
    add_restriction.selected=true; 
    
    var add_start=document.getElementById("id_rightsstatementrightsgranted_set-0-startdate"); 
    add_start.value=new Date().toISOString(); 
  
    var add_end = document.getElementById("id_rightsstatementrightsgranted_set-0-enddate"); 
    add_end.value=""; 
  
    var add_open_end_date = document.getElementById("id_rightsstatementrightsgranted_set-0-enddateopen"); 
    add_open_end_date.checked = true;
    
    // Also a better way to do this...
    var add_restriction_note=document.getElementsByTagName("textarea")[0]; 
    add_restriction_note.value="Access to this material is restricted to the reading room of the Bentley Historical Library."; 
}

// University of Michigan
var input=document.createElement("input");
input.type="button";
input.value="University of Michigan";
input.onclick = add_anonymous_item_um_users_bitstream_act;
input.setAttribute("style", "font-size:18px;position:absolute;top:160px;right:40px;");
document.body.appendChild(input); 

function add_anonymous_item_um_users_bitstream_act()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act"); 
    add_act.value="disseminate"; 
    
    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Conditional"]'); 
    add_restriction.selected=true; 
    
    var add_start=document.getElementById("id_rightsstatementrightsgranted_set-0-startdate"); 
    add_start.value=new Date().toISOString(); 
  
    var add_end = document.getElementById("id_rightsstatementrightsgranted_set-0-enddate"); 
    add_end.value=""; 
  
    var add_open_end_date = document.getElementById("id_rightsstatementrightsgranted_set-0-enddateopen"); 
    add_open_end_date.checked = true;
    
    // Also a better way to do this...
    var add_restriction_note=document.getElementsByTagName("textarea")[0]; 
    add_restriction_note.value="This material may only be accessed by students, faculty, and staff of the University of Michigan."; 
}

// Bentley Digital Media Library
var input=document.createElement("input");
input.type="button";
input.value="Bentley Digital Media Library";
input.onclick = add_anonymous_item_bentleystaff_bitstream_act;
input.setAttribute("style", "font-size:18px;position:absolute;top:200px;right:40px;");
document.body.appendChild(input); 

function add_anonymous_item_bentleystaff_bitstream_act()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act"); 
    add_act.value="disseminate"; 
    
    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Conditional"]'); 
    add_restriction.selected=true; 
    
    var add_start=document.getElementById("id_rightsstatementrightsgranted_set-0-startdate"); 
    add_start.value=new Date().toISOString(); 
  
    var add_end = document.getElementById("id_rightsstatementrightsgranted_set-0-enddate"); 
    add_end.value=""; 
  
    var add_open_end_date = document.getElementById("id_rightsstatementrightsgranted_set-0-enddateopen"); 
    add_open_end_date.checked = true;
    
    // Also a better way to do this...
    var add_restriction_note=document.getElementsByTagName("textarea")[0]; 
    add_restriction_note.value="This recording may be protected by copyright law. Access to this material is restricted to the reading room of the Bentley Historical Library."; 
}

// Bentley Policies
// UM Executive Records
var input=document.createElement("input");
input.type="button";
input.value="UM Executive Records";
input.onclick = add_bentleystaff_item_bentleystaff_bitstream_act_with_accession_date;
input.setAttribute("style", "font-size:18px;position:absolute;top:240px;right:40px;");
document.body.appendChild(input); 

function add_bentleystaff_item_bentleystaff_bitstream_act_with_accession_date()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act"); 
    add_act.value="disseminate"; 
    
    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Disallow"]'); 
    add_restriction.selected=true; 
    
    // Should add some error checking here...
    var accession_date = prompt("Please enter the accession date: ", "YYYY-MM-DD");
    
    var add_start=document.getElementById("id_rightsstatementrightsgranted_set-0-startdate"); 
    add_start.value=accession_date; 
  
    var add_end = document.getElementById("id_rightsstatementrightsgranted_set-0-enddate"); 
    add_end.value=(Number(accession_date.split("-")[0]) + 20).toString() + "-07-01"; 
    
    var add_open_end_date = document.getElementById("id_rightsstatementrightsgranted_set-0-enddateopen"); 
    add_open_end_date.checked = false;
    
    // Also a better way to do this...
    var add_restriction_note=document.getElementsByTagName("textarea")[0]; 
    add_restriction_note.value="ER Restricted until " + (Number(accession_date.split("-")[0]) + 20).toString() + "."; 
}

// UM Personnel Records
var input=document.createElement("input");
input.type="button";
input.value="UM Personnel Records";
input.onclick = add_bentleystaff_item_bentleystaff_bitstream_act_PR;
input.setAttribute("style", "font-size:18px;position:absolute;top:280px;right:40px;");
document.body.appendChild(input); 

function add_bentleystaff_item_bentleystaff_bitstream_act_PR()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act"); 
    add_act.value="disseminate"; 
    
    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Disallow"]'); 
    add_restriction.selected=true; 
    
    // Should add some error checking here...
    var creation_date = prompt("Please enter the creation date: ", "YYYY-MM-DD"); 
        
    var add_start=document.getElementById("id_rightsstatementrightsgranted_set-0-startdate"); 
    add_start.value=creation_date; 
  
    var add_end = document.getElementById("id_rightsstatementrightsgranted_set-0-enddate"); 
    add_end.value=(Number(creation_date.split("-")[0]) + 30).toString() + "-07-01"; 
    
    var add_open_end_date = document.getElementById("id_rightsstatementrightsgranted_set-0-enddateopen"); 
    add_open_end_date.checked = false; 
    
    // Also a better way to do this...
    var add_restriction_note=document.getElementsByTagName("textarea")[0]; 
    add_restriction_note.value="PR Restricted until July 1, " + (Number(creation_date.split("-")[0]) + 30).toString() + "."; 
}

// UM Student Records
var input=document.createElement("input");
input.type="button";
input.value="UM Student Records";
input.onclick = add_bentleystaff_item_bentleystaff_bitstream_act_SR;
input.setAttribute("style", "font-size:18px;position:absolute;top:320px;right:40px;");
document.body.appendChild(input); 

function add_bentleystaff_item_bentleystaff_bitstream_act_SR()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act"); 
    add_act.value="disseminate"; 
    
    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Disallow"]'); 
    add_restriction.selected=true; 
    
    // Should add some error checking here...
    var creation_date = prompt("Please enter the creation date: ", "YYYY-MM-DD"); 
    
    var add_start=document.getElementById("id_rightsstatementrightsgranted_set-0-startdate"); 
    add_start.value=creation_date; 
  
    var add_end = document.getElementById("id_rightsstatementrightsgranted_set-0-enddate"); 
    add_end.value=(Number(creation_date.split("-")[0]) + 75).toString() + "-07-01"; 
    
    var add_open_end_date = document.getElementById("id_rightsstatementrightsgranted_set-0-enddateopen"); 
    add_open_end_date.checked = false; 
    
    // Also a better way to do this...
    var add_restriction_note=document.getElementsByTagName("textarea")[0]; 
    add_restriction_note.value="SR Restricted until July 1, " + (Number(creation_date.split("-")[0]) + 75).toString() + ".";
}

// UM Patient/Client Records
var input=document.createElement("input");
input.type="button";
input.value="UM Patient/Client Records";
input.onclick = add_bentleystaff_item_bentleystaff_bitstream_act_CR;
input.setAttribute("style", "font-size:18px;position:absolute;top:360px;right:40px;");
document.body.appendChild(input); 

function add_bentleystaff_item_bentleystaff_bitstream_act_CR()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act"); 
    add_act.value="disseminate"; 
    
    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Disallow"]'); 
    add_restriction.selected=true; 
    
    // Should add some error checking here...
    var creation_date = prompt("Please enter the creation date: ", "YYYY-MM-DD"); 
    
    var add_start=document.getElementById("id_rightsstatementrightsgranted_set-0-startdate"); 
    add_start.value=creation_date; 
  
    var add_end = document.getElementById("id_rightsstatementrightsgranted_set-0-enddate"); 
    add_end.value=(Number(creation_date.split("-")[0]) + 100).toString() + "-07-01"; 
    
    var add_open_end_date = document.getElementById("id_rightsstatementrightsgranted_set-0-enddateopen"); 
    add_open_end_date.checked = false; 
    
    // Also a better way to do this...
    var add_restriction_note=document.getElementsByTagName("textarea")[0]; 
    add_restriction_note.value="CR Restricted until July 1, " + (Number(creation_date.split("-")[0]) + 100).toString() + ".";
}
