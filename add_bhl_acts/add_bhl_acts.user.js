// ==UserScript==
// @name        Add BHL Acts
// @namespace   http://sandbox.archivematica.org/
// @description Allows archivists to add BHL-specific acts to Archivematica PREMIS Rights Statements.
// @include     http://sandbox.archivematica.org/transfer/*/rights/grants/*/
// @include     http://sandbox.archivematica.org/ingest/*/rights/grants/*/
// @include     http://missy.qa.archivematica.org/transfer/*/rights/grants/*/
// @include     http://missy.qa.archivematica.org/ingest/*/rights/grants/*/
// @include     http://rumble.umdl.umich.edu/transfer/*/rights/grants/*/
// @include     http://rumble.umdl.umich.edu/ingest/*/rights/grants/*/
// @include     http://rumble.umdl.umich.edu/appraisal/
// @version     1
// @grant       none
// ==/UserScript==

var usernameElement = document.getElementById("dropdownUser");
var username = usernameElement.text.trim();

if (username == "dproud") {
   alert("Hi Devon. Please be careful.");
   appraisalTab = document.querySelectorAll('[ng-app="appraisalTab"]')[0];
   img = document.createElement("img");
   src = document.createAttribute("src");
   src.value = "https://media.giphy.com/media/9p87NPGhZXAaI/giphy.gif";
   img.setAttributeNode(src);
   appraisalTab.parentNode.replaceChild(img, appraisalTab);
}

if (username == "shallcro") {
   alert("Hey Mike. Please be careful.");
   appraisalTab = document.querySelectorAll('[ng-app="appraisalTab"]')[0];
   img = document.createElement("img");
   src = document.createAttribute("src");
   src.value = "http://theworldsbestever.s3.amazonaws.com/blog/wp-content/uploads/2014/02/yachty-by-nature.jpg";
   img.setAttributeNode(src);
   appraisalTab.parentNode.replaceChild(img, appraisalTab);
}

var BHLPolicyDiv = document.createElement("div");
BHLPolicyDiv.setAttribute("style", "margin-bottom:30px;")
var BHLPolicyLabel = document.createElement("h2");
var BHLLogo = document.createElement("img");
var BHLPolicyText = document.createTextNode("BHL Policy");
BHLPolicyLabel.setAttribute("style", "font-size:x-large;line-height:2");
BHLPolicyLabel.appendChild(BHLPolicyText);
BHLLogo.setAttribute("style", "float:left;margin-right:15px");
BHLLogo.setAttribute("src", "https://pbs.twimg.com/profile_images/594171685441564674/zvas3z1q_bigger.jpg");
BHLPolicyLabel.appendChild(BHLLogo);
BHLPolicyDiv.appendChild(BHLPolicyLabel);

var select = document.createElement("select");
select.onchange = function() {
    if(this.value == "Reading Room") {
        add_anonymous_item_bentley_only_users_bitstream_act();
    } else if(this.value == "University of Michigan") {
        add_anonymous_item_um_users_bitstream_act();
    } else if(this.value == "Bentley Digital Media Library") {
        add_anonymous_item_bentleystaff_bitstream_act();
    } else if(this.value == "UM Executive Records") {
        add_bentleystaff_item_bentleystaff_bitstream_act_with_accession_date();
    } else if(this.value == "UM Personnel Records") {
        add_bentleystaff_item_bentleystaff_bitstream_act_PR();
    } else if(this.value == "UM Student Records") {
        add_bentleystaff_item_bentleystaff_bitstream_act_SR();
    } else if(this.value == "UM Patient/Client Records") {
        add_bentleystaff_item_bentleystaff_bitstream_act_CR();
    }
};

function make_option(option_value) {
    var option = document.createElement("option");
    option.text = option_value;
    option.value = option_value;

    return option
};

select.options.add(make_option(""));
select.options.add(make_option("Reading Room"));
select.options.add(make_option("University of Michigan"));
select.options.add(make_option("Bentley Digital Media Library"));
select.options.add(make_option("UM Executive Records"));
select.options.add(make_option("UM Personnel Records"));
select.options.add(make_option("UM Student Records"));
select.options.add(make_option("UM Patient/Client Records"));

var theParent = document.getElementsByClassName("grant-fieldset")[0];
var theChild = document.getElementById("id_rightsstatementrightsgranted_set-0-rightsstatement");
BHLPolicyDiv.appendChild(select);
theParent.insertBefore(BHLPolicyDiv, theChild);

