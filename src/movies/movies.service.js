const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  return db("movies").select("*").where({ "movies.movie_id": movie_id }).first();
}

async function listReviews(movie_id) {
  return db("movies as m")
    .select("*")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .where({ "m.movie_id": movie_id })
}

async function readCritic(critic_id) {
  return db("critics")
    .select("*")
    .where({ critic_id: critic_id })
    .first()
}

async function listTheaters(movie_id) {
  return db("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where({ "mt.movie_id": movie_id })
}

module.exports = {
  list,
  read,
  listReviews,
  readCritic,
  listTheaters
};
