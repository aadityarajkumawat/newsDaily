const router = require("express").Router();
const auth = require("../middleware/auth");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("38b943e5c1ea4d2cb89a3ae390e644c4");
// 6dd98f20e4be4c3c82484a72119c77c7
// 8de0a886e62c4bf6be4122b730e97e72
router.get("/headlines", auth, (req, res) => {
  newsapi.v2
    .topHeadlines({
      country: "in",
    })
    .then((response) => {
      const result = response.articles;
      return res.status(200).json(result);
    });
});

router.post("/newssearch/:query/:page", auth, (req, res) => {
  const searchQuery = req.params.query;
  const pageNum = req.params.page;
  newsapi.v2
    .everything({
      q: searchQuery,
      page: pageNum,
    })
    .then((response) => {
      const result = response.articles;
      return res.status(200).json(result);
    });
});

module.exports = router;
