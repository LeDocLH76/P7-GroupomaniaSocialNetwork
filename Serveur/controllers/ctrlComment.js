const getOnecomment = async (req, res) => {
   res.send('One comment');
};
const createcomment = async (req, res) => {
   res.send('Create comment');
};
const updatecomment = async (req, res) => {
   res.send('Update comment');
};
const deletecomment = async (req, res) => {
   res.send('Delete comment');
};

export { getOnecomment, createcomment, updatecomment, deletecomment };
