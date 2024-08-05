import Joi from "joi";

// Validação para a insercao/atualizacao de um contato
export const contatoValidation = Joi.object({
    nome: Joi.string().max(150).required(),
    sobrenome: Joi.string().max(150),
    email: Joi.string().email(),
    telefone: Joi.string().required(),
    observacoes: Joi.string().max(200),
    favorito: Joi.boolean()
});

// Adicione a validação via Joi no update de contato;