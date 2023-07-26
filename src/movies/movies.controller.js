const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found`});
}

async function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data: data });
}

async function list(req, res) {
  res.json({ data: await service.list(req.query.is_showing) });
}

async function listReviews(req, res) {
  const { movieId } = req.params;
  const reviews = await service.listReviews(movieId);
  for (const review of reviews) {
    review.critic = await service.readCritic(review.critic_id);
    delete review.critic_id;
  }
  res.json({ data: reviews });
}

async function listTheaters(req, res) {
  res.json({ data: await service.listTheaters(req.params.movieId) });
}

module.exports = {
  list,
  listReviews: [asyncErrorBoundary(listReviews)],
  listTheaters: [asyncErrorBoundary(listTheaters)],
  read: [asyncErrorBoundary(movieExists), read],
};
