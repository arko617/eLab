
/**
 * Main controller; put things that don't require a model
 */

var title = "LabBook";
var description = "A user-friendly collaborative platform for sharing text documents, images, videos, and other media to help you succeed in your research.";

exports.index = function(req, res){
  res.render('index', { title: title, description: description});
  
//  //Page tracking
//  if (req.session.title){
//	  console.log("Last page:",req.session.title);
//  }  
//  req.session.title="index";
};
exports.contact = function(req,res){
  res.render("contact");
  
//  if (req.session.title){
//	  console.log("Last page:",req.session.title);
//  }  
//  req.session.title="contact";
};

exports.testpushnotification = function(req,res){
	res.render("testpushnotification");
}