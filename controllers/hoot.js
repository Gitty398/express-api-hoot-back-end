const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Hoot = require("../models/hoot.js");
const router = express.Router();

/* 
HTTP Method	Controller	Response	URI	Use Case


GET	show	200	/hoots/:hootId	Get a single hoot
PUT	update	200	/hoots/:hootId	Update a hoot
DELETE	deleteHoot	200	/hoots/:hootId	Delete a hoot
POST	createComment	200	/hoots/:hootId/comments	Create a comment 
*/

// add routes here

// controllers/hoots.js


// POST	create	200	/hoots	Create a hoot

router.post("/", verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id

        if (!['News', 'Sports', 'Games', 'Movies', 'Music', 'Television'].includes(req.body.category))
            throw new Error(`${req.body.category} is not a valid category`)

        if (!req.body.text.trim() || !req.body.title.trim()) {
            throw new Error("Must have valid text in the field")
        }


        const hoot = await Hoot.create(req.body)

        hoot._doc.author = req.user

        res.status(201).json({ hoot })
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
});

// GET	index	200	/hoots	List hoots

router.get("/", verifyToken, async (req, res) => {
    try {

        const hoots = await Hoot.find()

            .populate("author")
            .sort({ createdAt: "desc" })

        res.status(200).json(hoots)
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
});



module.exports = router;
