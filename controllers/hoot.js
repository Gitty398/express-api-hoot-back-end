const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Hoot = require("../models/hoot.js");
const { findById } = require("../models/user.js");
const router = express.Router();

/* 

POST	createComment	200	/hoots/:hootId/comments	Create a comment 
*/

// add routes here

// controllers/hoots.js



// DELETE	deleteHoot	200	/hoots/:hootId	Delete a hoot

router.delete("/:hootId", verifyToken, async (req, res) => {
    try {

        const hootToDelete = await Hoot.findById(req.params.hootId)

        if (!hootToDelete) {
            res.status(404);
            throw new Error("Could not find Hoot to delete")
        }

        if (!hootToDelete.author.equals(req.user._id)) {
            res.status(403)
            throw new Error("You are not authorized to delete this Hoot")
        }

        await hootToDelete.deleteOne()

        res.status(200).json(hootToDelete)

    } catch (error) {

        if (res.statusCode === 403, 404) {
            res.json({ err: error.message })
        } else {
            res.status(500).json({ err: error.message })
        }
    }
});






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

// PUT	update	200	/hoots/:hootId	Update a hoot

router.put("/:hootId", verifyToken, async (req, res) => {
    try {


        const foundHoot = await Hoot.findById(req.params.hootId)

        if (!foundHoot.author.equals(req.user._id)) {
            res.status(403).json
            throw new Error("You can only edit Hoots you own")
        }


        if (!['News', 'Sports', 'Games', 'Movies', 'Music', 'Television'].includes(req.body.category))
            throw new Error(`${req.body.category} is not a valid category`)

        if (!req.body.text.trim() || !req.body.title.trim()) {
            throw new Error("Must have valid text in the field")
        }

        const updatedHoot = await Hoot.findByIdAndUpdate(req.params.hootId, req.body, { new: true })

        if (!updatedHoot) {
            throw new Error("Failed to update hoot. Please try again")
        }

        updatedHoot._doc.author = req.user


        res.status(200).json(updatedHoot)

    } catch (error) {
        if (res.statusCode === 403) {
            res.json({ err: error.message })
        } else {
            res.status(500).json({ err: error.message })
        }
    }
});





// GET	show	200	/hoots/:hootId	Get a single hoot

router.get("/:hootId", verifyToken, async (req, res) => {
    try {

        const hoot = await Hoot.findById(req.params.hootId).populate("author")
        if (!hoot) {
            res.status(404)
            throw new Error("Cannot find Hoot. Please select another Hoot")
        }
        res.status(200).json(hoot)
    } catch (error) {
        if (res.statusCode === 404) {
            res.json({ err: error.message })
        } else {
            res.status(500).json({ err: error.message })
        }

    }
});





module.exports = router;
