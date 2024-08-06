import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    senha: {
        type: String,
        unique: true
    }
});

// Middleware para hashear a senha antes de salvar
UsuarioSchema.pre('save', async function (next) {
    const usuario = this; // Documento que está sendo salvo.
    if (!usuario.isModified('senha')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(usuario.senha, salt);
        usuario.senha = hash;
        next();
    } catch (err) {
        next(err);
    }
});

// Criação do modelo
export const Usuario = mongoose.model('Usuario', UsuarioSchema);