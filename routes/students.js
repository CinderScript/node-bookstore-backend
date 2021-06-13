let express = require('express');
let router = express.Router();
let StudentSchema = require('../models/students');

function HandleError(response, reason, message, code){
  console.log('ERROR: ' + reason);
  response.status(code || 500).json({"error": message});
}

router.post('/', (request, response, next) =>{
  let studentJSON = request.body;
  if (!studentJSON.firstName || !studentJSON.lastName)
    HandleError(response, 'Missing Information', 'Form Data Missing', 500);
  else{
    let student = new StudentSchema({
      firstName: studentJSON.firstName, // firstName: request.body.firstName
      lastName: studentJSON.lastName,
      gpa: studentJSON.gpa || 0,
      credits : studentJSON.credits || 0,
      major: studentJSON.major || 'Undecided'
    });
    student.save( (error) => {
      if (error){
        response.send({"error": error});
      }else{
        response.send({"id": student.id});
      }
    });
  }
});
// Check Post with: db.students.find()

router.get('/', (request, response, next)=>{
  let name = request.query['name'];
  if (name){
    StudentSchema
        .find({"firstName": name})
        .exec( (error, students) =>{
          if (error){
            response.send({"error": error});
          }else{
            response.send(students);
          }
        });
  }else{
    StudentSchema
        .find()
        .exec( (error, students) =>{
          if (error){
            response.send({"error": error});
          }else{
            response.send(students);
          }
        });
  }
});

router.get('/:id', (request, response, next) =>{
  StudentSchema
      .findById({"_id": request.params.id}, (error, result) => {
        if (error){
          response.status(500).send(error);
        }else if (result){
          response.send(result);
        }else{
          response.status(404).send({"id": request.params.id, "error": "Not Found"});
        }
      });
});

router.patch('/:id', (request, response, next) => {
  StudentSchema
      .findById(request.params.id, (error, result) => {
        if (error) {
          response.status(500).send(error);
        }else if (result){
          if (request.body._id){
            delete request.body._id;
          }
          for (let field in request.body){
            result[field] = request.body[field];
          }
          result.save((error, student)=>{
            if (error){
              response.status(500).send(error);
            }
            response.send(student);
          });
        }else{
          response.status(404).send({"id": request.params.id, "error":  "Not Found"});
        }
      });
});

router.delete('/:id', (request, response, next) => {
  StudentSchema
      .findById(request.params.id, (error, result)=>{
        if (error) {
          response.status(500).send(error);
        }else if (result){
          result.remove((error)=>{
            if (error){
              response.status(500).send(error);
            }
            response.send({"deletedId": request.params.id});
          });
        }else{
          response.status(404).send({"id": request.params.id, "error":  "Not Found"});
        }
      });
});
module.exports = router;
