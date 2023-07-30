const express = require('express');
const router = express.Router();
const jieba = require('nodejieba');
const Judge = require('../models/judge');

// Get judges with pagination
router.get('', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    const skip = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;

    const judges = await Judge.find()
      .skip(skip)
      .limit(limit)
      .exec();

    const totalItems = await Judge.countDocuments();

    res.json({
      totalItems: totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      itemsPerPage: itemsPerPage,
      data: judges,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create or update judge
router.post('', async (req, res) => {
  try {
    const judgeData = req.body;

    // jieba
    judgeData['SEGMENT_JTITLE'] = jieba.cutForSearch(judgeData.JTITLE, true).join(' ');
    judgeData['SEGMENT_JFULL'] = jieba.cutForSearch(removeNewlinesAndSpaces(judgeData.JFULL), true).join(' ');

    const updatedJudge = await Judge.findOneAndUpdate({ _id: judgeData.JID }, judgeData, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    res.status(201).json(updatedJudge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get judge by JID
router.get('/:id', getJudge, async (req, res) => {
  res.json(res.judge)
});

// Delete judge
router.delete('/:id', getJudge, async (req, res) => {
  try {
    await Judge.findOneAndDelete({ _id: res.judge._id });
    res.status(204).json({});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware function to get a single judge by JID
async function getJudge(req, res, next) {
  try {
    const judge = await Judge.findById(req.params.id);
    if (!judge) {
      return res.status(404).json({ message: 'Judge not found' });
    }
    res.judge = judge;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

function removeNewlinesAndSpaces(text) {
  // Use regular expressions to replace "\n", "\r", and spaces with an empty string
  return text.replace(/[\n\r\s]/g, '');
}

module.exports = router;
