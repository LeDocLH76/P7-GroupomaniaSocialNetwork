const getAllUsers = async (req, res) => {
   res.send('All users');
};
const getOneUser = async (req, res) => {
   res.send('One user');
};
const createUser = async (req, res) => {
   res.send('Create user');
};
const updateUser = async (req, res) => {
   res.send('Update user');
};
const deleteUser = async (req, res) => {
   res.send('Delete user');
};

export { getAllUsers, getOneUser, createUser, updateUser, deleteUser };
