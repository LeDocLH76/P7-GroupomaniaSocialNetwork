const getAllposts = async (req, res) => {
   res.send('All posts');
};
const getOnepost = async (req, res) => {
   res.send('One post');
};
const createpost = async (req, res) => {
   res.send('Create post');
};
const updatepost = async (req, res) => {
   res.send('Update post');
};
const deletepost = async (req, res) => {
   res.send('Delete post');
};

export { getAllposts, getOnepost, createpost, updatepost, deletepost };
