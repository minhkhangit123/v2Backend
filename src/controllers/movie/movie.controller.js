const database = require("./movie.database")
var _ = require('lodash');
const flags = require("../../configs/flags")

const getAllMovie = async (req, res, next) => {
    try {

        let dataResponse = await database.getAllMovie()

        res.statusCode = 200
        res.json(dataResponse)


    } catch (error) {
        flags.errorResponse(res, err)
    }
}

const getMovieById = async (req, res, next) => {
    try {
        let idUser = res.locals.userID

        let id = req.params.id
        let dataResponse = await database.getMovieById(id)
        let isLike = await database.checkLike(id, idUser)
        dataResponse["is_like"] = isLike != undefined ? isLike.is_like: 0

        if (dataResponse == null) {
            res.statusCode = 204
        }
        else {

            let results = await database.getTypeByMovieId(id)
            dataResponse["type"] = results
            res.statusCode = 200
        }
        res.json(dataResponse)

    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.json({
            message: error
        })
    }
}

const addMovieStart = async (req, res, next) => {
    try {

        let idMovies = req.body.arr_id_movie

        for (let i = 0; i < idMovies.length; i++) {
            let data = {
                idUser: res.locals.userID,
                idMovie: idMovies[i]
            }

            await database.insertMovieStart(data)
        }

        res.sendStatus(200)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

const getMovieSomeType = async (req, res, next) => {
    try {
        let results = []

        let types = req.body.arr_id_type
        for (let i = 0; i < types.length; i++) {
            if (!isNaN(types[i])) {
                results = results.concat(await database.getMovieByType(types[i]))
            }
        }

        let arrLength = req.body.number
        results = _.sampleSize(results, arrLength)

        res.statusCode = 200
        res.json(results)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

const addNewMovie = async (req, res, next) => {
    try {

        let data = req.body

        await database.insertMovie(data)

        res.sendStatus(201)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

const updateMovie = async (req, res, next) => {
    try {

        let data = req.body
        let idMovie = req.params.id

        await database.updateMovie(data, idMovie)

        res.sendStatus(200)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

const deleteWatchinglist = async (req, res, next) => {
    try {

        let idMovie = req.params.id
        let idUser = res.locals.userID

        await database.deleteWatchinglist(idMovie, idUser)

        res.sendStatus(200)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

const getType = async (req, res, next) => {
    try {

        let types = await database.getType()
        for (let i = 0; i < types.length; i++) {
            let obj = types[i]
            let count = await database.countMovieOfType(types[i].id)
            obj["movieCount"] = count[0].number
            delete obj.type
            types[i] = obj
        }

        res.statusCode = 200
        res.json(types)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

const getMovieByType = async (req, res, next) => {
    try {

        let idType = req.params.id

        let result = await database.getMovieByType(idType)

        res.statusCode = 200
        res.json(result)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

const getMovieByListId = async (req, res, next) => {
    try {

        var results = []

        let movieIds = req.body.arr_id_movie
        let idUser = res.locals.userID
        if (movieIds.length > 0)
            for (let i = 0; i < movieIds.length; i++) {
                let data = await database.getMovieById(movieIds[i])
                let data1 = await database.checkLike(movieIds[i], idUser)
                data["is_like"] = data1 != undefined ? data1.is_like: 0
                results.push(data)
            }

        res.statusCode = 200
        res.json(results)


    } catch (err) {
        console.error(err)
        flags.errorResponse(res, err)
    }
}

const addTimeWatcher = async (req, res, next) => {
    try {

        let idUser = res.locals.userID
        let idMovie = req.body.id_movie
        let value = req.body.value

        database.addTimeWatcher(idUser, idMovie, value)

        res.sendStatus(200)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}


const addClicked = async (req, res, next) => {
    try {

        let idUser = res.locals.userID
        let idMovie = req.body.id_movie
        let value = req.body.value

        database.addClicked(idUser, idMovie, value)

        res.sendStatus(200)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

const addUserTimeWatched = async (req, res, next) => {
    try {

        let idUser = res.locals.userID
        let idMovie = req.body.id_movie
        let value = req.body.value

        database.addUserTimeWatched(idUser, idMovie, value)

        res.sendStatus(200)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

const addLike = async (req, res, next) => {
    try {

        let idUser = res.locals.userID
        let idMovie = req.body.id_movie
        let value = req.body.value

        database.addLike(idUser, idMovie, value)

        res.sendStatus(200)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

const addPlayed = async (req, res, next) => {
    try {

        let idUser = res.locals.userID
        let idMovie = req.body.id_movie
        let value = req.body.value

        database.addPlayed(idUser, idMovie, value)

        res.sendStatus(200)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}


const getWatchingList = async (req, res, next) => {
    try {
        let idUser = res.locals.userID

        let results = await database.getWatchingList(idUser)

        res.statusCode = 200
        res.json(results)

    } catch (err) {
        flags.errorResponse(res, err)
    }
}

module.exports = {
    getAllMovie: getAllMovie,
    getMovieById: getMovieById,
    addMovieStart: addMovieStart,
    getMovieSomeType: getMovieSomeType,
    addNewMovie: addNewMovie,
    updateMovie: updateMovie,
    getType: getType,
    getMovieByType: getMovieByType,
    getMovieByListId: getMovieByListId,
    addTimeWatcher: addTimeWatcher,
    addClicked: addClicked,
    addUserTimeWatched: addUserTimeWatched,
    getWatchingList: getWatchingList,
    deleteWatchinglist: deleteWatchinglist,
    addLike: addLike,
    addPlayed: addPlayed
}