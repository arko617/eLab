/**
 * different kind of filter to filter different information in drive folders
 */

/*
 * Check if the title contains a particular string
 */
function doesNotContainString(content,string){
	return -content.indexOf(string);		
}