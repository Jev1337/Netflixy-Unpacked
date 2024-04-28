window.onload = function () {
    try {
        updateHost()
            .then(response => response.json())
            .then(data => {
                BACKEND_URL_BASE = 'http://' + data.host + ':' + data.port
                BACKEND_URL_BASE_S = 'https://' + data.host

                if (data.maintenance == true) {
                    window.location.href = "/maintenance.html"
                } else {
                    isFBConnected().then(access_token => {
                        if (access_token) {
                            getProfileId(function (profile_id) {
                                // Validate user through Netflixy's API
                                validateUser(access_token, profile_id)
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.result == 'success') {
                                            window.location.href = "/dashboard.html";
                                        }
                                        else {
                                            chrome.runtime.sendMessage({ msg: "set", data: data.message }, (response) => {
                                                if (response) {
                                                    window.location.href = "/login.html";
                                                } else {
                                                    showError("Une erreur est survenue, veuillez réinstaller l'extension.");
                                                }
                                            });

                                            setTimeout(function () {
                                                showError("Une erreur est survenue, veuillez réinstaller l'extension.");
                                            }, 5000)
                                        }
                                    })
                            })
                        } else {
                            window.location.href = "/login.html";
                        }
                    })
                }
            })
    } catch (error) {
        showError(error)
    }
}

function showError(message) {
    let loginErrorText = document.getElementById("loginErrorText");
    loginErrorText.classList.remove('hidden');
    loginErrorText.innerHTML = message;
}
