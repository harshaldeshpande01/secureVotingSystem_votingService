const Election = require('../models/Election.js');

exports.setAlreadyVoted = async (req, res) => { 
    const { id } = req.params;
    try {
        const election = await Election.findOne({ _id: id })
        if(election.alreadyVoted.includes(req.uid)) {
            res.status(400).json({ "eligible": false });
        }
        election.alreadyVoted.push(req.uid);
        await election.save();
        res.status(200).json({"eligible": true});
    } catch (error) {
        res.status(404).json({ message: 'Document does not exist' });
    }
}