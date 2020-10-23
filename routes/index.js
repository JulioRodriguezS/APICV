require('../dbcnn')
const { User, Skill, SkillLevel, Degree, Hobbie, SocialNetwork, Goal, Course, WorkExpertise } = require('../models')


module.exports = async (app, server) => {
    const router = server.Router()

    //get user information
    router.get('/user/:userId', async (req, res, next) => {
        const userId = req.params.userId
        await User.findById(userId)
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.put('/user/edit', async (req, res, next) => {
        const { userId, name, lastName, phoneNumb, country, city, cp, address, actualPassword, newPassword } = req.body
        await User.findById(userId)
            .then(async (data) => {
                const findUser = new User(data)
                await findUser.matchPassword(actualPassword)
                    .then(async (data) => {
                        if (data) {
                            const newUser = { name, lastName, phone, country, city, cp, address, password } = { name, lastName, phoneNumb, country, city, cp, address, newPassword }
                            await User.findByIdAndUpdate(userId, newUser)
                                .then((data) => { res.send(data) })
                                .catch((err) => { res.send(`err: ${err}`) })
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
    router.post('/user/add', async (req, res, next) => {

        const { name, lastName, email, phoneNumb, country, city, cp, address, password } = req.body
        const newUser = new User({ name, lastName, email, phoneNumb, country, city, cp, address })

        if (isValid(name, 'str') && isValid(email, 'str') && isValid(password, 'str')) {
            const existMail = await User.findOne({ email: newUser.email })
            if (!existMail) {
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
    //add skills to user, you have to pass an array of objects
    router.post('/skills/add', async (req, res, next) => {
        const skillsArr = req.body
        const resp = []
        for (skill of skillsArr) {
            const newSkill = new Skill(skill)
            await newSkill.save()
                .then((data) => { resp.push({ "successfully saved": data }) })
                .catch((err) => { resp.push({ "err": err }) })
        }
        res.send(resp)
    })
    router.get('/skills/:userId', async (req, res, next) => {
        await Skill.find({ userId: req.params.userId }).lean().sort({ skillLevel: -1 })
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.delete('/skills', async (req, res, next) => {
        await Skill.findByIdAndDelete(req.body.skillId)
            .then((data) => { res.send('successful') })
            .catch((err) => { res.send(`err: ${err}`) })
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
        const { degreeId, institutionName, carreerDescription, carrerTitle, gotCertified, institute, initialDate, finalDate } = req.body
        await Degree.findByIdAndUpdate(degreeId, { institutionName, carreerDescription, carrerTitle, gotCertified, institute, initialDate, finalDate })
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.delete('/degree/delete', async (req, res, next) => {
        await Degree.findByIdAndDelete(req.body.degreeId)
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
        const objReq = { userId, title, description, icon, setView } = req.body
        const newHobbie = new Hobbie(objReq)
        await newHobbie.save()
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.put('/hobbies/edit', async (req, res, next) => {
        const { hobbieId, title, descripticon, icon, setView } = req.body
        await Hobbie.findByIdAndUpdate(hobbieId, { title, descripticon, icon, setView })
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.delete('/hobbies/delete', async (req, res, next) => {
        await Hobbie.findByIdAndDelete(req.body.hobbieId)
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
        const objReq = { userId, descripticon, setView } = req.body
        const newGoal = new Goal(objReq)
        await newGoal.save()
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.delete('/goals/delete', async (req, res, next) => {
        await Goal.findByIdAndDelete(req.body.goalId)
            .then((data) => { res.send('successful') })
            .catch((err) => { res.send(`err: ${err}`) })
    })

    //social networks
    router.get('/social-network/:userId', async (req, res, next) => {
        const userId = req.params.userId
        await SocialNetwork.findOne({ userId }).lean()
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(`err: ${err}`)
            })
    })
    router.post('/social-network/add', async (req, res, next) => {
        const objReq = { userId, networkName, networkLink } = req.body
        const newSN = new SocialNetwork(objReq)
        await newSN.save()
            .then((data) => { res.send(data) })
            .catch((err) => { res.send(`err: ${err}`) })
    })
    router.delete('/social-network/delete', async (req, res, next) => {
        await SocialNetwork.findByIdAndDelete(req.body.socialNetworkId)
            .then((data) => { res.send('successful') })
            .catch((err) => { res.send(`err: ${err}`) })
    })

    //courses
    router.get('/courses/:userId', async (req, res, next) => {         
        await Course.find({userId:req.params.userId}).lean()
            .then((data) => {
                console.log(data)
                res.send(data)
            })
            .catch((err) => {
                res.send(`err: ${err}`)
            })
    })
    //we recieve an array of object of courses
    router.post('/courses/add', async (req, res, next) => {
        const coursesArr = req.body
        const resp = []
        for (course of coursesArr) {
            const newCourse = new Course(course)
            await newCourse.save()
                .then((data) => { resp.push({ "successfully saved": data }) })
                .catch((err) => { resp.push({ "err": err }) })
        }
        res.send(resp)
    })
    router.delete('/courses/delete', async (req, res, next) => {
        await Course.findByIdAndDelete(req.body.courseId)
            .then((data) => { res.send('successful') })
            .catch((err) => { res.send(`err: ${err}`) })
    })

    //workExperience
    router.get('/work-experience/:userId', async (req, res, next) => {
        const userId = req.params.userId
        await WorkExpertise.find({userId}).sort({finalDate:-1}).lean()
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(`err: ${err}`)
            })
    })
    //we recieve an array of object of work experiences
    router.post('/work-experience/add', async (req, res, next) => {
        const workExpertiseArr = req.body
        const resp = []
        for (workExpertise of workExpertiseArr) {
            const newWorkExpertise = new WorkExpertise(workExpertise)
            await newWorkExpertise.save()
                .then((data) => { resp.push({ "successfully saved": data }) })
                .catch((err) => { resp.push({ "err": err }) })
        }
        res.send(resp)
    })
    //recibe on post or delete method workExpertiseId
    router.delete('/work-experience/delete', async (req, res, next) => {
        await WorkExpertise.findByIdAndDelete(req.body.workExpertiseId)
            .then((data) => { res.send('successful') })
            .catch((err) => { res.send(`err: ${err}`) })
    })


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