import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId); // the key is the userId and the value is a boolean
    //const post = new Post({
    //   userId: '123',
    //   firstName: 'John',
    //   likes: {
    //     '456': true,
    //     '789': true,
    //   },
    // });
    // console.log(post.likes.get('456')); // Output: true
    //console.log(post.likes.get('999')); // Output: undefined

    if (isLiked) { //if it's already liked, we want to remove the like
      post.likes.delete(userId);
    } else {
      //so if it is undefined or false
      post.likes.set(userId, true); //myModal.myMap.set('key', 'value');
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true } // is an options object that specifies
      // additional options for the update operation.
      //In this case, the new: true option tells Mongoose to
      //return the updated post after the update operation has completed.
      //This is important because the updatedPost variable is assigned
      // the result of this method call.
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
