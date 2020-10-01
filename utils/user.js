const users = [];

// bergabung ke grub
function userJoin(id, username, room) {
    const user = {id, username, room};
    users.push(user);

    return user;
}

// mendapatkan nama satu user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// user meninggalkan grub
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1){
        return users.splice(index, 1)[0];
    }
}

// mendapatkan room user
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}



module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};