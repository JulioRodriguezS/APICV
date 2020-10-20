controllers = require('../controllers')
require('../dbcnn')
const { User, Skill, SkillLevel, Degree, Hobbie, Goal, Course, WorkExpertise } = require('../models')


module.exports = async (app, server) => {
    const router = server.Router()

    //user
    router.post('/user', async (req, res, next) => {
        const objReqBody = { userId, password } = req.body
        await User.findById(userId)
            .then(async (data) => {
                const findUser = new User(data)
                await findUser.matchPassword(password)
                    .then((data) => {                        
                        if (data) {
                            res.send(findUser)
                        } else {
                            res.send(`err: the password doesn't match`)
                        }
                    })
                    .catch((err) => {
                        res.send(`err: ${err}`)
                    })

            })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.post('/user/edit/:userId', async (req, res, next) => {
        //the whole process is 
        //check the empty elements and rejected if is necesary
        //search by email and rejected if allready exists in database
        //
        const { name, lastName, email, phoneNumb, country, city, cp, address, password } = req.body
        const actualUser = await User.findOne({ email: email })
        if (actualUser || match) {
            console.log('ok', actualUser)
        } else {
            console.log('not ok')
        }


        res.send(req.body)
    })
    router.post('/user/add', async (req, res, next) => {

        const { name, lastName, email, phoneNumb, country, city, cp, address, password } = req.body
        const newUser = new User({ name, lastName, email, phoneNumb, country, city, cp, address })

        if (isValid(name, 'str') && isValid(email, 'str') && isValid(password, 'str')) {

            const existMail = await User.findOne({ email: newUser.email })
            if (!existMail) {
                console.log('no existe')
                newUser.password = await newUser.setPassword(password)
                await newUser.save()
                    .then(() => { res.send('ok') })
                    .catch((err) => { res.send(`err: ${err}`) })

            } else {

                res.send(`err: the user email already exists`)

            }
        } else {

            res.status(400).json({ err: "bad request" })

        }
    })

    //skills
    /** skills: only use one time to fill the skill leves
     * for fill the skills levels we use the next object array    
       [
        {
        "skillLevel":3.9,
        "title":"begginer",
        "description":""
        },
        {
        "skillLevel":6.9,
        "title":"intermediate",
        "description":""
        },
        {
        "skillLevel":8.9,
        "title":"advance",
        "description":""
        },
        {
        "skillLevel":9.9,
        "title":"senior",
        "description":""
        }
        ]        
     */
    router.post('/skills/levels', async (req, res, next) => {
        const skillsObj = req.body
        for (skill of skillsObj) {
            const { title } = skill
            const existSkillLevel = await SkillLevel.findOne({ title: title })
            if (!existSkillLevel) {
                const newSkillLevel = new SkillLevel(skill)
                await newSkillLevel.save()
                    .then((data) => { res.send('ok') })
                    .catch((err) => { console.log(`err: ${err}`) })
            } else {
                res.send(`the skill level: ${title} is already defined`)
            }
        }
    })
    //to get all the skills levels
    router.get('/skills/levels/all', async (req, res, next) => {
        await SkillLevel.find({}).lean()
            .then((data) => {
                res.send(data)
            })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    //return the real level that have about the level of skill recieved
    router.get('/skills/levels/:level', async (req, res, next) => {
        let level = req.params.level
        const maxiumLevel = await SkillLevel.aggregate([{
            $group: {
                _id: "1",
                maxRange: { $max: "$skillLevel" }
            }
        }])
        const minimumLevel = await SkillLevel.aggregate([{
            $group: {
                _id: "1",
                minRange: { $min: "$skillLevel" }
            }
        }])
        if (level >= minimumLevel[0].minRange && level <= maxiumLevel[0].maxRange) {
            //we order from max to minus and go to for
            const levels = await SkillLevel.find({}).sort({ skillLevel: -1 })
            let auxLevel = 0
            for (l of levels) {
                if (level <= l.skillLevel) auxLevel = l.skillLevel
            }
            const realLevel = await SkillLevel.findOne({ skillLevel: auxLevel }).lean()
            res.send(realLevel)
        } else {
            res.send(`there is no levels in that range`)
        }
    })

    //degrees
    router.get('/degrees/:userId', async (req, res, next) => {

        const searchUser = await User.findById(req.params.userId)
        if (searchUser) {
            await Degree.findOne({ userId: searchUser._id })
                .then((data) => {
                    res.send(data)
                })
                .catch((err) => {
                    res.send(`err: user doesn't aggregate degree`)
                })
        } else {
            res.send(`err: user doesn't exist`)
        }
    })
    router.post('/degrees/add', async (req, res, next) => {
        const objReq = { userId, institutionName, carreerDescription, carrerTitle, gotCertified, institute, initialDate, finalDate } = req.body
        const newDegree = new Degree(objReq)
        await newDegree.save()
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.put('/degrees/edit/:degreeId', async (req, res, next) => {
        const objReq = { institutionName, carreerDescription, carrerTitle, gotCertified, institute, initialDate, finalDate } = req.body
        await Degree.findByIdAndUpdate(req.params.degreeId, objReq)
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.delete('/degree/delete/:degreeId', async (req, res, next) => {
        await Degree.findByIdAndDelete(req.params.degreeId)
            .then((data) => { res.send('successful') })
            .catch((err) => { res.send(`err: ${err}`) })
    })

    //hobbies
    router.get('/hobbies/:userId', async (req, res, next) => {
        await Hobbie.find({ userId: req.params.userId }).lean()
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(`err: ${err}`)
            })

    })
    router.post('/hobbies/add', async (req, res, next) => {
        const objReq = { userId, title, descripticon } = req.body
        const newHobbie = new Hobbie(objReq)
        await newHobbie.save()
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.put('/hobbies/edit/:hobbieId/', async (req, res, next) => {
        const objReq = { title, descripticon } = req.body
        await Hobbie.findByIdAndUpdate(req.params.hobbieId, objReq)
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.delete('/hobbies/delete/:hobbieId', async (req, res, next) => {
        await Hobbie.findByIdAndDelete(req.params.hobbieId)
            .then((data) => { res.send('successful') })
            .catch((err) => { res.send(`err: ${err}`) })
    })

    //goals
    router.get('/goals/:userId', async (req, res, next) => {
        await Goal.find({ userId: req.params.userId })
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.post('/goals/add', async (req, res, next) => {
        const objReq = { userId, descripticon } = req.body
        const newGoal = new Goal(objReq)
        await newGoal.save()
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.delete('/goals/delete/:goalId', async (req, res, next) => {
        await Goal.findByIdAndDelete(req.params.goalId)
            .then((data) => { res.send('successful') })
            .catch((err) => { res.send(`err: ${err}`) })
    })

    // //courses
    // router.get('/courses/:userId', async (req, res, next) => {
    //     await Course.findById({ userId: req.params.userId }).lean()
    //         .then((data) => {
    //             res.send(data)
    //         })
    //         .catch((err) => {
    //             res.send(`err: ${err}`)
    //         })

    // })
    // router.post('/courses/add/:userId')
    // router.put('/courses/edit/:courseId/:userId')
    // router.delete('/courses/delete/:courseId/:userId')

    // //workExperience
    // router.get('/workExperience/:userId', async (req, res, next) => {
    //     await WorkExpertise.findById({ userId: req.params.userId }).lean()
    //         .then((data) => {
    //             res.send(data)
    //         })
    //         .catch((err) => {
    //             res.send(`err: ${err}`)
    //         })

    // })
    // router.post('/workExperience/add/:userId')
    // router.put('/workExperience/edit/:workExperienceId/:userId')
    // router.delete('/workExperience/delete/:workExperienceId/:userId')


    const isValid = (word, type) => {
        let res = false
        switch (type) {
            case 'str':
                res = (word === '' ? false : true)
                break
            case 'num':
                res = (word.lenght > 0 ? true : false)
                break
            case 'bool':
                res = word
                break
        }
        return res
    }

    //middleware to use this router
    app.use(router)
}