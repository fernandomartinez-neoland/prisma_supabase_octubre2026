import {getUserService, registerUserService} from '../services/user.service.js'
export function getUserController(req, res){
    res.status(200).send(getUserService())
}

export async  function setUserController(req, res){
    res.status(201).send(await registerUserService(req.body))
}