import { Usuario } from "../models/usuario.js";
import { Router } from "express";
import { usuarioValidation } from "../utils/validations.js";

export const usuariosRouter = Router();

usuariosRouter.post("/usuarios", async(req, res)=>{
    // Validando com o Joi
    const { error, value } = usuarioValidation.validate(req.body);

    if(error) {
        res.status(400).json({message: "Dados invalidos", error: error.details});
    }

    const {nome, email, senha} = value;
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

