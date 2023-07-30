const express = require('express');
const router = express.Router();
const Judge = require('../models/judge');

// Search judges
router.post('', async (req, res) => {
  try {
    const searchKeyword = req.body.searchKeyword;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    const skip = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;

    // Find judges that match the search keyword with pagination
    const query = { $text: { $search: searchKeyword } };
    const projection = { SEGMENT_JTITLE: 0, SEGMENT_JFULL: 0 };

    const judges = await Judge.find(query, projection)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalItems = await Judge.countDocuments(query);

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


module.exports = router;