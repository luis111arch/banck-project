async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));cd
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}


function mostrarSenha() {
  const senhaInput = document.getElementById("password");
  senhaInput.type = senhaInput.type === "password" ? "text" : "password";
}


document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    const loginPage = document.getElementById("username");
    if (loginPage) login(); 
  }
});

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const lembrar = document.getElementById("Lembrete").checked;

  if (!username || !password) {
    alert("Preencha todos os campos.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuarioEncontrado = usuarios.find(u => u.usuario === username);

  if (!usuarioEncontrado) {
    alert("Usuário não encontrado.");
    return;
  }

  const senhaHash = await hashPassword(password);

  if (usuarioEncontrado.senha === senhaHash) {
    alert("Login concluído!");

    if (lembrar) {
      localStorage.setItem("usuarioLembrado", username);
    } else {
      localStorage.removeItem("usuarioLembrado");
    }

  } else {
    alert("Senha incorreta.");
  }
}

async function cadastrar() {
  const usuario = document.getElementById("novoUsuario").value.trim();
  const senha = document.getElementById("novaSenha").value.trim();

  if (!usuario || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  const usuarioJaExiste = usuarios.some(u => u.usuario.toLowerCase() === usuario.toLowerCase());

  if (usuarioJaExiste) {
    alert("Este nome de usuário já está em uso. Escolha outro.");
    return;
  }

  const senhaHash = await hashPassword(senha);
  usuarios.push({ usuario, senha: senhaHash, senhaOriginal: senha });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Usuário cadastrado com sucesso!");
  window.location.href = "login.html";
}

window.addEventListener('DOMContentLoaded', () => {
  const lembrado = localStorage.getItem("usuarioLembrado");
  if (lembrado) {
    document.getElementById("username").value = lembrado;
    document.getElementById("Lembrete").checked = true;

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuario = usuarios.find(u => u.usuario === lembrado);
    if (usuario && usuario.senhaOriginal) {
      document.getElementById("password").value = usuario.senhaOriginal;
    }
  }
});

function esqueciSenha() {
  const username = document.getElementById("username").value.trim();

  if (!username) {
    alert("Digite seu nome de usuário primeiro.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuarioEncontrado = usuarios.find(u => u.usuario === username);

  if (!usuarioEncontrado) {
    alert("Usuário não encontrado.");
    return;
  }

  if (usuarioEncontrado.senhaOriginal) {
    alert(`Sua senha é: ${usuarioEncontrado.senhaOriginal}`);
  } else {
    alert("Senha não disponível para recuperação.");
  }
}
