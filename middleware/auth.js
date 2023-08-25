import jwt from "jsonwebtoken";
//third autherization
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }
    //if the client set the "Authorization" header to "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    // the value of the token variable in the code would be "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...".
    //The code would then extract the actual JWT token by removing the "Bearer " prefix using the token.slice() method. <==========
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft(); //<==========
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
