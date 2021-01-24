/**
 * 
 * https://stackoverflow.com/questions/52880434/problem-with-access-token-in-strava-api-v3-get-all-athlete-activities
 * 
 * Reference the above to retrieve an access token from Strava.
 * 
 * Ideally we will receive this from the client!
 * 
 * 
 */
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const stravaApi = require('strava-v3')

const strava = new stravaApi.client(process.env.STRAVA_ACCESS_TOKEN);

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

// get athlete
app.get('/athlete', (req, res) => {
    strava.athlete.get({})
        .then(val => res.status(200).send(val))
        .catch(err => res.status(err.statusCode).send(err.message))
});

// get athlete activities
app.get('/athlete/activities', (req, res) => {
    strava.athlete.listActivities({page: 1, perPage: 10 })
        .then(val => res.status(200).send(val))
        .catch(err => res.status(err.statusCode).send(err.message))
});

// get athlete stats by id
app.get('/athletes/:id/stats', (req, res) => {
    strava.athletes.stats({ id: req.params.id })
        .then(val => res.status(200).send(val))
        .catch(err => res.status(err.statusCode).send(err.message))
});

// get athlete stats by id
app.get('/athletes/:id/mile_time_avg', (req, res) => {
    strava.athletes.stats({ id: req.params.id })
        .then(val => {
            const avgTotal = (stats.all_run_totals.moving_time / 60) / (stats.all_run_totals.distance / 1609.344);
            const ytdTotal = (stats.ytd_run_totals.moving_time / 60) / (stats.ytd_run_totals.distance / 1609.344);
            const recentTotal = (stats.recent_run_totals.moving_time / 60) / (stats.recent_run_totals.distance / 1609.344);
            res.status(200).send({ all_mile_time_avg: avgTotal.toFixed(2), ytd_mile_time_avg: ytdTotal.toFixed(2), recent_mile_time_avg: recentTotal.toFixed(2) });
        })
        .catch(err => res.status(err.statusCode).send(err.message))
});