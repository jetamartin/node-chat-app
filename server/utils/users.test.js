const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Jen',
      room: 'React Course'
    }, {
      id: '3',
      name: 'Julie',
      room: 'Node Course'
    }];
  });

  it ('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Andrew',
      room: 'The Office Fans'
    }
    var resUser = users.addUser(user.id, user.name, user.room);
    // Expect users.users -> First users refers to users we instatiated above
    // and the second user refers to the array in the Users class.
    // The user in the toEqual comparison refers to object defined above
    expect(users.users).toEqual([user]);

  });

  it('should remove a user', () => {
    var userId = '1';
    var user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
    });

  it('should not remove a user', () => {
    var user = users.removeUser('25');
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);

  });

  it('should find a user with matching id', () => {
    var userId = '2';
    var user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    var userId = '99'
    var user = users.getUser(userId);
    expect(user).toNotExist();

  });


  it ('should return names of Node course', () => {
    var name = 'Node Course';
    var userList = users.getUserList(name);
    expect(userList).toEqual(['Mike', 'Julie']);
  });

  it ('should return names of React course', () => {
    var name = 'React Course';
    var userList = users.getUserList(name);
    expect(userList).toEqual(['Jen']);
  });
  it('should return and empty array if no matching course found', () => {
    var name = 'Javascript Course';
    var userList = users.getUserList(name);
    expect(userList).toEqual([]);
  })

})
