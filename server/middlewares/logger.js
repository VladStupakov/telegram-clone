export default function logger(req, res, next) {
    if(req.user){
        next()
    }
    else{
        res.json({error: 'login error'})
    }
}

