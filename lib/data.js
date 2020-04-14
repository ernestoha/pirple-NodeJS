/**
  * Library for storing and editing data
  *
  */

// Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

// Container for module (to be exported)
var lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname,'/../.data/');

// Write data to a file
lib.create = function(dir,file,data,callback){
  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData,function(err){
        if(!err){
          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false);
            } else {
              callback('Error closing new file.');
            }
          });
        } else {
          callback('Error writing to new file.');
        }
      });
    } else {
      callback('Could not create new file, it may already exist.');
    }
  });

};

//Read all files from dir, push into array and send...
//@TODO 
lib.readAll = function(dir, callback){
  fs.readdir(lib.baseDir+dir, function(err, items) {
    var list = [];
    console.log({"iteE" : items});
    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
        // list.push(items[i]);
        // fs.readFile(lib.baseDir+dir+'/'+items[i], 'utf8', function(err,data){
          // console.log({"data" : data});
          // if(!err && data){
          // if(!err){
            /* var parsedData = helpers.parseJsonToObject(data);
             callback(false,parsedData); */
            // }
             
            //  list.push({"122":data});
             
          // });
    }
    fs.readFileSync(lib.baseDir+dir+'/'+'1.json', 'utf8', function(err,data){
      console.log({"data" : data});
      // if(!err && data){
      // if(!err){
        /* var parsedData = helpers.parseJsonToObject(data);
         callback(false,parsedData); */
        // }
         
         list.push({"122":data});
         callback(false,{"items" : list});     
      });
    console.log({"list" : list});
    // callback(false,{"items" : list});
  });

};

// Read data from a file
lib.read = function(dir,file,callback){
  // console.log(dir);
  if (file){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err,data){
      if(!err && data){
        var parsedData = helpers.parseJsonToObject(data);
        callback(false,parsedData);
      } else {
        callback(err,data);
      }
    });
  } else {
    // @TODO...
    lib.readAll(dir, function(err,data){
      if(!err && data){
        console.log({"readall":data});
        var parsedData = helpers.parseJsonToObject(data);
        console.log({"readall-parsedData":parsedData});
        callback(false,data);
      } else {
        callback(err,data);
      }
    });
  }
};

// Update data in a file
lib.update = function(dir,file,data,callback){

  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Truncate the file
      fs.truncate(fileDescriptor,function(err){
        if(!err){
          // Write to file and close it
          fs.writeFile(fileDescriptor, stringData,function(err){
            if(!err){
              fs.close(fileDescriptor,function(err){
                if(!err){
                  callback(false);
                } else {
                  callback('Error closing existing file.');
                }
              });
            } else {
              callback('Error writing to existing file.');
            }
          });
        } else {
          callback('Error truncating file.');
        }
      });
    } else {
      callback('Could not open file for updating, it may not exist yet.');
    }
  });

};

// Delete a file
lib.delete = function(dir,file,callback){

  // Unlink the file from the filesystem
  fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
    callback(err);
  });

};

// Export the module
module.exports = lib;