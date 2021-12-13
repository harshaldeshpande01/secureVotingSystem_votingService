const Election = require('../models/Election.js');

exports.getElections = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 9;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await Election.countDocuments({});
        const Elections = await Election.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: Elections, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

exports.getAllElections = async (req, res) => {
    try {    
        const elections = await Election.find({});
        res.json({data: elections});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

exports.getElectionsBySearch = async (req, res) => {
    let { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, "i");
        const elections = await Election.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});
        res.json({ data: elections });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

exports.getElection = async (req, res) => { 
    const { id } = req.params;
    try {
        const election = await Election.findOne({ _id: id })
        let isAdmin = false;
        if(election.creator.toString() == req.uid) {
            isAdmin = true;
        }
        res.status(200).json({election, isAdmin});
    } catch (error) {
        res.status(404).json({ message: 'Document does not exist' });
    }
}

exports.createElection = async (req, res) => {
    const {title, description, creator, phase, tags, candidates} = req.body;
    const uid = req.uid;

    const newElection = new Election({ 
        title,
        description,
        creator: uid,
        phase,
        tags,
        candidates, 
        createdAt: new Date().toISOString() })
    try {
        await newElection.save();
        res.status(201).json(newElection);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
