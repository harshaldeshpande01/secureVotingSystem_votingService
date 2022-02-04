const Election = require('../models/Election.js');
const sendEmail = require("../utils/mail");

exports.getElections = async (req, res) => {
    const { page, title } = req.query;
    
    try {
        const LIMIT = 9;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

        const total = await Election.countDocuments({ "title": { "$regex": title, "$options": "i" } });
        // const Elections = await Election.find({'title': 'new'}).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        const Elections = await Election.find({ "title": { "$regex": title, "$options": "i" } }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

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

// exports.getElectionsBySearch = async (req, res) => {
//     let { searchQuery, tags } = req.query;
//     try {
//         const title = new RegExp(searchQuery, "i");
//         const elections = await Election.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});
//         res.json({ data: elections });
//     } catch (error) {    
//         res.status(404).json({ message: error.message });
//     }
// }

exports.getElection = async (req, res) => { 
    const { id } = req.params;
    try {
        const election = await Election.findOne({ _id: id })
        let isAdmin = false;
        if(election.creator.toString() == req.uid) {
            isAdmin = true;
        }
        let isRegistered = false;
        if(election.registeredVoters.includes(req.uid)) {
            isRegistered = true;
        }
        res.status(200).json({election, isAdmin, isRegistered});
    } catch (error) {
        res.status(404).json({ message: 'Document does not exist' });
    }
}

exports.deleteElection = async (req, res) => { 
    const { id } = req.params;
    try {
        const election = await Election.findOne({ _id: id })
        let isAdmin = false;
        if(election.creator.toString() == req.uid) {
            isAdmin = true;
        }
        if(isAdmin) {
            await Election.deleteOne({ _id: id });
            res.status(200).json({"success": true});
        }
        else {
            res.status(400).json({"message": "Only admin can delete a election"});
        }
    } catch (error) {
        res.status(400).json({ message: 'Document does not exist' });
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


exports.registerVoter = async (req, res) => {
    const { id } = req.params;
    const uid = req.uid; 
    const umail = req.umail;   
    try {
        const election = await Election.findOne({ _id: id })
        election.registeredVoters.push(uid);
        election.registeredEmails.push(umail);
        await election.save();
        res.status(200).json({ message: "Registered voter succesfully" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

exports.startVotingPhase = async (req, res) => { 
    const { id } = req.params;
    try {
        const election = await Election.findOne({ _id: id })
        let isAdmin = false;
        if(election.creator.toString() == req.uid) {
            isAdmin = true;
        }
        if(isAdmin) {
            election.phase = 'voting';
            await election.save();
            election.registeredEmails.map(mailid => {
                console.log(`Sending mail to ${mailid}`)
                const url = `http://secure-voting-system-frontend-next-js.vercel.app/login`;
                const message = `
                    <p>Dear User, Voting for the election ${election.title} which you had registered for, has started. Please visit our platform to submit your vote</p>
                    <a href=${url} clicktracking=off>${url}</a>
                `;
                try{
                    sendEmail({
                        to: mailid,
                        subject: 'Voting has started!!',
                        text: message
                    });
                }
                catch(err) {
                    console.log(err);
                }
            })
            res.status(200).json({"success": true});
        }
        else {
            res.status(400).json({"message": "Only admin can change phase"});
        }
    } catch (error) {
        res.status(400).json({ message: 'Document does not exist' });
    }
}

exports.endElection = async (req, res) => { 
    const { id } = req.params;
    try {
        const election = await Election.findOne({ _id: id })
        let isAdmin = false;
        if(election.creator.toString() == req.uid) {
            isAdmin = true;
        }
        if(isAdmin) {
            election.phase = 'results';
            await election.save();
            res.status(200).json({"success": true});
        }
        else {
            res.status(400).json({"message": "Only admin can change phase"});
        }
    } catch (error) {
        res.status(400).json({ message: 'Document does not exist' });
    }
}
