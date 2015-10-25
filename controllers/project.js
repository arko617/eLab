/**
 * New node file
 */
exports.showAProject = function(req,res){
	res.render("project");	
};

exports.showProjectList = function(req,res){
	res.render("projectList");	
};

exports.response = function(req,res){
	var content = {status:"ok"};
    res.send(200,content);	// 200 means the request is successful. The backbone is expected to have a JSON response object and therefore a dump object is created.
};