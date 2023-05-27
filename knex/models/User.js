const Model = require('./Model');

class User extends Model {
  constructor() {
    super('users');
  }
}

module.exports = User;