// Reading Room
function add_anonymous_item_bentley_only_users_bitstream_act()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act");
    add_act.value="disseminate";

    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Conditional"]');
    add_restriction.selected=true;

    var add_start=document.getElementById("id_rightsstatementrightsgranted_set-0-startdate");
    add_start.value=new Date().toISOString().substring(0,10);

    var add_end = document.getElementById("id_rightsstatementrightsgranted_set-0-enddate");
    add_end.value="";

    var add_open_end_date = document.getElementById("id_rightsstatementrightsgranted_set-0-enddateopen");
    add_open_end_date.checked = true;

    // Also a better way to do this...
    var add_restriction_note=document.getElementsByTagName("textarea")[0];
    add_restriction_note.value="Reading-Room Only: Access to this material is restricted to the reading room of the Bentley Historical Library.";
}

// University of Michigan
function add_anonymous_item_um_users_bitstream_act()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act");
    add_act.value="disseminate";

    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Conditional"]');
    add_restriction.selected=true;

    var add_start=document.getElementById("id_rightsstatementrightsgranted_set-0-startdate");
    add_start.value=new Date().toISOString().substring(0,10);

    var add_end = document.getElementById("id_rightsstatementrightsgranted_set-0-enddate");
    add_end.value="";

    var add_open_end_date = document.getElementById("id_rightsstatementrightsgranted_set-0-enddateopen");
    add_open_end_date.checked = true;

    // Also a better way to do this...
    var add_restriction_note=document.getElementsByTagName("textarea")[0];
    add_restriction_note.value="UM Only: This material may only be accessed by students, faculty, and staff of the University of Michigan.";
}

// Bentley Digital Media Library
function add_anonymous_item_bentleystaff_bitstream_act()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act");
    add_act.value="disseminate";

    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Conditional"]');
    add_restriction.selected=true;

    var add_start=document.getElementById("id_rightsstatementrightsgranted_set-0-startdate");
    add_start.value=new Date().toISOString().substring(0,10);

    var add_end = document.getElementById("id_rightsstatementrightsgranted_set-0-enddate");
    add_end.value="";

    var add_open_end_date = document.getElementById("id_rightsstatementrightsgranted_set-0-enddateopen");
    add_open_end_date.checked = true;

    // Also a better way to do this...
    var add_restriction_note=document.getElementsByTagName("textarea")[0];
    add_restriction_note.value="Streaming Only: This recording may be protected by copyright law. Access to this material is restricted to the reading room of the Bentley Historical Library.";
}

// Bentley Policies
// UM Executive Records
function add_bentleystaff_item_bentleystaff_bitstream_act_with_accession_date()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act");
    add_act.value="disseminate";

    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Disallow"]');
    add_restriction.selected=true;

    while (true) {
        accession_date = prompt("Please enter the accession date: ", "YYYY-MM-DD");
        var pattern = /(\d{4})(-)?(\d{2})?(-)?(\d{2})?/;
        var result = pattern.test(accession_date);
        if (result == false) {
            alert("Please enter a *valid* date (YYYY-MM-DD, YYYY-MM or YYYY)");
            continue;
        } else {
           break;
        };
    };

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
function add_bentleystaff_item_bentleystaff_bitstream_act_PR()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act");
    add_act.value="disseminate";

    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Disallow"]');
    add_restriction.selected=true;

    while (true) {
        creation_date = prompt("Please enter the creation date: ", "YYYY-MM-DD");
        var pattern = /(\d{4})(-)?(\d{2})?(-)?(\d{2})?/;
        var result = pattern.test(creation_date);
        if (result == false) {
            alert("Please enter a *valid* date (YYYY-MM-DD, YYYY-MM or YYYY)");
            continue;
        } else {
           break;
        };
    };

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
function add_bentleystaff_item_bentleystaff_bitstream_act_SR()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act");
    add_act.value="disseminate";

    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Disallow"]');
    add_restriction.selected=true;

    while (true) {
        creation_date = prompt("Please enter the creation date: ", "YYYY-MM-DD");
        var pattern = /(\d{4})(-)?(\d{2})?(-)?(\d{2})?/;
        var result = pattern.test(creation_date);
        if (result == false) {
            alert("Please enter a *valid* date (YYYY-MM-DD, YYYY-MM or YYYY)");
            continue;
        } else {
           break;
        };
    };

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
function add_bentleystaff_item_bentleystaff_bitstream_act_CR()
{
    var add_act=document.getElementById("id_rightsstatementrightsgranted_set-0-act");
    add_act.value="disseminate";

    // I think there must be a better way to do this...
    var add_restriction=document.querySelector('option[value="Disallow"]');
    add_restriction.selected=true;

    while (true) {
        creation_date = prompt("Please enter the creation date: ", "YYYY-MM-DD");
        var pattern = /(\d{4})(-)?(\d{2})?(-)?(\d{2})?/;
        var result = pattern.test(creation_date);
        if (result == false) {
            alert("Please enter a *valid* date (YYYY-MM-DD, YYYY-MM or YYYY)");
            continue;
        } else {
           break;
        };
    };

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
