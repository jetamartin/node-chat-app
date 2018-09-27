[{
  id: 'ssss',
  name: 'Fred',
  room: 'The office'

}]

//addUser(id, name, room)
// removeUser(id)
// getuser(id)
// getuserList(room)

class Users {
  constructor () {
    this.users = [];
  }


  addUser(id, name, room) {
    var user = {id, name, room}
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    // return user that was removed
    var removedUser = this.users.filter((user) => user.id === id)[0];
    if (removedUser) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    console.log('removedUser', removedUser);
    return removedUser;
  }

  getUser(id) {
    // Need to return object..since there is either on or no matching
    // using [0] will either return the matching user object or undefined
    return this.users.filter((user) => user.id === id)[0];
  }
  // Get list of all users name by room name in an array
  getUserList(room) {
    // Returns array of of objects where room matches room arguments
    var users = this.users.filter((user) => user.room === room );
    // Returns array of users names in the room
    var namesArray = users.map((user) => user.name);
    return namesArray;
  }
}
module.exports = {Users};

// class Person {
//   constructor (name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   getUserDescription () {
//     return `${this.name} is ${this.age} years old`
//   }
// }
//
// var me = new Person('Jet', 45);
// var description = me.getUserDescription();
// console.log(description);
