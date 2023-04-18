#!/usr/bin/env node

// UNSAFE, will leak data.
const user1 = {
    username: 'pojo',
    email: 'pojo@example.com',
};

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }
    toJson() {
        return {
            username: this.username,
            email: this.email,
        };
    }
}

const user2 = new User('class', 'class@example.com');

console.log(JSON.stringify(user1));
console.log(JSON.stringify(user2.toJson()));

user1.password = user2.password = "TOP SECRET";

console.log(JSON.stringify(user1));
console.log(JSON.stringify(user2.toJson()));
