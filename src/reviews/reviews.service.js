const db = require("../db/connection");

const tableName = "reviews";

async function destroy(reviewId) {
  return db(tableName)
    .delete()
    .where({ review_id: reviewId})
}

async function read(reviewId) {
  return db("reviews").where({ review_id: reviewId }).first();
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  read,
  update,
};
