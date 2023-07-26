const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.`});
}

async function destroy(req, res) {
  await service.destroy(req.params.reviewId);
  res.sendStatus(204);
}

async function update(req, res) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id
  };
  const data = await service.update(updatedReview)
  res.json({ data: data });
}

module.exports = {
  destroy: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  update: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
