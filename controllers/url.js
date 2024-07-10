const shortid = require('shortid');
const { URL } = require('../models/url');

async function handlegenerateNewShortUrl(req, res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({ error: 'ULR is required!'});

    const shortID = shortid.generate();
    console.log(shortID);

    const newUrl = await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    console.log(newUrl);

    return res.status(200).json( {id: shortID });
}

async function handleRedirectUrl(req, res) {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, { $push: {
        visitHistory: {
            timestamp: Date.now(),
        },
    }});
    res.redirect(entry.redirectURL)
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({ totalClicks: result.visitHistory.length, 
                    analytics: result.visitHistory,
    })
}



module.exports = {
    handlegenerateNewShortUrl,
    handleRedirectUrl,
    handleGetAnalytics
}