import { Usuario } from "../models/usuario.js";
import { Router } from "express";
// import { contatoValidation } from "../utils/validations";

export const usuariosRouter = Router();

usuariosRouter.post("/usuarios", async(req, res)=>{
    const {nome, email, senha} = req.body;
    try {
        // tratamento para add novo usuario
        const novoUsuario = new Usuario({nome, email, senha});
        await novoUsuario.save();
        res.json({message: "Usuário criado com sucesso."})
    } catch(err) {
        res.status(500).json({messagem: "Um erro ocorreu ao adicionar usuário.", error: err})
    }
});

// Listar usuario [GET]
usuariosRouter.get("/usuarios", async (rec, res)=>{
    const lista = await Usuario.find();
    res.json(lista);
});

