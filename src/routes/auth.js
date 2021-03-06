import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/', (req, res) => {
  const { credentials } = req.body;
  User.findOne({ email: credentials.email }).then(user => {
  	// success credentials
  	// if (user) {
  	// res.json({ success: true })
  	if (user && user.isValidPassword(credentials.password)) {
  	  // res.json({ user: { email: user.email } });
  	    res.json({ user: user.toAuthJSON() });
  	} else {
      res.status(400).json({ errors: { global: "Invalid Credentials but API does works" }});
  	}
  });
});

export default router;