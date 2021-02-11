function validateFloat(e, intDecimalPlaces) {
    var whichASC = (NS4) ? e.which : event.keyCode;
    var keyBS = 8;
    var keyDecimal = 46;
    var controlName = "";

    if (intDecimalPlaces == 0) {
        if (whichASC > 47 && whichASC < 58) {
            return true;
        }
        else {
            return false;
        }
    }
    if (NS4) {
        controlName = e.target.name;
        controlValue = e.target.value;
    }
    else {
        controlName = window.event.srcElement.getAttribute("name");
        if (window.event.srcElement.getAttribute("value") == null) {
            controlValue = "";
        }
        else {
            controlValue = window.event.srcElement.getAttribute("value");
        }
    }

    if ((((whichASC < 48) || (whichASC > 57)) && (!(whichASC == keyBS))) && (!(whichASC == keyDecimal))) {
        return (false);
    }
    else {
        if (whichASC == keyDecimal) {
            if (controlValue.indexOf(".") >= 0)
                return false;
            else
                return true;
        }
    }

    if (intDecimalPlaces != 0) {
        var el = window.event.srcElement;
        var cur_pos = cursor_pos(el);		// return the cursor position
        if (cur_pos > (controlValue.indexOf(".") + 1)) {
            var txt = '';
            var foundIn = '';
            txt = document.selection.createRange().text;
            if (controlValue.indexOf(".") >= 0) {
                if ((controlValue.length - controlValue.indexOf(".")) > intDecimalPlaces)
                    if (txt == "") return false;
            }
        }
    }
    return (true);
}
//Only Characters input.   //numbers & Special characters are not allowed
function varifychar(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if ((charCode >= 33 && charCode <= 64) || (charCode >= 91 && charCode <= 96) || (charCode >= 123 && charCode <= 126)) {
        alert("Numbers & Special characters are not allowed.");
        if (e.preventDefault()) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}
//Only Special input      // numbers are not allowed 
function OnlySpecChar(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if (charCode >= 48 && charCode <= 57) {
        alert("Numbers are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}
//Only Characters & numbers  //Special characters not allowed.
function NoSpecChar(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if ((charCode >= 33 && charCode <= 47) || (charCode >= 58 && charCode <= 64) || (charCode >= 91 && charCode <= 96) || (charCode >= 123 && charCode <= 126)) {
        alert("Special characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}
//Only numbers input.   //Characters are not allowed
function varifyNumberPositive(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if (charCode <= 44 || charCode > 57 || charCode == 47 || charCode == 45 || charCode == 46) {
        alert("Characters & Special characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}

//only & _ . special characters only allowed//
function NoSpecCharallowFew(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if ((charCode >= 33 && charCode <= 37) || (charCode >= 39 && charCode <= 44) || (charCode == 47) || (charCode >= 58 && charCode <= 64) || (charCode >= 91 && charCode <= 96) || (charCode >= 123 && charCode <= 126)) {
        alert("Characters & Special characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}

//Only +- special characters & numbers  // characters not allowed.(Contact No.)
function OnlySpecCharNum(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if ((charCode != 43 && charCode != 45) && (!(charCode >= 48 && charCode <= 57))) {
        alert("Special characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}

//Only '. special characters & numbers  // special characters & characters not allowed.(Candidate Name.)
function ParticularSpec(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if ((charCode >= 33 && charCode <= 38) || (charCode >= 40 && charCode <= 45) || (charCode >= 47 && charCode <= 64) || (charCode >= 91 && charCode <= 96) || (charCode >= 123 && charCode <= 126)) {
        alert("Numbers & Special characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}

function isDate(txtDate) {
    var currVal = txtDate;
    if (currVal == '' || currVal == null)
        return true;

    var rxDatePattern = /^(\d{1,2})(-)(\S{1,3})(-)(\d{4})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
        return false;

    var monthList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    //Checks for mm/dd/yyyy format.
    dtMonth = parseInt(monthList.indexOf(dtArray[3].toLowerCase())) + 1;
    dtDay = dtArray[1];
    dtYear = dtArray[5];

    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }
    return true;
}
function DateFormatEdit(txtDate) {
    var currVal = txtDate;
    if (currVal == '' || currVal == null)
        return true;

    var rxDatePattern = /^(\d{1,2})(-)(\S{1,3})(-)(\d{4})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
        return false;

    var monthList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    //Checks for mm/dd/yyyy format.
    dtMonth = parseInt(monthList.indexOf(dtArray[3].toLowerCase())) + 1;
    dtDay = dtArray[1];
    dtYear = dtArray[5];
    //var val_date = dtYear + '-' + dtMonth + '-' + dtDay
    var val_date = dtDay + '-' + dtMonth + '-' + dtYear;
    if (val_date.length == 9) {
        //val_date = dtYear + '-' + '0' + dtMonth + '-' + dtDay
        val_date = dtDay + '-' + '0' + dtMonth + '-' + dtYear;
        val_date = val_date.split("-")
        var ChagneDate = new Date(val_date[2], val_date[1] - 1, val_date[0]);
    } else {
        val_date = val_date.split("-")
        var ChagneDate = new Date(val_date[2], val_date[1] - 1, val_date[0]);
    }
    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }
    return ChagneDate;
}

function EmailFormate(EmailIds) {

    var EmailId = EmailIds;
    if (EmailId == '' || EmailId == null || EmailId == 'null')
        return true;

    //var emailReg = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,75}|[0-9]{1,3})(\]?)$/;
    var emailReg = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z0-9\w#!:.?+=&%@! \-\/]{2,75})(\]?)$/;

    if (EmailId != '') {
        if (emailReg.test(EmailId) == false) {
            return false;
        }
    }
    return true;
}


function DominFormat(dominIds) {
    var dominId = dominIds;
    if (dominId == '' || dominId == null)
        return true;

    var webSiteReg = /(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    if (dominId != '') {
        if (webSiteReg.test(dominId) == false) {
            return false;
        }
    }
    return true;
}

//Only +- special characters & numbers  // characters not allowed.(Contact No. and Fax No.)
function OnlySpecCharNum(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if ((charCode != 40 && charCode != 41 && charCode != 43 && charCode != 45 && charCode != 46) && (!(charCode >= 48 && charCode <= 57))) {
        alert("Characters & Special characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}

//Only . & numbers  // special characters & characters not allowed.(Decimal values)
function Numberdot(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if (!(charCode >= 48 && charCode <= 57 || charCode == 46)) {
        alert("Characters & Special characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}

//Date Formate Function
function ParseDate(dateString) {
    return moment(dateString, "DD-MMM-YYYY")
}

//only special characters allowed
function OnlySpecCharallow(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if (!(charCode >= 32 && charCode <= 47) && (!(charCode >= 58 && charCode <= 64)) && (!(charCode >= 91 && charCode <= 96)) && (!(charCode >= 123 && charCode <= 126))) {
        alert("Number & characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}


//only special characters allowed (# - . / & )
function SomeSpec(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if ((charCode >= 33 && charCode <= 34) || (charCode >= 36 && charCode <= 37) || (charCode >= 39 && charCode <= 44) || (charCode >= 58 && charCode <= 64) || (charCode >= 91 && charCode <= 96) || (charCode >= 123 && charCode <= 126)) {
        alert("Special characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}

function divcollapse(tableid, imageId) {

    var x = document.getElementById(tableid);
    var i = document.getElementById(imageId);

    if (x.style.display === "none") {
        i.src = "../../Images/collapse.gif"
        x.style.display = "block";
        document.getElementById(tableid + '_img').title = 'Click to Collapse';
    } else {

        i.src = "../../Images/expand.gif"
        x.style.display = "none";
        document.getElementById(tableid + '_img').title = 'Click to Expand';

    }
    return true;
};

//Only : special characters & numbers  // characters not allowed.(Contact No.)
function OnlySpecTimeNum(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if ((charCode != 46) && (!(charCode >= 48 && charCode <= 57))) {
        alert("Special characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}
//alphanumeric / & - numbers  // special characters not allowed.(without / & - Decimal values)
function AlphanumericSpl(e) {
    var charCode = e.charCode || e.keyCode || e.which;
    if ((charCode >= 33 && charCode <= 37) || (charCode >= 39 && charCode <= 44) || (charCode == 46)
        || (charCode >= 58 && charCode <= 64)
        || (charCode >= 91 && charCode <= 96) || (charCode >= 123 && charCode <= 126)) {
        alert("Special characters are not allowed.");
        if (e.preventDefault) {
            e.preventDefault();
        } else if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
}