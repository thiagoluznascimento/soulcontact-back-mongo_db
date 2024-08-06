import { Contato } from "../models/contato.js";
import { Router } from "express";
import { contatoValidation } from "../utils/validations.js";


export const contatosRouter = Router();

// INSERÇÃO DE CONTATOS [POST]
contatosRouter.post("/contatos", async(req, res)=>{
    // compara com a req que está sendo passado lá pelo insomia.. utiliza o Joi para comparar (contatoValidation está sendo importado)
    // error -> objeto com detalhes dos erros de validacao
    // value -> são os dados do req.body
    const { error, value } = contatoValidation.validate(req.body, { abortEarly: false });
    
    if(error) {
        // HTTP 400 - Bad Request- Indica que a requisição tem dados inválidos
        res.status(400).json({message: "Dados inválidos", error: error.details});
        return;
    }

    // Extrair as informações dos dados que foram validados anteriormente.
    const {nome, sobrenome, email, telefone, observacoes, favorito} = value;

    try {
        // Tratamento para adicionar novo contato
        const novoContato = new Contato({ nome, sobrenome, email, telefone, observacoes, favorito });
        await novoContato.save(); // para salvar no mongo
        res.json({message: "Contato criado com sucesso."});
    } catch(err) {
        // caso de erro
        res.status(500).json({message: "Um erro ocoreu ao adicionar contato", error: err});
    }
});


// LISTAGEM DE CONTATOS [GET]
contatosRouter.get("/contatos", async (rec,res) =>{
    // utilizamos o model de contato
    const lista = await Contato.find();
    res.json(lista);
});

contatosRouter.get("/contatos/:id", async (req, res) => {
    const contato = await Contato.findById(req.params.id).select('-__v'); // .select('__v') remove o campo __v ou qualquer que passar

    if(contato) {
        res.json(contato);
    }else{
        res.status(404).json({message: "Contato não encontrado."})
    }
});


// ATUALIZAÇÃO DE CONTATO [PUT]
contatosRouter.put("/contatos/:id", async (req, res) =>{
    const { error, value } = contatoValidation.validate(req.body, {abortEarly: false});

    if(error) {
        // 
        res.status(400).json({message: "Dados inválidos", error: error.details});
        return;
    }

    // Extrair as informações
    const { nome, sobrenome, email, telefone, observacoes, favorito } = value;

    try {
        // Ele procura pelo contato indicado pelo ID, se existir ele será atualizado.
        const contato = await Contato.findByIdAndUpdate(req.params.id, { nome, sobrenome, email, telefone, observacoes, favorito });

        if(contato) {
            res.json({message: "Contato atualizado com sucesso."});
        } else {
            res.status(404).json({message: "Contato não encontrado."})
        }
    }catch(err) {
        console.log(err);
        
        res.status(500).json({message: "Um erro ocorreu ao atualizar", error: err});
    }
});


// REMOÇÃO DE CONTATO [DELETE]
contatosRouter.delete("/contatos/:id", async (req, res) => {
    try {
        const contato = await Contato.findByIdAndDelete(req.params.id);
        if(contato) {
            res.json({message: "Contato removido com sucesso."})
        } else {
            res.status(404).json({message: "Contato não encontrado."});
        }
    } catch(err) {
        res.status(500).json({message: "Um erro ocorreu ao remover", error: err});
    }
})
