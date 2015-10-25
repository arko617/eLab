/**
 * Common functions that can be reused
 */


/**
 * Check if an object is empty, i.e. {}
 * @param o
 * @returns {Boolean}
 */
function isEmptyObject(object){
    for(var i in object){
        if(object.hasOwnProperty(i)){
            return false;
        }
    }
    return true;
}

/**
 * A function to do simple string formatting
 * @returns {String}
 */
String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

/**
 * To format date that is obtained from google drive
 */
function formatDate(unformattedDate){
	var date = new Date(unformattedDate);
	var formattedDate = date.toLocaleDateString()+"\t"+ date.toLocaleTimeString();
	return formattedDate;
}