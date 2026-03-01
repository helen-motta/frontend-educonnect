import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import "./Login.css";
import "./RedefinirSenha.css"; 
import LoadingOverlay from './LoadingOverlay';

export default function RedefinirSenha() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    const API_URL = import.meta.env.VITE_API_URL;

    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'danger' });

    const showNotification = (message, type = 'danger') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
        return showNotification("As senhas não coincidem!");
    }

    try {
        setLoading(true); 

        const response = await fetch(`${API_URL}/Auth/reset-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email,
                token: token, 
                novaSenha: novaSenha 
            })
        });

        if (response.ok) {
            showNotification("Senha alterada com sucesso!", "success");

            setTimeout(() => {
                navigate('/login');
            }, 1500); 

        } else {
            setLoading(false);
            const data = await response.json();
            showNotification(data.message || "Token inválido ou expirado.");
        }
    } catch (error) {
        setLoading(false);
        showNotification("Erro ao conectar ao servidor.");
    } 
};

    return (
        <>
        {loading && <LoadingOverlay />}
        <div className="wrapper d-flex align-items-center justify-content-center">
            
            <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
                <div className={`toast align-items-center text-white bg-${toast.type} border-0 ${toast.show ? 'show' : 'hide'}`} role="alert">
                    <div className="d-flex">
                        <div className="toast-body">{toast.message}</div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ ...toast, show: false })}></button>
                    </div>
                </div>
            </div>

            <div className="container d-flex justify-content-center">
                <div className="form-container">
                    
                    <div className="text-center mb-4 logo-container">
                        <img 
                            src="/imagens/logo-educonnect.png" 
                            alt="Logo EduConnect" 
                        />
                    </div>

                    <div className="text-center mb-4">
                        <h4 className="form-title">Redefinir Senha</h4>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Nova Senha"
                                required
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                disabled={loading}
                            />
                            <label htmlFor="floatingPassword">Nova senha</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingConfirmar"
                                placeholder="Confirmar Senha"
                                required
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                disabled={loading}
                            />
                            <label htmlFor="floatingConfirmar">Confirmar nova senha</label>
                        </div>

                        <button
                            type="submit" 
                            className="btn btn-lg w-100 submit-button"
                            disabled={loading}
                        >
                            {loading ? "Salvando..." : "Atualizar senha"}
                        </button>
                    </form>
                    
                    <div className="text-center mt-4">
                        <button 
                            onClick={() => navigate('/login')}
                            className="btn btn-link text-decoration-none p-0 back-button"
                        >
                            ← Voltar para o login
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}