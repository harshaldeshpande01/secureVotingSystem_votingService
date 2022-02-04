const sendEmail = require("../utils/mail");

exports.voteConfirmed = async (req, res) => {
    const { txn } = req.body;
    const email = req.umail;
    console.log(email);
    const url = `https://rinkeby.etherscan.io/tx/${txn}`;
    const message = `
        <p>Your vote has been successfully recorded on the blockchain. Follow this URL to review your transaction</p>
        <a href=${url} clicktracking=off>${url}</a>
    `;

    sendEmail({
        to: email,
        subject: 'Vote recorded succesfully!',
        text: message
    });
    res.status(200).json({
        success: true
    });
}

